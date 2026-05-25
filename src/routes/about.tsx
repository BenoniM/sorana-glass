import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Sparkles } from "lucide-react";
import factoryImg from "@/assets/factory.jpg";

import { StorySection } from "@/components/StorySection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Sorana Glass — 20+ Years of Glass Craftsmanship" },
      { name: "description", content: "Founded on automotive glass expertise and grown into one of Ethiopia's most advanced glass processors. Meet Sorana Glass." },
      { property: "og:title", content: "About Sorana Glass" },
      { property: "og:description", content: "20+ years of glass craftsmanship — from auto glass roots to a fully integrated processor in Addis Ababa." },
    ],
  }),
  component: About,
});

const leaders = [
  { name: "Solomon Tefera", role: "Chief Executive Officer" },
  { name: "Daniel Tekle", role: "General Manager" },
  { name: "Nahom Solomon", role: "Operations Supervisor" },
  { name: "Abebe Biru", role: "Maintenance Lead" },
];

const values = ["Quality", "Reliability", "Responsibility", "Efficiency", "Customer Focus"];

function About() {
  return (
    <>
      <section className="relative overflow-hidden py-16 flex flex-col items-center justify-center text-center">
        {/* Greenish/orangeish glassy background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#0A7C3F]/50 rounded-full blur-[80px] -translate-y-1/3 -translate-x-2/3" />
          <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#E87732]/40 rounded-full blur-[80px] translate-y-1/3 translate-x-2/3" />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[30px]" />
        </div>

        <div className="relative z-10 h-full w-full max-w-6xl px-6 flex flex-col items-center">
          <p className="mt-10 mb-8 max-w-3xl capitalize font-display text-3xl font-semibold leading-tight">
            From auto glass roots to Ethiopia's most advanced processor.
          </p>

          <div className="relative p-2 md:p-3 bg-[#0A7C3F]/30 backdrop-blur-md border border-white/20 shadow-2xl mb-10 w-xl max-w-3xl mx-auto">
            <div className="p-1 rounded-sm">
              <img 
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Sorana Glass Interior" 
                className="w-full h-[180px] sm:h-[220px] md:h-[200px] object-cover opacity-95" 
              />
            </div>
          </div>

          <p className="mt-3 max-w-5xl capitalize font-display text-lg font-light text-balance">
            Sorana Glass began with deep technical expertise in automotive glass and has grown into a fully integrated glass solutions provider — combining over 20 years of industry experience with modern production technology.
          </p>
        </div>
      </section>

      <StorySection />

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-2xl border border-border bg-card p-12 shadow-card flex flex-col items-center">
            <Sparkles className="h-10 w-10 text-accent" />
            <h3 className="mt-6 font-display text-2xl font-semibold">Core values</h3>
            <p className="mt-4 text-muted-foreground text-lg">{values.join("  ·  ")}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="font-display text-3xl font-bold">Leadership</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">A structured leadership team ensuring accountability and efficiency at every stage of production.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((l) => (
            <div key={l.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-accent font-display text-xl font-bold text-accent-foreground">
                {l.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{l.name}</h3>
              <p className="text-sm text-muted-foreground">{l.role}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
