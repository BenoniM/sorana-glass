import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/site-data";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Sorana Glass" },
      { name: "description", content: "Tempered, laminated, printed, frosted, sandblasted, bullet-resistant, skylight, double glazing and auto glass." },
      { property: "og:title", content: "Glass Products — Sorana Glass" },
      { property: "og:description", content: "Explore Sorana Glass's full product range." },
    ],
  }),
  component: Products,
});

const all = [
  ...products,
  { name: "Printed Glass", image: products[0].image, desc: "Digitally printed glass for branded and decorative interior applications." },
  { name: "Sandblasted Glass", image: products[2].image, desc: "Custom etched and sandblasted patterns for privacy and decoration." },
  { name: "Bullet-Resistant Glass", image: products[1].image, desc: "Multi-layered laminated glass engineered for security applications." },
];

function Products() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Products</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold text-balance md:text-6xl">
            A complete range of processed glass.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            From structural facades to delicate decorative panels — all manufactured in Addis Ababa
            from Grade One float glass.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((p, i) => (
            <article key={p.name + i} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:shadow-elegant">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" width={1024} height={768} />
              </div>
              <div className="p-6">
                <h2 className="font-display text-xl font-semibold">{p.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
