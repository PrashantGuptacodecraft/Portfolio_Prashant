import dynamic from "next/dynamic";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";

/*
 * Below-the-fold sections are lazy-loaded to keep the initial hero payload
 * small. They're client components, so we render them on the client only as
 * they're needed during scroll.
 */
const Experience = dynamic(() =>
  import("@/components/sections/Experience").then((m) => m.Experience),
);
const GithubStats = dynamic(() =>
  import("@/components/sections/GithubStats").then((m) => m.GithubStats),
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((m) => m.Contact),
);
const Footer = dynamic(() =>
  import("@/components/sections/Footer").then((m) => m.Footer),
);

export default function Home() {
  return (
    <>
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <GithubStats />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
