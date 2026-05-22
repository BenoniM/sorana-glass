import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Data ───────────────────────────────────────────────────────────────────────
const INDUSTRIES = [
  {
    name: "Hotels & Resorts",
    tag: "Hospitality",
    index: "01",
    description:
      "Frameless glass facades, mirror walls, and custom-etched panels that define luxury spaces — from lobby atriums to rooftop enclosures.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=85&fit=crop",
  },
  {
    name: "High-Rise Buildings",
    tag: "Architecture",
    index: "02",
    description:
      "Structural curtain walls, insulated glass units, and tempered safety glazing engineered for Ethiopia's tallest commercial towers.",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&fit=crop",
  },
  {
    name: "Hospitals",
    tag: "Healthcare",
    index: "03",
    description:
      "Anti-bacterial laminated glass, radiation-shielding panels, and hygienic partition systems manufactured to clinical standards.",
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1400&q=85&fit=crop",
  },
  {
    name: "Museums & Cultural",
    tag: "Culture",
    index: "04",
    description:
      "UV-filtering display cases, anti-reflective exhibition glass, and architecturally significant glazing that protects collections.",
    image:
      "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1400&q=85&fit=crop",
  },
  {
    name: "Villas & Residential",
    tag: "Residential",
    index: "05",
    description:
      "Shower enclosures, pool fencing, balustrades, and bespoke interior glass elements crafted for private homes and luxury villas.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85&fit=crop",
  },
  {
    name: "Industrial Facilities",
    tag: "Industrial",
    index: "06",
    description:
      "Impact-resistant, thermally stable glazing for factories, laboratories, and production facilities where performance is non-negotiable.",
    image:
      "https://images.unsplash.com/photo-1565515636169-9b60e96fc5db?w=1400&q=85&fit=crop",
  },
];

// ── Component ──────────────────────────────────────────────────────────────────
export function IndustriesSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const imageRefs    = useRef<(HTMLDivElement | null)[]>([]);

  // Single content refs — we swap text in place
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const tagRef       = useRef<HTMLSpanElement>(null);
  const descRef      = useRef<HTMLParagraphElement>(null);
  const indexRef     = useRef<HTMLSpanElement>(null);
  const ambientRef   = useRef<HTMLDivElement>(null);

  const prevIndex    = useRef(0);
  const [, setActiveIndex] = useState(0);

  // ── Core transition ────────────────────────────────────────────────────────
  const activateSlide = useCallback((nextIdx: number, instant = false) => {
    if (nextIdx === prevIndex.current && !instant) return;
    const prevIdx = prevIndex.current;
    const goingForward = nextIdx > prevIdx;
    prevIndex.current = nextIdx;
    setActiveIndex(nextIdx);

    const ind = INDUSTRIES[nextIdx];

    // ── Images: clip-path wipe ──────────────────────────────────────────────
    imageRefs.current.forEach((el, i) => {
      if (!el) return;
      if (instant) {
        gsap.set(el, { opacity: i === nextIdx ? 1 : 0, clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }
      if (i === nextIdx) {
        // Incoming: Wipe horizontally
        const fromSide = goingForward ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
        gsap.set(el, { opacity: 1, clipPath: fromSide });
        gsap.to(el, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.0,
          ease: "expo.inOut",
        });
        const img = el.querySelector("img");
        if (img) {
          // Keep base transform scales aligned so entry state handles structural shifts nicely
          gsap.fromTo(img,
            { x: 40 },
            { x: 0, duration: 1.4, ease: "power2.out" }
          );
        }
      } else if (i === prevIdx) {
        // Outgoing: fade out after a beat
        gsap.to(el, { opacity: 0, duration: 0.5, delay: 0.35, ease: "power2.in" });
      } else {
        gsap.set(el, { opacity: 0 });
      }
    });

    if (instant) return;

    // Fixed horizontal slide for text elements
    const EXIT_X  = goingForward ? "-60px" : "60px";
    const ENTER_X = goingForward ? "60px"  : "-60px";

    // ── Title: slide out old, slide in new ───────────────────────────────
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        x: EXIT_X,
        opacity: 0,
        duration: 0.32,
        ease: "power2.in",
        onComplete: () => {
          if (titleRef.current) titleRef.current.textContent = ind.name;
          gsap.fromTo(
            titleRef.current,
            { x: ENTER_X, opacity: 0 },
            { x: "0px", opacity: 1, duration: 0.65, ease: "expo.out" }
          );
        },
      });
    }

    // ── Tag pill ─────────────────────────────────────────────────────────
    if (tagRef.current) {
      gsap.to(tagRef.current, {
        opacity: 0, x: EXIT_X, duration: 0.28, ease: "power2.in",
        onComplete: () => {
          if (tagRef.current) tagRef.current.textContent = ind.tag;
          gsap.fromTo(tagRef.current,
            { x: ENTER_X, opacity: 0 },
            { x: "0px", opacity: 1, duration: 0.55, ease: "expo.out" }
          );
        },
      });
    }

    // ── Description ──────────────────────────────────────────────────────
    if (descRef.current) {
      gsap.to(descRef.current, {
        opacity: 0, x: EXIT_X, duration: 0.3, delay: 0.04, ease: "power2.in",
        onComplete: () => {
          if (descRef.current) descRef.current.textContent = ind.description;
          gsap.fromTo(descRef.current,
            { x: ENTER_X, opacity: 0 },
            { x: "0px", opacity: 1, duration: 0.6, delay: 0.05, ease: "expo.out" }
          );
        },
      });
    }

    // ── Index counter ─────────────────────────────────────────────────────
    if (indexRef.current) {
      gsap.to(indexRef.current, {
        opacity: 0, y: goingForward ? -12 : 12, duration: 0.2, ease: "power2.in",
        onComplete: () => {
          if (indexRef.current) indexRef.current.textContent = ind.index;
          gsap.fromTo(indexRef.current,
            { opacity: 0, y: goingForward ? 12 : -12 },
            { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
          );
        },
      });
    }

    // ── Ambient ghost number ──────────────────────────────────────────────
    if (ambientRef.current) {
      gsap.to(ambientRef.current, {
        opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => {
          if (ambientRef.current) ambientRef.current.textContent = ind.index;
          gsap.to(ambientRef.current, { opacity: 1, duration: 0.55, ease: "power2.out" });
        },
      });
    }
  }, []);

  // ── Scroll setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    // Init first slide without animation
    if (titleRef.current) titleRef.current.textContent = INDUSTRIES[0].name;
    if (tagRef.current)   tagRef.current.textContent   = INDUSTRIES[0].tag;
    if (descRef.current)  descRef.current.textContent  = INDUSTRIES[0].description;
    if (indexRef.current) indexRef.current.textContent = INDUSTRIES[0].index;
    if (ambientRef.current) ambientRef.current.textContent = INDUSTRIES[0].index;
    activateSlide(0, true);

    const ctx = gsap.context(() => {
      // Entry animation
      gsap.fromTo(stickyRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Scroll-driven slide triggers
      const total = INDUSTRIES.length;
      INDUSTRIES.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: () => `top+=${(i / total) * (sectionRef.current!.offsetHeight - window.innerHeight)} top`,
          end:   () => `top+=${((i + 1) / total) * (sectionRef.current!.offsetHeight - window.innerHeight)} top`,
          onEnter:     () => activateSlide(i),
          onEnterBack: () => activateSlide(i),
        });

        // Horizontal Parallax with scaling to secure margins and remove whitespace gaps
        gsap.fromTo(
          imageRefs.current[i]?.querySelector("img"),
          { xPercent: 10, scale: 1.25 },
          {
            xPercent: 10,
            scale: 1.18, 
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => `top+=${(i / total) * (sectionRef.current!.offsetHeight - window.innerHeight)} top`,
              end:   () => `top+=${((i + 1) / total) * (sectionRef.current!.offsetHeight - window.innerHeight)} top`,
              scrub: 2,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activateSlide]);

  return (
    <>
      <section
        ref={sectionRef}
        className="ids-section"
        aria-label="Industries we serve"
        style={{ height: `${INDUSTRIES.length * 100}vh` }}
      >
        <div ref={stickyRef} className="ids-sticky">

          {/* ── Full-bleed image stack ──────────────────────────────────── */}
          <div className="ids-images" aria-hidden="true">
            {INDUSTRIES.map((ind, i) => (
              <div
                key={ind.name}
                ref={(el) => { imageRefs.current[i] = el; }}
                className="ids-img-layer"
              >
                <img src={ind.image} alt={ind.name} className="ids-img" />
                <div className="ids-img-overlay" />
              </div>
            ))}
          </div>

          {/* ── Grain ──────────────────────────────────────────────────── */}
          <div className="ids-grain" aria-hidden="true" />

          {/* ── Left: active content (single DOM node, text swapped) ────── */}
          <div className="ids-detail">
            <p className="ids-eyebrow">Industries We Serve</p>

            <span ref={tagRef} className="ids-tag">{INDUSTRIES[0].tag}</span>

            <h2 ref={titleRef} className="ids-title">
              {INDUSTRIES[0].name}
            </h2>

            <p ref={descRef} className="ids-desc">
              {INDUSTRIES[0].description}
            </p>

            <Link to="/projects" className="ids-cta">
              View projects <ArrowUpRight className="ids-cta-icon" />
            </Link>
          </div>

          {/* ── Bottom counter ──────────────────────────────────────────── */}
          <div className="ids-counter" aria-hidden="true">
            <span ref={indexRef} className="ids-counter-cur">{INDUSTRIES[0].index}</span>
            <span className="ids-counter-sep">/</span>
            <span className="ids-counter-total">{String(INDUSTRIES.length).padStart(2, "0")}</span>
          </div>

          {/* ── Ghost ambient number ────────────────────────────────────── */}
          <div ref={ambientRef} className="ids-ambient" aria-hidden="true">
            {INDUSTRIES[0].index}
          </div>
        </div>
      </section>

      <style>{`
        /* ─── LAYOUT ──────────────────────────────────────────────────────── */
        .ids-section { position: relative; z-index: 21; }

        .ids-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr;
          align-items: stretch;
        }

        /* ─── IMAGES ──────────────────────────────────────────────────────── */
        .ids-images { position: absolute; inset: 0; z-index: 0; }

        .ids-img-layer {
          position: absolute;
          inset: 0;
          opacity: 0;
          will-change: opacity, clip-path;
        }
        .ids-img-layer:first-child { opacity: 1; }

        .ids-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform;
        }

        .ids-img-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(110deg,
              rgba(4,14,9,0.88) 0%,
              rgba(4,14,9,0.58) 42%,
              rgba(4,14,9,0.18) 70%,
              rgba(4,14,9,0.52) 100%),
            linear-gradient(to top, rgba(4,14,9,0.72) 0%, transparent 48%);
        }

        /* ─── GRAIN ───────────────────────────────────────────────────────── */
        .ids-grain {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }

        /* ─── LEFT DETAIL ─────────────────────────────────────────────────── */
        .ids-detail {
          position: relative;
          z-index: 3;
          grid-column: 1;
          padding: clamp(3rem, 6vw, 6rem) clamp(2rem, 5vw, 5.5rem);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          max-width: 680px;
          gap: 0;
          overflow: hidden;
        }

        .ids-eyebrow {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
          margin: 0 0 2rem;
        }

        .ids-tag {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: #E47A38;
          padding: 0.3rem 0.75rem;
          border: 1px solid rgba(228,122,56,0.4);
          border-radius: 99px;
          background: rgba(228,122,56,0.08);
          width: fit-content;
          margin-bottom: 1.1rem;
          will-change: transform, opacity;
        }

        .ids-title {
          font-size: clamp(2rem, 4vw, 4.5rem);
          font-weight: 700;
          line-height: 0.94;
          letter-spacing: -0.04em;
          color: #ffffff;
          text-transform: uppercase;
          font-family: var(--font-display, 'Georgia', serif);
          margin: 0 0 1.4rem;
          will-change: transform, opacity;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .ids-desc {
          font-size: clamp(0.82rem, 0.95vw, 0.95rem);
          line-height: 1.7;
          color: rgba(255,255,255,0.55);
          max-width: 44ch;
          margin: 0 0 2rem;
          will-change: transform, opacity;
        }

        .ids-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #ffffff;
          text-decoration: none;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(255,255,255,0.28);
          width: fit-content;
          transition: color 0.25s, border-color 0.25s;
        }
        .ids-cta:hover { color: #E47A38; border-color: #E47A38; }
        .ids-cta-icon { width: 13px; height: 13px; flex-shrink: 0; }

        /* ─── COUNTER ─────────────────────────────────────────────────────── */
        .ids-counter {
          position: absolute;
          top: clamp(2.5rem, 5vw, 5rem);
          left: clamp(2rem, 5vw, 5.5rem);
          z-index: 4;
          display: flex;
          align-items: baseline;
          gap: 0.2rem;
          font-family: var(--font-display, 'Georgia', serif);
        }
        .ids-counter-cur {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          display: inline-block;
          will-change: transform, opacity;
        }
        .ids-counter-sep { font-size: 0.85rem; color: rgba(255,255,255,0.3); margin: 0 0.15rem; }
        .ids-counter-total { font-size: 0.8rem; color: rgba(255,255,255,0.3); }

        /* ─── AMBIENT NUMBER ──────────────────────────────────────────────── */
        .ids-ambient {
          position: absolute;
          bottom: clamp(1rem, 2.5vw, 2.5rem);
          right: clamp(2.5rem, 5vw, 6rem);
          z-index: 2;
          font-size: clamp(6rem, 16vw, 20rem);
          font-weight: 900;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.06);
          font-family: var(--font-display, 'Georgia', serif);
          pointer-events: none;
          letter-spacing: -0.06em;
          user-select: none;
        }

        /* ─── MOBILE ──────────────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .ids-ambient { display: none; }
          .ids-detail { max-width: 100%; padding: 2rem 1.5rem; overflow: hidden; }
          .ids-title { font-size: clamp(1.8rem, 8vw, 2.5rem); white-space: normal; }
          .ids-img-overlay {
            background: linear-gradient(to top, rgba(4,14,9,0.92) 0%, rgba(4,14,9,0.5) 55%, rgba(4,14,9,0.12) 100%);
          }
        }
      `}</style>
    </>
  );
}