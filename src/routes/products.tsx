import { useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/site-data";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
              A complete range of processed glass.
            </h1>

            <div className="relative p-2 md:p-3 bg-[#E87732]/30 backdrop-blur-md border border-white/20 shadow-2xl mb-10 w-64 max-w-4xl mx-auto">
              <div className="p-1 rounded-sm">
                <img 
                  src="https://images.pexels.com/photos/30196145/pexels-photo-30196145.jpeg" 
                  alt="Glass Products" 
                  className="w-full h-[180px] sm:h-[220px] md:h-[300px] object-cover opacity-95" 
                />
              </div>
            </div>

            <p className="mt-3 max-w-5xl capitalize font-display text-lg font-light text-balance">
              From structural facades to delicate decorative panels — all manufactured in Addis Ababa from Grade One float glass.
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
      </div>
    </div>
  );
}
