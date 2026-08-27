/**
 * Auto-generated abstract visual for project cards.
 *
 * Deliberately NOT a fake screenshot — it's a layered, glassy "app window"
 * mockup rendered from gradients so every card looks bespoke without
 * fabricating product UI. The tint is driven by each project's `visual` key.
 */
import type { Project } from "@/lib/data";

const tints: Record<Project["visual"], { from: string; to: string; glow: string }> = {
  cyan: { from: "#00F5FF", to: "#7B61FF", glow: "rgba(0,245,255,0.35)" },
  violet: { from: "#7B61FF", to: "#00F5FF", glow: "rgba(123,97,255,0.35)" },
  mint: { from: "#00FFB3", to: "#00F5FF", glow: "rgba(0,255,179,0.3)" },
};

export function ProjectVisual({
  visual,
  label,
}: {
  visual: Project["visual"];
  label: string;
}) {
  const t = tints[visual];
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-xl"
      style={{ background: `radial-gradient(120% 120% at 20% 0%, ${t.glow}, #070b1c 60%)` }}
      aria-hidden="true"
    >
      {/* Drifting orb — reacts to parent card hover */}
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl animate-float transition-transform duration-500 group-hover:scale-125"
        style={{ background: `linear-gradient(120deg, ${t.from}, ${t.to})`, opacity: 0.5 }}
      />
      {/* Faux app window */}
      <div className="absolute inset-5 rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-sm">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/30" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="ml-2 font-mono text-[10px] tracking-widest text-white/40">
            {label.toLowerCase().replace(/\s+/g, "-")}
          </span>
        </div>
        <div className="space-y-2 p-3">
          <div className="h-2 w-2/3 rounded-full" style={{ background: `linear-gradient(90deg, ${t.from}, transparent)` }} />
          <div className="h-2 w-1/2 rounded-full bg-white/15" />
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="h-10 rounded-md bg-white/[0.06]" />
            <div className="h-10 rounded-md bg-white/[0.06]" />
            <div className="h-10 rounded-md" style={{ background: `linear-gradient(135deg, ${t.from}33, ${t.to}33)` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
