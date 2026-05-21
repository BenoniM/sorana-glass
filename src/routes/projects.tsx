import { createFileRoute } from "@tanstack/react-router";
import { industries } from "@/lib/site-data";
import { Building2 } from "lucide-react";

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
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Projects</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold text-balance md:text-6xl">
            Trusted across Ethiopia's most demanding sectors.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Sorana works alongside contractors, developers and manufacturers — delivering consistent
            quality on both large-scale and urgent projects.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="font-display text-3xl font-bold">Industries we serve</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <div key={i.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <Building2 className="h-6 w-6 text-accent" />
              <h3 className="mt-4 font-display text-lg font-semibold">{i.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

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
    </>
  );
}
