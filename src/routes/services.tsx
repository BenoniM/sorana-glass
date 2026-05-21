import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { services } from "@/lib/site-data";

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
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Services</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold text-balance md:text-6xl">
            End-to-end glass solutions, under one roof.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
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
    </>
  );
}
