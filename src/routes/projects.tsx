import { useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ProjectsIndustriesSection } from "@/components/ProjectsIndustriesSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & Industries — Sorana Glass" },
      { name: "description", content: "Sorana Glass serves contractors, developers, hotels, hospitals, museums, car assembly companies and more across Ethiopia." },
      { property: "og:title", content: "Projects & Industries — Sorana Glass" },
      { property: "og:description", content: "Industries and project types served by Sorana Glass." },
    ],
  }),
  component: Projects,
});

const projectTypes = [
  "High-rise buildings",
  "Villas & residential housing",
  "Hotels & resorts",
  "Hospitals",
  "Commercial buildings",
  "Museums",
  "Industrial facilities",
  "Government infrastructure",
];

function Projects() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "bottom bottom",
        end: "+=100%",
        pin: contentRef.current,
        pinSpacing: true,
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div ref={contentRef} className="relative bg-background">
        <section className="relative overflow-hidden py-16 flex flex-col items-center justify-center text-center">
          {/* Greenish/orangeish glassy background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#0A7C3F]/50 rounded-full blur-[80px] -translate-y-1/3 -translate-x-2/3" />
            <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#E87732]/40 rounded-full blur-[80px] translate-y-1/3 translate-x-2/3" />
            <div className="absolute inset-0 bg-background/30 backdrop-blur-[30px]" />
          </div>

          <div className="relative z-10 h-full w-full max-w-6xl px-6 flex flex-col items-center">
            <h1 className="mt-10 mb-8 max-w-3xl capitalize font-display text-3xl font-semibold leading-tight">
              Trusted across Ethiopia's most demanding sectors.
            </h1>

            <div className="relative p-2 md:p-3 bg-[#0A7C3F]/30 backdrop-blur-md border border-white/20 shadow-2xl mb-10 w-5xl max-w-5xl mx-auto">
              <div className="p-1 rounded-sm">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  alt="Glass Projects" 
                  className="w-full aspect-[42/9] object-cover opacity-95" 
                />
              </div>
            </div>

            <p className="mt-3 max-w-5xl capitalize font-display text-lg font-light text-balance">
              Sorana works alongside contractors, developers and manufacturers — delivering consistent quality on both large-scale and urgent projects.
            </p>
          </div>
        </section>

        <ProjectsIndustriesSection />

        <section className="bg-surface py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-display text-3xl font-bold">Project types delivered</h2>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {projectTypes.map((p) => (
                <div key={p} className="rounded-xl border border-border bg-card px-5 py-6 text-center font-medium shadow-card">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
