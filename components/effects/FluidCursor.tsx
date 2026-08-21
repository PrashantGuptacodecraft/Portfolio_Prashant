"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
//
// FluidCursor — full-screen WebGL fluid simulation that reacts to pointer
// movement, adapted from the classic GPU fluid-sim pipeline (Navier–Stokes via
// advection / divergence / curl / vorticity / Jacobi pressure / gradient
// subtraction), wrapped as a self-contained, theme-aware React component.
//
// Behaviour:
//  - WebGL2 with a WebGL1 fallback; if WebGL is unavailable it renders nothing.
//  - Reads the global toggle store (useFluidEnabled). When OFF it fades out and
//    PAUSES the RAF loop; when ON it fades in and resumes.
//  - Pauses while the tab is hidden (visibilitychange).
//  - Respects prefers-reduced-motion (never initialises the sim).
//  - Half/float textures where supported, with a manual-bilinear advection
//    fallback for devices without linear filtering on float textures.
//  - DPR capped (MAX_DPR) so high-density mobile screens don't melt.
//
// The canvas uses `mix-blend-mode: screen`, so its black background contributes
// nothing over the page (screen blend: 0 is a no-op) and only the bright dye
// trails tint the content — keeping everything readable. pointer-events-none
// throughout so it never blocks clicks/hover.

import { useEffect, useRef, useState } from "react";
import { useFluidEnabled } from "@/lib/hooks/useFluidEnabled";

/* ============================================================================
 *  TUNING CONSTANTS — tweak these first if it feels too intense / too subtle.
 * ========================================================================== */
const SIM_RESOLUTION = 128; // velocity/pressure grid (lower = cheaper, blurrier)
const DYE_RESOLUTION = 256; // color grid (desktop) — was 512, halved for perf
const DYE_RESOLUTION_MOBILE = 128; // color grid (touch / small screens) — was 256
const DENSITY_DISSIPATION = 0.97; // how fast color fades (lower = fades faster)
const VELOCITY_DISSIPATION = 0.98; // how fast motion settles
const PRESSURE = 0.8; // pressure retained between frames
const PRESSURE_ITERATIONS = 10; // Jacobi solver iterations — was 20, halved for perf
const CURL = 18; // vorticity (swirl) strength — subtle
const SPLAT_RADIUS = 0.25; // size of each injected blob — was 0.2, slightly larger
const SPLAT_FORCE = 6000; // velocity injected per pointer move
const SHADING = true; // 3D-ish shaded display pass
const MAX_DPR = 1.5; // cap device-pixel-ratio for performance

// Colour palette. "theme" biases hue toward cyan/violet/mint; "rainbow" cycles
// the full spectrum at reduced saturation/brightness so it stays premium.
const COLOR_PALETTE: "theme" | "rainbow" = "theme";
const COLOR_INTENSITY = 0.15; // overall dye brightness (keep low — it accumulates)
const COLOR_UPDATE_SPEED = 8; // how fast the hue cycles

/* ============================================================================
 *  Colour helpers
 * ========================================================================== */
type RGB = { r: number; g: number; b: number };

function HSVtoRGB(h: number, s: number, v: number): RGB {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0,
    g = 0,
    b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r, g, b };
}

// Slowly-advancing hue shared across splats for a smooth spectrum sweep.
let hueCursor = 0;
function nextColor(): RGB {
  let h = hueCursor % 1;
  let s: number;
  let v: number;
  if (COLOR_PALETTE === "theme") {
    // Map the cycling value into a cyan→mint→violet band (~150°–270°).
    h = 0.42 + h * (0.75 - 0.42);
    s = 0.85;
    v = 1.0;
  } else {
    s = 0.6; // lower saturation keeps rainbow tasteful
    v = 0.9;
  }
  const c = HSVtoRGB(h, s, v);
  c.r *= COLOR_INTENSITY;
  c.g *= COLOR_INTENSITY;
  c.b *= COLOR_INTENSITY;
  return c;
}

/* ============================================================================
 *  Component
 * ========================================================================== */
export function FluidCursor() {
  const [enabled] = useFluidEnabled();
  const [hasInitialized, setHasInitialized] = useState(enabled);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Lets the persistent RAF loop see the latest `enabled` without re-init.
  const enabledRef = useRef(enabled);
  const controlRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  // Keep the loop's view of `enabled` current + drive fade and start/stop.
  useEffect(() => {
    enabledRef.current = enabled;
    if (enabled) setHasInitialized(true);
    
    const canvas = canvasRef.current;
    if (canvas) canvas.style.opacity = enabled ? "1" : "0";

    if (enabled) controlRef.current?.start();
    else {
      // Let it fade out before pausing the loop.
      const t = window.setTimeout(() => controlRef.current?.stop(), 320);
      return () => window.clearTimeout(t);
    }
  }, [enabled]);

  // One-time WebGL setup.
  useEffect(() => {
    if (!hasInitialized) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      // ---- Context + extensions ------------------------------------------------
      const ctx = getWebGLContext(canvas);
      if (!ctx) return; // No WebGL → fail silently.
      const { gl, ext } = ctx;

    /* ----- GLSL ------------------------------------------------------------- */
    const baseVertexShader = compileShader(
      gl,
      gl.VERTEX_SHADER,
      `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;
        void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `,
    );

    const copyShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        void main () { gl_FragColor = texture2D(uTexture, vUv); }
      `,
    );

    const clearShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;
        void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
      `,
    );

    const displayShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
        uniform vec2 texelSize;
        void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;
          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);
          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
          c *= diffuse;
        #endif
          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
        }
      `,
      SHADING ? ["SHADING"] : [],
    );

    const splatShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;
        void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
        }
      `,
    );

    // Advection — uses true bilinear sampling when the device supports linear
    // filtering on float textures, otherwise a manual 4-tap bilinear fallback.
    const advectionShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;
        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);
          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }
        void main () {
        #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
        #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
        #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
        }
      `,
      ext.supportLinearFiltering ? [] : ["MANUAL_FILTERING"],
    );

    const divergenceShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `,
    );

    const curlShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;
        void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `,
    );

    const vorticityShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;
        void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `,
    );

    const pressureShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `,
    );

    const gradientSubtractShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;
        void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `,
    );

    // ---- Programs ------------------------------------------------------------
    const copyProgram = new Program(gl, baseVertexShader, copyShader);
    const clearProgram = new Program(gl, baseVertexShader, clearShader);
    const splatProgram = new Program(gl, baseVertexShader, splatShader);
    const advectionProgram = new Program(gl, baseVertexShader, advectionShader);
    const divergenceProgram = new Program(gl, baseVertexShader, divergenceShader);
    const curlProgram = new Program(gl, baseVertexShader, curlShader);
    const vorticityProgram = new Program(gl, baseVertexShader, vorticityShader);
    const pressureProgram = new Program(gl, baseVertexShader, pressureShader);
    const gradientSubtractProgram = new Program(gl, baseVertexShader, gradientSubtractShader);
    const displayProgram = new Program(gl, baseVertexShader, displayShader);

    // ---- Fullscreen quad blit ------------------------------------------------
    const blit = createBlit(gl);

    // ---- Framebuffers --------------------------------------------------------
    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    function initFramebuffers() {
      const simRes = getResolution(gl, SIM_RESOLUTION);
      const dyeRes = getResolution(gl, isMobile ? DYE_RESOLUTION_MOBILE : DYE_RESOLUTION);
      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);

      dye = createDoubleFBO(gl, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      velocity = createDoubleFBO(gl, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
      divergence = createFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      curl = createFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      pressure = createDoubleFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    // ---- Pointers ------------------------------------------------------------
    type Pointer = {
      id: number;
      texcoordX: number;
      texcoordY: number;
      prevTexcoordX: number;
      prevTexcoordY: number;
      deltaX: number;
      deltaY: number;
      moved: boolean;
      color: RGB;
    };
    const pointers = new Map<number, Pointer>();

    function newPointer(id: number): Pointer {
      return {
        id,
        texcoordX: 0,
        texcoordY: 0,
        prevTexcoordX: 0,
        prevTexcoordY: 0,
        deltaX: 0,
        deltaY: 0,
        moved: false,
        color: nextColor(),
      };
    }

    function updatePointerMove(p: Pointer, x: number, y: number) {
      p.prevTexcoordX = p.texcoordX;
      p.prevTexcoordY = p.texcoordY;
      p.texcoordX = x / canvas!.width;
      p.texcoordY = 1 - y / canvas!.height;
      const aspect = canvas!.width / canvas!.height;
      let dx = p.texcoordX - p.prevTexcoordX;
      let dy = p.texcoordY - p.prevTexcoordY;
      if (aspect < 1) dx *= aspect;
      if (aspect > 1) dy /= aspect;
      p.deltaX = dx;
      p.deltaY = dy;
      p.moved = Math.abs(dx) > 0 || Math.abs(dy) > 0;
    }

    // ---- Simulation steps ----------------------------------------------------
    function step(dt: number) {
      gl.disable(gl.BLEND);

      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradientSubtractProgram.bind();
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!ext.supportLinearFiltering)
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!ext.supportLinearFiltering)
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function splat(x: number, y: number, dx: number, dy: number, color: RGB) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas!.width / canvas!.height);
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      gl.uniform1f(splatProgram.uniforms.radius, correctRadius(SPLAT_RADIUS / 100));
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function correctRadius(radius: number) {
      const aspect = canvas!.width / canvas!.height;
      return aspect > 1 ? radius * aspect : radius;
    }

    function applyInputs() {
      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false;
          splat(p.texcoordX, p.texcoordY, p.deltaX * SPLAT_FORCE, p.deltaY * SPLAT_FORCE, p.color);
        }
      });
    }

    function render() {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      displayProgram.bind();
      gl.uniform2f(displayProgram.uniforms.texelSize, 1 / canvas!.width, 1 / canvas!.height);
      gl.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    // ---- Resize (dirty-flag — NOT called every frame) -----------------------
    // We only rebuild framebuffers when the canvas pixel dimensions truly change.
    // Calling resize() inside the RAF loop was a major perf bottleneck.
    let resizePending = false;
    let resizeTimer = 0;
    
    // Debounce the resize so mobile URL bar changes don't trigger WebGL recreation
    // on every single pixel of scroll.
    function scheduleResize() { 
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizePending = true;
      }, 300);
    }

    function applyResize() {
      const w = scaleByPixelRatio(canvas!.clientWidth);
      const h = scaleByPixelRatio(canvas!.clientHeight);
      
      // On mobile, ignore small vertical height changes (URL bar collapsing) 
      // to avoid expensive framebuffer rebuilds while scrolling.
      const widthChanged = canvas!.width !== w;
      const heightChanged = Math.abs(canvas!.height - h) > 100;
      
      if (widthChanged || heightChanged) {
        canvas!.width = w;
        canvas!.height = h;
        initFramebuffers();
      }
      resizePending = false;
    }

    // ---- Main loop (start/stop controlled by the enabled effect) ------------
    let rafId = 0;
    let lastTime = performance.now();
    let colorTimer = 0;

    function frame() {
      rafId = requestAnimationFrame(frame);
      const now = performance.now();
      let dt = (now - lastTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastTime = now;

      if (!enabledRef.current || document.hidden) return;

      // Advance shared hue for the next splats.
      colorTimer += dt;
      if (colorTimer > 0.1) {
        colorTimer = 0;
        hueCursor += COLOR_UPDATE_SPEED * 0.001;
      }

      // Only rebuild framebuffers when window has actually resized.
      if (resizePending) applyResize();
      applyInputs();
      step(dt);
      render();
    }

    function start() {
      if (!rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    }
    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }
    controlRef.current = { start, stop };

    // ---- Pointer + lifecycle listeners --------------------------------------
    function pointerPos(e: PointerEvent | Touch) {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: scaleByPixelRatio(e.clientX - rect.left),
        y: scaleByPixelRatio(e.clientY - rect.top),
      };
    }

    function onPointerMove(e: PointerEvent) {
      if (!enabledRef.current) return;
      let p = pointers.get(e.pointerId);
      if (!p) {
        p = newPointer(e.pointerId);
        // Cache rect once — was calling getBoundingClientRect() twice (perf fix).
        const rect = canvas!.getBoundingClientRect();
        p.texcoordX = (e.clientX - rect.left) / canvas!.clientWidth;
        p.texcoordY = 1 - (e.clientY - rect.top) / canvas!.clientHeight;
        pointers.set(e.pointerId, p);
      }
      const { x, y } = pointerPos(e);
      updatePointerMove(p, x, y);
      // Fresh colour occasionally so a long stroke shifts hue.
      p.color = nextColor();
    }
    function onPointerUp(e: PointerEvent) {
      pointers.delete(e.pointerId);
    }
    function onVisibility() {
      if (document.hidden) stop();
      else if (enabledRef.current) start();
    }

    initFramebuffers();
    applyResize(); // initial sizing (replaces old resize())
    window.addEventListener("resize", scheduleResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    // Start immediately if already enabled at mount.
    if (enabledRef.current) start();

    // ---- Cleanup -------------------------------------------------------------
    return () => {
      stop();
      controlRef.current = null;
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.removeEventListener("visibilitychange", onVisibility);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    };
    } catch (err) {
      // Any WebGL failure → render nothing, don't crash the page.
      console.warn("[FluidCursor] initialisation failed; effect disabled:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInitialized]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[45] h-screen w-screen opacity-0 transition-opacity duration-300 [mix-blend-mode:screen]"
    />
  );
}

/* ============================================================================
 *  WebGL plumbing (context, shaders, programs, FBOs, blit)
 * ========================================================================== */
type GL = WebGL2RenderingContext | WebGLRenderingContext;

type ExtInfo = {
  isWebGL2: boolean;
  halfFloatTexType: number;
  supportLinearFiltering: boolean;
  formatRGBA: { internalFormat: number; format: number };
  formatRG: { internalFormat: number; format: number };
  formatR: { internalFormat: number; format: number };
};

function getWebGLContext(canvas: HTMLCanvasElement): { gl: GL; ext: ExtInfo } | null {
  const params: WebGLContextAttributes = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };

  let gl: GL | null = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
  const isWebGL2 = !!gl;
  if (!gl) {
    gl =
      (canvas.getContext("webgl", params) as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl", params) as WebGLRenderingContext | null);
  }
  if (!gl) return null;

  let halfFloat: any;
  let supportLinearFiltering: any;
  if (isWebGL2) {
    (gl as WebGL2RenderingContext).getExtension("EXT_color_buffer_float");
    supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
  } else {
    halfFloat = gl.getExtension("OES_texture_half_float");
    supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
  }
  gl.clearColor(0, 0, 0, 1);

  const halfFloatTexType = isWebGL2
    ? (gl as WebGL2RenderingContext).HALF_FLOAT
    : halfFloat?.HALF_FLOAT_OES;

  let formatRGBA, formatRG, formatR;
  if (isWebGL2) {
    const g2 = gl as WebGL2RenderingContext;
    formatRGBA = getSupportedFormat(gl, g2.RGBA16F, gl.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(gl, g2.RG16F, g2.RG, halfFloatTexType);
    formatR = getSupportedFormat(gl, g2.R16F, g2.RED, halfFloatTexType);
  } else {
    formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
  }
  if (!formatRGBA) return null;

  return {
    gl,
    ext: {
      isWebGL2,
      halfFloatTexType,
      supportLinearFiltering: !!supportLinearFiltering,
      formatRGBA,
      formatRG: formatRG ?? formatRGBA,
      formatR: formatR ?? formatRGBA,
    },
  };
}

function getSupportedFormat(
  gl: GL,
  internalFormat: number,
  format: number,
  type: number,
): { internalFormat: number; format: number } | null {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    const g2 = gl as WebGL2RenderingContext;
    // Walk up to broader formats on WebGL2 if the narrow one isn't renderable.
    switch (internalFormat) {
      case g2.R16F:
        return getSupportedFormat(gl, g2.RG16F, g2.RG, type);
      case g2.RG16F:
        return getSupportedFormat(gl, g2.RGBA16F, gl.RGBA, type);
      default:
        return null;
    }
  }
  return { internalFormat, format };
}

function supportRenderTextureFormat(gl: GL, internalFormat: number, format: number, type: number) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  return status === gl.FRAMEBUFFER_COMPLETE;
}

function compileShader(gl: GL, type: number, source: string, keywords?: string[]): WebGLShader {
  let src = source;
  if (keywords && keywords.length) {
    const prefix = keywords.map((k) => `#define ${k}\n`).join("");
    src = prefix + source;
  }
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Surface compile errors to the console but don't throw (fail silent).
    console.warn("[FluidCursor] shader compile error:", gl.getShaderInfoLog(shader));
  }
  return shader;
}

class Program {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation>;
  gl: GL;
  constructor(gl: GL, vs: WebGLShader, fs: WebGLShader) {
    this.gl = gl;
    this.program = gl.createProgram()!;
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);
    this.uniforms = {};
    const count = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(this.program, i)!;
      const loc = gl.getUniformLocation(this.program, info.name);
      if (loc) this.uniforms[info.name] = loc;
    }
  }
  bind() {
    this.gl.useProgram(this.program);
  }
}

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
};

function createFBO(
  gl: GL,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number,
): FBO {
  gl.activeTexture(gl.TEXTURE0);
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return {
    texture,
    fbo,
    width: w,
    height: h,
    texelSizeX: 1 / w,
    texelSizeY: 1 / h,
    attach(id: number) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return id;
    },
  };
}

type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
};

function createDoubleFBO(
  gl: GL,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number,
): DoubleFBO {
  let fbo1 = createFBO(gl, w, h, internalFormat, format, type, param);
  let fbo2 = createFBO(gl, w, h, internalFormat, format, type, param);
  return {
    width: w,
    height: h,
    texelSizeX: 1 / w,
    texelSizeY: 1 / h,
    get read() {
      return fbo1;
    },
    set read(v) {
      fbo1 = v;
    },
    get write() {
      return fbo2;
    },
    set write(v) {
      fbo2 = v;
    },
    swap() {
      const t = fbo1;
      fbo1 = fbo2;
      fbo2 = t;
    },
  };
}

function createBlit(gl: GL) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  const elem = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elem);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  return (target: FBO | null) => {
    if (target == null) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } else {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };
}

/* ============================================================================
 *  Misc helpers
 * ========================================================================== */
function scaleByPixelRatio(input: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  return Math.floor(input * dpr);
}

function getResolution(gl: GL, resolution: number) {
  let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
  if (aspect < 1) aspect = 1 / aspect;
  const min = Math.round(resolution);
  const max = Math.round(resolution * aspect);
  if (gl.drawingBufferWidth > gl.drawingBufferHeight) return { width: max, height: min };
  return { width: min, height: max };
}
