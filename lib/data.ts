/**
 * Single source of truth for all portfolio content.
 *
 * Every section reads from these typed arrays so copy stays data-driven and
 * easy to update — no content is hardcoded inside JSX.
 */

/* ------------------------------------------------------------------ */
/*  Profile                                                            */
/* ------------------------------------------------------------------ */
export const profile = {
  name: "Prashant Gupta",
  initials: "PG",
  tagline: "Full-Stack Developer | AI & Automation Builder | Problem Solver",
  location: "Ghaziabad, India",
  email: "adityagupta983869@gmail.com",
  // Drop a real PDF at /public/resume/Prashant_Gupta_Resume.pdf to enable downloads.
  resumeUrl: "/resume/Prashant_Gupta_Resume.pdf",
  // Rotating roles for the hero typing animation.
  roles: ["Full-Stack Developer", "AI Automation Builder", "Problem Solver"],
  valueProposition:
    "I build intelligent automation and exceptional digital experiences — turning repetitive, manual work into elegant systems that ship end-to-end.",
} as const;

/* ------------------------------------------------------------------ */
/*  Social / contact links                                             */
/* ------------------------------------------------------------------ */
export type SocialLink = {
  label: string;
  href: string;
  /** Lightweight key used to pick an inline SVG icon in the UI. */
  icon: "github" | "linkedin" | "leetcode" | "email";
  handle: string;
};

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/PrashantGuptacodecraft",
    icon: "github",
    handle: "@PrashantGuptacodecraft",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/prashant-gupta-923885328",
    icon: "linkedin",
    handle: "Prashant Gupta",
  },
  {
    // Real LeetCode profile.
    label: "LeetCode",
    href: "https://leetcode.com/u/ltVhbr0cu7/",
    icon: "leetcode",
    handle: "400+ solved",
  },
  {
    label: "Email",
    href: "mailto:adityagupta983869@gmail.com",
    icon: "email",
    handle: "adityagupta983869@gmail.com",
  },
];

export const githubUsername = "PrashantGuptacodecraft";

/* ------------------------------------------------------------------ */
/*  About — narrative + stat cards                                     */
/* ------------------------------------------------------------------ */
export const about = {
  paragraphs: [
    "I'm a second-year Computer Science Engineering student at KIET Group of Institutions who builds real, working software — not toy projects. My work ranges from a multimodal voice assistant to full-stack recruiter-outreach automation platforms powered by Playwright and browser automation.",
    "Self-taught well beyond my coursework, I ship products end-to-end: frontend, backend, and the automation glue in between. I'm obsessed with the moment a tedious manual workflow collapses into a single, elegant automated system.",
    "My goal is a Full-Stack / SDE role at the intersection of AI, automation, and clean UI — where shipping fast and shipping well aren't a trade-off.",
  ],
};

export type Stat = {
  label: string;
  value: string;
  hint: string;
};

export const stats: Stat[] = [
  { label: "Education", value: "B.Tech CSE", hint: "KIET • 2024–2028" },
  { label: "Based in", value: "Ghaziabad, IN", hint: "Open to remote & relocation" },
  { label: "Focus", value: "AI + Automation", hint: "Full-stack, end-to-end builds" },
  { label: "LeetCode", value: "400+ solved", hint: "Strong DSA fundamentals" },
];

/* ------------------------------------------------------------------ */
/*  Skills                                                             */
/* ------------------------------------------------------------------ */
export type Proficiency = "Core" | "Proficient" | "Familiar";

export type Skill = {
  name: string;
  level: Proficiency;
};

export type SkillCategory = {
  title: string;
  /** Tailwind gradient classes used for the category accent. */
  accent: "primary" | "secondary" | "accent";
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    accent: "primary",
    skills: [
      { name: "Java", level: "Core" },
      { name: "JavaScript", level: "Core" },
      { name: "Python", level: "Proficient" },
      { name: "C++", level: "Proficient" },
    ],
  },
  {
    title: "Frontend",
    accent: "secondary",
    skills: [
      { name: "React.js", level: "Core" },
      { name: "Redux", level: "Proficient" },
      { name: "HTML5", level: "Core" },
      { name: "CSS3", level: "Core" },
      { name: "Tailwind CSS", level: "Core" },
      { name: "Bootstrap", level: "Proficient" },
    ],
  },
  {
    title: "Backend & Automation",
    accent: "accent",
    skills: [
      { name: "Node.js", level: "Core" },
      { name: "Express.js", level: "Core" },
      { name: "REST APIs", level: "Core" },
      { name: "Playwright", level: "Proficient" },
      { name: "Nodemailer", level: "Proficient" },
    ],
  },
  {
    title: "AI & Tooling",
    accent: "primary",
    skills: [
      { name: "Speech Recognition", level: "Proficient" },
      { name: "Computer Vision", level: "Familiar" },
      { name: "AI APIs / LLMs", level: "Proficient" },
      { name: "Workflow Automation", level: "Core" },
      { name: "Git & GitHub", level: "Core" },
      { name: "VS Code", level: "Core" },
      { name: "Vite", level: "Proficient" },
    ],
  },
  {
    title: "Core CS",
    accent: "secondary",
    skills: [
      { name: "Data Structures & Algorithms", level: "Core" },
      { name: "OOP", level: "Core" },
      { name: "System Design Fundamentals", level: "Familiar" },
      { name: "Responsive Design", level: "Core" },
      { name: "Time & Space Complexity", level: "Proficient" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Projects                                                           */
/* ------------------------------------------------------------------ */
export type Project = {
  title: string;
  hook: string;
  tech: string[];
  highlights: string[];
  github: string;
  demo: string; // "#" when no live URL exists — never fabricate one.
  /** Drives the abstract auto-generated card visual + glow tint. */
  visual: "cyan" | "violet" | "mint";
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "JarvisX",
    hook: "A multimodal AI desktop assistant — voice, vision and memory — that plans and acts on its own.",
    tech: ["Python", "Gemini / OpenAI", "Whisper ASR", "RAG", "MediaPipe", "Playwright", "MQTT"],
    highlights: [
      "Combines LLMs (Gemini/OpenAI), Whisper ASR, local vector retrieval (RAG) and computer vision for memory-backed, context-aware responses across voice, vision and text.",
      "Multi-agent orchestration layer (AgentOrchestrator, UniversalAgent, swarm manager) that autonomously plans and routes 40+ intent types for complex multi-step tasks.",
      "Real-time hand-gesture recognition (18 gestures) via MediaPipe hand-landmarkers, with a HUD overlay and AR screen memory for hands-free desktop control.",
      "Voice biometric enrollment + speaker authentication, plus modular tool controllers (Playwright browser, files, system, WhatsApp, IoT/MQTT, cross-device REST) and a RAG knowledge-sync manager.",
    ],
    github: "https://github.com/PrashantGuptacodecraft/JarvisX",
    demo: "#",
    visual: "cyan",
  },
  {
    title: "LinkedApply Pro",
    hook: "Recruiter outreach on autopilot — scrape, personalize, and send at scale.",
    tech: ["React", "Node.js", "Express", "Playwright", "Nodemailer"],
    highlights: [
      "Scrapes recent LinkedIn recruiter posts and sends personalized Gmail applications with resume attachments.",
      "React dashboard for LinkedIn/Gmail auth, candidate profiles, resume uploads and live activity tracking.",
      "Express REST APIs with rate-limited bulk delivery, contact enrichment, logging and robust error handling.",
    ],
    github: "https://github.com/PrashantGuptacodecraft/Linkedapply-pro",
    demo: "#",
    visual: "violet",
  },
  {
    title: "Autonomous AI Creator",
    hook: "Advanced autonomous AI agent that creates, iterates and ships content end-to-end without human intervention.",
    tech: ["Python", "LLMs", "Multi-Agent", "Automation", "AI APIs"],
    highlights: [
      "Fully autonomous multi-agent pipeline that researches, drafts, reviews and publishes content with zero manual steps.",
      "Advanced reasoning and self-correction loop — agents critique each other's outputs and iterate until quality thresholds are met.",
      "Modular creator architecture: swap in different LLMs, content types or distribution channels without changing the core pipeline.",
    ],
    github: "https://github.com/PrashantGuptacodecraft/autonomous-ai-creator-advanced",
    demo: "#",
    visual: "mint",
  },
  {
    title: "Eventra",
    hook: "One dashboard to run events, tasks and the people behind them.",
    tech: ["React.js", "Context API", "Bootstrap"],
    highlights: [
      "Centralized dashboard for events, tasks and user activity with participation and engagement tracking.",
      "Global state via Context API with localStorage persistence across sessions.",
      "Dark-mode UI with role-based access controls.",
    ],
    github: "https://github.com/PrashantGuptacodecraft/Eventra",
    demo: "#",
    visual: "cyan",
  },
  {
    title: "Grocify",
    hook: "Grocery planning stripped down to fast, frictionless everyday UX.",
    tech: ["JavaScript", "HTML", "CSS"],
    highlights: [
      "A clean grocery list and shopping-management web app built for speed.",
      "Focused on simple, fast interactions for real everyday use cases.",
    ],
    github: "https://github.com/PrashantGuptacodecraft/Grocify",
    demo: "#",
    visual: "violet",
  },
  {
    title: "Wall-Calendar",
    hook: "A visual, wall-calendar-style way to browse dates and events.",
    tech: ["JavaScript"],
    highlights: [
      "Interactive wall-calendar web app for visual date and event browsing.",
      "Lightweight, dependency-free front-end implementation.",
    ],
    github: "https://github.com/PrashantGuptacodecraft/Wall-Calendar",
    demo: "#",
    visual: "mint",
  },
];

/* ------------------------------------------------------------------ */
/*  Freelance Projects                                                 */
/* ------------------------------------------------------------------ */
export type FreelanceProject = {
  title: string;
  category: string;
  hook: string;
  tech: string[];
  github: string;
  /** Live Vercel preview — "#" when not public (e.g. security reasons). */
  demo: string;
  visual: "cyan" | "violet" | "mint";
};

export const freelanceProjects: FreelanceProject[] = [
  {
    title: "Doctor Platform",
    category: "Healthcare",
    hook: "Full-stack doctor consultation and appointment management platform.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/PrashantGuptacodecraft/Doctor",
    demo: "https://doctor-khaki-nu.vercel.app/",
    visual: "cyan",
  },
  {
    title: "IOCL Lorry Gate Management",
    category: "Enterprise",
    hook: "Gate entry, lorry tracking and management system for IOCL fuel depots.",
    tech: ["React", "Node.js", "Express", "MySQL"],
    github: "https://github.com/PrashantGuptacodecraft/IOCL_Lorry_Gate_Management",
    demo: "https://iocl-lorry-gate-management-producti-wheat.vercel.app/dashboard",
    visual: "violet",
  },
  {
    title: "Jemzo Hotels Platform",
    category: "Hospitality",
    hook: "Premium hotel booking and management platform with room inventory and reservations.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/PrashantGuptacodecraft/jemzo-hotels-platform-v2",
    demo: "https://jemzo-hotels-platform-v2-pq18.vercel.app/",
    visual: "mint",
  },
  {
    title: "Grill Cafe Premium",
    category: "Food & Beverage",
    hook: "Premium café website with menu management, table booking and online ordering.",
    tech: ["React", "Tailwind CSS", "Node.js"],
    github: "https://github.com/PrashantGuptacodecraft/Grill_cafe-premium",
    demo: "https://grillcafe.vercel.app/",
    visual: "cyan",
  },
  {
    title: "Hotel Management System",
    category: "Hospitality",
    hook: "Full-featured hotel management system for check-in, check-out and billing.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/PrashantGuptacodecraft/hotel",
    demo: "#",
    visual: "violet",
  },
  {
    title: "E-Commerce Platform",
    category: "Retail",
    hook: "Scalable e-commerce platform with product catalog, cart, orders and payments.",
    tech: ["React", "Redux", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/PrashantGuptacodecraft/ecommerce-platform",
    demo: "https://ecommerce-platform-jet-nu.vercel.app/",
    visual: "mint",
  },
  {
    title: "Road Milling Rental",
    category: "Construction",
    hook: "Equipment rental platform for road milling machines with booking and fleet management.",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/PrashantGuptacodecraft/road-milling-rental",
    demo: "https://road-milling-rental.vercel.app/",
    visual: "cyan",
  },
];

/* ------------------------------------------------------------------ */
/*  Experience & achievements (timeline)                               */
/* ------------------------------------------------------------------ */
export type TimelineEntry = {
  title: string;
  meta: string;
  description: string;
  tag: "work" | "achievement" | "certification" | "event" | "ongoing";
};

export const timeline: TimelineEntry[] = [
  {
    title: "Full Stack Developer Intern — SN Verse Software Solution",
    meta: "Internship · Bilaspur, CG · July 2026 – August 2026",
    description:
      "Working as a Full Stack Developer Intern at SN Verse Software Solution (Ref: SNV/INT/2026/061). Involved in frontend development using modern web technologies, backend development and API integration, database design and management, and collaboration on live production projects.",
    tag: "work",
  },
  {
    title: "Freelance Full-Stack Developer",
    meta: "Freelancing · 7 client projects delivered",
    description:
      "Delivered 7 end-to-end client projects spanning healthcare, enterprise (IOCL), hospitality, food & beverage, e-commerce and construction. Built complete full-stack solutions from requirements to deployment.",
    tag: "work",
  },
  {
    title: "Web Developer — JP IT Staffing",
    meta: "Internship · US-based company · Present",
    description:
      "Building and shipping web features for a US-based IT staffing company as a Web Developer intern.",
    tag: "work",
  },
  {
    title: "Web Developer — Inamigos Foundation (IAF)",
    meta: "Internship · NGO · Present",
    description:
      "Developing the web presence and tools for Inamigos Foundation, a non-profit, as a Web Developer intern.",
    tag: "work",
  },
  {
    title: "400+ problems solved on LeetCode",
    meta: "DSA proficiency",
    description:
      "Consistent practice across data structures and algorithms — sharpening problem-solving and complexity analysis.",
    tag: "achievement",
  },
  {
    title: "AWS Certified Machine Learning",
    meta: "Certification",
    description:
      "Validated knowledge of building, training, tuning and deploying machine-learning models on AWS.",
    tag: "certification",
  },
  {
    title: "AWS Certified Cloud Practitioner",
    meta: "Foundational",
    description:
      "Validated foundational knowledge of AWS cloud concepts, services, security and architecture.",
    tag: "certification",
  },
  {
    title: "Stellaris Hackathon",
    meta: "Participant",
    description:
      "Designed and built a working project under tight time constraints, collaborating and shipping under pressure.",
    tag: "event",
  },
];

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */
export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Freelance", href: "#freelance" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;
