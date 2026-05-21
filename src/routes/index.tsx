import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Factory, Truck, Award } from "lucide-react";
import factoryImg from "@/assets/factory.jpg";
import { products, stats } from "@/lib/site-data";
import { HeroSection } from "@/components/HeroSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sorana Glass — Advanced Glass Processing in Ethiopia" },
      { name: "description", content: "Tempered, laminated, architectural and automotive glass from Addis Ababa. 20+ years of expertise, 2,000 m²/day capacity." },
      { property: "og:title", content: "Sorana Glass — Advanced Glass Processing in Ethiopia" },
      { property: "og:description", content: "Tempered, laminated, architectural and automotive glass from Addis Ababa." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* ── Full-screen hero with diagonal image strips ─────────────────────── */}
      <HeroSection />

      {/* ── Stats strip (moved out of hero) ────────────────────────────────── */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center md:items-start md:text-left">
                <dt className="font-display text-4xl font-bold text-primary md:text-5xl">{s.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Value props ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Why Sorana</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-balance md:text-5xl">
              Capacity, craftsmanship and consistency in every panel.
            </h2>
            <p className="mt-6 text-muted-foreground">
              From the early days of automotive glass to one of the country's most advanced tempering
              facilities, Sorana has scaled without losing the discipline that built its reputation.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {[
                { icon: Factory, title: "4 tempering furnaces", body: "Up to 2,000 m² of processed glass every day." },
                { icon: ShieldCheck, title: "Grade-One float glass", body: "Direct imports and strict QC at every stage." },
                { icon: Truck, title: "Fast delivery", body: "Strategic Addis Ababa location with city-wide logistics." },
                { icon: Award, title: "20+ years experience", body: "Skilled, long-serving technical teams." },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <f.icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-3 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={factoryImg} alt="Sorana glass tempering furnace" className="rounded-2xl shadow-elegant" loading="lazy" width={1600} height={1024} />
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-elegant md:block">
              <div className="font-display text-3xl font-bold">North Glass</div>
              <div className="text-xs uppercase tracking-widest opacity-80">Latest furnace upgrade</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured products ───────────────────────────────────────────────── */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">Products</p>
              <h2 className="mt-2 font-display text-4xl font-bold">A complete glass catalogue.</h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80">
              See all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((p) => (
              <article key={p.name} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:shadow-elegant">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" width={1024} height={768} />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero p-10 text-primary-foreground shadow-elegant md:p-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-4xl font-bold leading-tight text-balance md:text-5xl">
                Have a project in mind?
              </h2>
              <p className="mt-4 max-w-md text-primary-foreground/80">
                Whether it's a single shower enclosure or a 10,000 m² facade, our team will quote,
                process and install — on time, to spec.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90">
                Start a project <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:+251960323232" className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3 text-sm font-semibold hover:bg-primary-foreground/10">
                Call us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
