import { useRef, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { services } from "@/lib/site-data";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Sorana Glass" },
      { name: "description", content: "Cutting, drilling, tempering, lamination, sandblasting, printing, installation and full custom glass fabrication." },
      { property: "og:title", content: "Glass Services — Sorana Glass" },
      { property: "og:description", content: "End-to-end glass processing services in Addis Ababa." },
    ],
  }),
  component: Services,
});

const capabilities = [
  { title: "Processing", body: "4 tempering furnaces, lamination lines, CNC cutting and drilling, sandblasting and digital printing." },
  { title: "Installation", body: "Skilled installation teams trained on safe handling, packaging and site logistics for fragile glass." },
  { title: "Custom fabrication", body: "From a single bespoke piece to large project runs — we engineer to spec with structured QC at each step." },
  { title: "Supply & distribution", body: "Direct imports of Grade One float glass and full hardware accessories supply for trade clients." },
];

function Services() {
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
            <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#E87732]/50 rounded-full blur-[80px] -translate-y-1/3 -translate-x-2/3" />
            <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#0A7C3F]/40 rounded-full blur-[80px] translate-y-1/3 translate-x-2/3" />
            <div className="absolute inset-0 bg-background/30 backdrop-blur-[30px]" />
          </div>

          <div className="relative z-10 h-full w-full max-w-6xl px-6 flex flex-col items-center">
            <h1 className="mb-8 mt-10 max-w-3xl capitalize font-display text-3xl font-semibold leading-tight">
              End-to-end glass solutions, under one roof.
            </h1>

            <div className="relative p-2 md:p-3 bg-[#E87732]/30 backdrop-blur-md border border-white/20 shadow-2xl mb-10 w-64 max-w-3xl mx-auto">
              <div className="p-1 rounded-sm">
                <img 
                  src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  alt="Glass Services" 
                  className="w-full aspect-[1/1] object-cover opacity-95" 
                />
              </div>
            </div>

            <p className="mt-3 max-w-5xl capitalize font-display text-lg font-light text-balance">
              Sorana provides turnkey service — we import, process, deliver and install. One supplier,
              one accountable team, one quality standard.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-6 md:grid-cols-2">
            {capabilities.map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-8 shadow-card">
                <h2 className="font-display text-2xl font-semibold">{c.title}</h2>
                <p className="mt-3 text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface py-24">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-display text-3xl font-bold">Service catalogue</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">Every process below is performed in-house at our Nifas Silk Lafto facility.</p>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <li key={s} className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-card">
                  <Check className="h-5 w-5 text-accent" />
                  <span className="font-medium">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="rounded-3xl bg-gradient-hero p-10 text-primary-foreground shadow-elegant md:p-16">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to spec your project?</h2>
            <p className="mt-3 max-w-xl text-primary-foreground/80">Share your drawings, quantities and timeline — we'll respond with a detailed quote.</p>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90">
              Request a quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
