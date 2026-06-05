import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PageHeroSection } from "@/components/PageHeroSection";
import { WebGLGallery } from "../components/WebGLGallery";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Sorana Glass" },
      {
        name: "description",
        content:
          "Tempered, laminated, printed, frosted, sandblasted, bullet-resistant, skylight, double glazing and auto glass.",
      },
      { property: "og:title", content: "Glass Products — Sorana Glass" },
      {
        property: "og:description",
        content: "Explore Sorana Glass's full product range.",
      },
    ],
  }),
  component: Products,
});

/* ─── Product data ──────────────────────────────────────────────────────── */
interface Card {
  name: string;
  img: string;
  desc: string;
}

const CARDS: Card[] = [
  {
    name: "Tempered Glass",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Heat-treated safety glass, up to 5× stronger than annealed glass — fragments safely on impact.",
  },
  {
    name: "Tempered Glass",
    img: "https://images.pexels.com/photos/11618522/pexels-photo-11618522.jpeg",
    desc: "Heat-treated safety glass, up to 5× stronger than annealed glass — fragments safely on impact.",
  },
  {
    name: "Tempered Glass",
    img: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Heat-treated safety glass, up to 5× stronger than annealed glass — fragments safely on impact.",
  },
  {
    name: "Laminated Glass",
    img: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Multi-layered glass bonded with PVB interlayers for security, sound and UV control.",
  },
  {
    name: "Laminated Glass",
    img: "https://images.pexels.com/photos/1190902/pexels-photo-1190902.jpeg",
    desc: "Multi-layered glass bonded with PVB interlayers for security, sound and UV control.",
  },
  {
    name: "Laminated Glass",
    img: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Multi-layered glass bonded with PVB interlayers for security, sound and UV control.",
  },
  {
    name: "Frameless Partitions",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Frosted and sandblasted partitions for offices, retail and residential spaces.",
  },
  {
    name: "Frameless Partitions",
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Frosted and sandblasted partitions for offices, retail and residential spaces.",
  },
  {
    name: "Frameless Partitions",
    img: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Frosted and sandblasted partitions for offices, retail and residential spaces.",
  },
  {
    name: "Shower Enclosures",
    img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Custom frameless shower boxes designed and installed for luxury bathrooms.",
  },
  {
    name: "Shower Enclosures",
    img: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Custom frameless shower boxes designed and installed for luxury bathrooms.",
  },
  {
    name: "Shower Enclosures",
    img: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Custom frameless shower boxes designed and installed for luxury bathrooms.",
  },
  {
    name: "Skylight & Double Glazing",
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Insulated and skylight glass solutions for energy-efficient architecture.",
  },
  {
    name: "Skylight & Double Glazing",
    img: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Insulated and skylight glass solutions for energy-efficient architecture.",
  },
  {
    name: "Skylight & Double Glazing",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Insulated and skylight glass solutions for energy-efficient architecture.",
  },
  {
    name: "Auto Glass",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Windshield supply, replacement and processing for cars, buses and assembly lines.",
  },
  {
    name: "Auto Glass",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Windshield supply, replacement and processing for cars, buses and assembly lines.",
  },
  {
    name: "Auto Glass",
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Windshield supply, replacement and processing for cars, buses and assembly lines.",
  },
  {
    name: "Printed Glass",
    img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Digitally printed glass for branded and decorative interior applications.",
  },
  {
    name: "Printed Glass",
    img: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Digitally printed glass for branded and decorative interior applications.",
  },
  {
    name: "Printed Glass",
    img: "https://images.pexels.com/photos/12472486/pexels-photo-12472486.jpeg",
    desc: "Digitally printed glass for branded and decorative interior applications.",
  },
  {
    name: "Sandblasted Glass",
    img: "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Custom etched and sandblasted patterns for privacy and decoration.",
  },
  {
    name: "Sandblasted Glass",
    img: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Custom etched and sandblasted patterns for privacy and decoration.",
  },
  {
    name: "Sandblasted Glass",
    img: "https://images.pexels.com/photos/16775661/pexels-photo-16775661.jpeg",
    desc: "Custom etched and sandblasted patterns for privacy and decoration.",
  },
  {
    name: "Bullet-Resistant Glass",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Multi-layered laminated glass engineered for security applications.",
  },
  {
    name: "Bullet-Resistant Glass",
    img: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&h=820&q=80",
    desc: "Multi-layered laminated glass engineered for security applications.",
  },
  {
    name: "Bullet-Resistant Glass",
    img: "https://images.pexels.com/photos/33530414/pexels-photo-33530414.jpeg",
    desc: "Multi-layered laminated glass engineered for security applications.",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(CARDS.map((c) => c.name)))];

/* ─── Stable Fisher-Yates shuffle (seeded) ──────────────────────────────── */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Products() {
  const [filter, setFilter] = useState<string>("All");

  // Stable shuffle — same order every page load, randomised across category groups
  const shuffledCards = useMemo(() => seededShuffle(CARDS, 42), []);

  const filteredCards =
    filter === "All"
      ? shuffledCards
      : seededShuffle(
          shuffledCards.filter((c) => c.name === filter),
          7,
        );

  // After filter changes the page height changes — tell ScrollTrigger to recalculate
  useEffect(() => {
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(id);
  }, [filter]);

  return (
    <div className="relative bg-background">
      <ErrorBoundary>
        <WebGLGallery
          key={filter}
          selector=".gallery-img"
          textWrapperSelector=".gallery-text-wrapper"
        />
      </ErrorBoundary>

      <PageHeroSection
        imageSrc="https://images.pexels.com/photos/17680665/pexels-photo-17680665.jpeg"
        imageAlt="Glass Products"
        title="A complete range of processed glass."
        description="From structural facades to delicate decorative panels — all manufactured in Addis Ababa from Grade One float glass."
        imageClassName="w-full h-[180px] sm:h-[220px] md:h-[300px] object-cover"
        imageWrapperClassName="w-64 max-w-4xl mx-auto"
        className="z-10"
      />

      {/* ── Gallery Section ──────────────────────────────────────────── */}
      <section id="products-gallery" className="bg-background pb-[600px] md:pb-[800px]">
        {/* Section header */}
        <div className="text-center pt-24 pb-16 px-6">
          <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#0A7C3F] mb-4">
            Our Products
          </span>
          <h2
            className="font-display font-light text-foreground leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Crafted for every application
          </h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Nine product lines. Twenty-seven perspectives. Each piece engineered
            to specification.
          </p>
        </div>

        {/* ── Body: grid left, filter right ───────────────────────── */}
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            alignItems: "flex-start",
            gap: "64px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* ── Right sticky filter ─────────────────────────────────── */}
          <aside
            style={{
              position: "sticky",
              top: "7rem",
              width: "200px",
              flexShrink: 0,
              alignSelf: "flex-start",
              background: "var(--color-background)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "9px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.26em",
                  color: "#0A7C3F",
                  margin: 0,
                }}
              >
                Filter by type
              </p>
            </div>

            {/* Category list */}
            <ul style={{ listStyle: "none", padding: "8px 0", margin: 0 }}>
              {CATEGORIES.map((cat) => {
                const active = filter === cat;
                return (
                  <li key={cat}>
                    <button
                      onClick={() => setFilter(cat)}
                      style={{
                        all: "unset",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "10px 20px",
                        fontFamily: "var(--font-display)",
                        fontSize: "10px",
                        fontWeight: active ? 700 : 400,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: active
                          ? "#0A7C3F"
                          : "var(--color-muted-foreground)",
                        background: active
                          ? "rgba(10,124,63,0.07)"
                          : "transparent",
                        borderLeft: active
                          ? "2px solid #0A7C3F"
                          : "2px solid transparent",
                        transition:
                          "background 0.2s, color 0.2s, border-color 0.2s",
                        boxSizing: "border-box",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = "rgba(255,255,255,0.04)";
                          el.style.color = "var(--color-foreground)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = "transparent";
                          el.style.color = "var(--color-muted-foreground)";
                        }
                      }}
                    >
                      <span>{cat}</span>
                      {active && (
                        <span
                          style={{
                            display: "inline-block",
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "#0A7C3F",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Count footer */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  color: "var(--color-muted-foreground)",
                  margin: 0,
                }}
              >
                {filteredCards.length} item
                {filteredCards.length !== 1 ? "s" : ""}
              </p>
            </div>
          </aside>

          {/* ── Image grid ─────────────────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <style>{`
              .product-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 32px;
                width: 100%;
              }
              @media (max-width: 900px) {
                .product-grid {
                  grid-template-columns: repeat(2, 1fr);
                }
              }
              @media (max-width: 560px) {
                .product-grid {
                  grid-template-columns: 1fr;
                }
              }
            `}</style>
            <div className="product-grid">
              {filteredCards.map((c, idx) => (
                <article key={`${c.name}-${idx}`}>
                  {/* Title above */}
                  <div className="gallery-text-wrapper" style={{ marginBottom: "8px" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "9px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.18em",
                        color: "#208349",
                        lineHeight: 1,
                        willChange: "transform",
                      }}
                    >
                      {c.name}
                    </p>
                  </div>

                  {/* Image */}
                  <div style={{ overflow: "hidden", width: "100%" }}>
                    <img
                      crossOrigin="anonymous"
                      src={c.img}
                      alt={c.name}
                      loading="lazy"
                      className="gallery-img"
                      style={{
                        width: "80%",
                        aspectRatio: "3 / 4",
                        objectFit: "cover",
                        display: "block",
                        transition:
                          "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLImageElement
                        ).style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLImageElement
                        ).style.transform = "scale(1)";
                      }}
                    />
                  </div>

                  {/* Description below */}
                  <div
                    className="gallery-text-wrapper"
                    style={{ marginTop: "8px", marginBottom: "4px" }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "10px",
                        color: "var(--color-muted-foreground)",
                        lineHeight: 1.7,
                        willChange: "transform",
                      }}
                    >
                      {c.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>


        </div>
      </section>
    </div>
  );
}
