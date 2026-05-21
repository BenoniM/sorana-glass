import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

// --- Image imports: images from the same folder are always kept as a pair ---
import tempered1 from "@/assets/glasses/tempered/pexels-joerg-hartmann-626385254-20677918.jpg";
import tempered2 from "@/assets/glasses/tempered/pexels-noahdwilke-68724.jpg";

import frosted1 from "@/assets/glasses/frosted/beau-carpenter-EMSoTmhcm3g-unsplash.jpg";
import frosted2 from "@/assets/glasses/frosted/tsuyoshi-kozu-aYI9KmlyWF8-unsplash.jpg";

import frameless1 from "@/assets/glasses/frameless/marina-nazina-nP9e3fu9O1k-unsplash.jpg";
import frameless2 from "@/assets/glasses/frameless/pexels-artbovich-6436749.jpg";

import shower1 from "@/assets/glasses/shower/pexels-artbovich-7546284.jpg";
import shower2 from "@/assets/glasses/shower/pexels-artbovich-8082556.jpg";

import laminated1 from "@/assets/glasses/laminated/eiichi-hirakawa-q_FWWQCPTNw-unsplash.jpg";
import laminated2 from "@/assets/glasses/laminated/martin-bollero-oepMVk65V3g-unsplash.jpg";

import autoglass1 from "@/assets/glasses/autoglass/pexels-introspectivedsgn-4839258.jpg";
import autoglass2 from "@/assets/glasses/autoglass/pexels-uk-car-glass-222332278-11950154.jpg";

import bulletproof1 from "@/assets/glasses/bulletproof/eiichi-hirakawa-q_FWWQCPTNw-unsplash (1).jpg";
import bulletproof2 from "@/assets/glasses/bulletproof/pexels-haberdoedas-33530415.jpg";

import printed1 from "@/assets/glasses/printed/annie-spratt-RAsj_sLQbJ0-unsplash.jpg";
import printed2 from "@/assets/glasses/printed/pexels-macb25-18836811.jpg";

import sandblasted1 from "@/assets/glasses/sandblasted/hung-nguyen-6vve9yyicyc-unsplash.jpg";
import sandblasted2 from "@/assets/glasses/sandblasted/pexels-kassiamelox-14303756.jpg";

gsap.registerPlugin(ScrollTrigger);

// Must match LoadingScreen total animation time (2200ms stage1 + 1200ms split = 3400ms)
const LOADING_DURATION = 3400;

/** Each pair = two images from the same folder */
type Pair = [string, string];

const ALL_PAIRS: Pair[] = [
  [tempered1, tempered2],
  [frosted1, frosted2],
  [frameless1, frameless2],
  [shower1, shower2],
  [laminated1, laminated2],
  [autoglass1, autoglass2],
  [bulletproof1, bulletproof2],
  [printed1, printed2],
  [sandblasted1, sandblasted2],
];

// Strip layout: rotate the pairs so each strip shows a different starting set
// dir: 1 = scroll left (→←), -1 = scroll right (←→)
// speed: animation duration in seconds (slower = more cinematic)
const STRIPS = [
  { start: 0, dir:  1, speed: 38 },
  { start: 3, dir: -1, speed: 30 },
  { start: 6, dir:  1, speed: 44 },
] as const;

// Build a strip's pair list starting from the given index (wraps around)
function buildStripPairs(start: number, count = 6): Pair[] {
  return Array.from({ length: count }, (_, i) => ALL_PAIRS[(start + i) % ALL_PAIRS.length]);
}

// Each image: 230px wide × 310px tall. Gap within pair: 10px. Gap between pairs: 16px.
// One set of 6 pairs:  6 × (230+10+230) + 5 × 16 = 6 × 470 + 80 = 2820 + 80 = 2900px
// Duplicate appended → total track 5800px; animation moves by 2916px
// (2900px + 16px trailing gap that bridging the two copies)
const CYCLE_PX = 2916;

export function HeroSection() {
  const heroRef    = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Overlay dissolves as user scrolls (cloud-going-away effect) ──────────
      if (overlayRef.current && heroRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "65% top",
            scrub: 1.2,
          },
        });
      }
    }, heroRef);

    // ── Hero content fades in AFTER the loading screen finishes ──────────────
    const elements = contentRef.current?.querySelectorAll<HTMLElement>(".hero-animate");
    if (elements && elements.length) {
      gsap.set(elements, { opacity: 0, y: 36 });
      const timer = setTimeout(() => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          stagger: 0.14,
          duration: 1,
          ease: "power3.out",
        });
      }, LOADING_DURATION + 100); // small buffer after loading screen disappears

      return () => {
        clearTimeout(timer);
        ctx.revert();
      };
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-screen overflow-hidden bg-foreground"
    >
      {/* ── Diagonal image strips ────────────────────────────────────────────── */}
      <div className="hero-strips-wrapper">
        {STRIPS.map((strip, si) => {
          const pairs = buildStripPairs(strip.start);
          // Duplicate the pairs for the seamless loop
          const allPairs: Pair[] = [...pairs, ...pairs];

          return (
            <div
              key={si}
              className={`hero-strip ${strip.dir > 0 ? "hero-strip-ltr" : "hero-strip-rtl"}`}
              style={{ animationDuration: `${strip.speed}s` }}
            >
              {allPairs.map(([img1, img2], pi) => (
                <div key={pi} className="hero-pair">
                  <img
                    src={img1}
                    alt=""
                    aria-hidden="true"
                    loading="eager"
                    decoding="async"
                    className="hero-pair-img"
                  />
                  <img
                    src={img2}
                    alt=""
                    aria-hidden="true"
                    loading="eager"
                    decoding="async"
                    className="hero-pair-img"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ── Brand-color overlay (fades on scroll) ───────────────────────────── */}
      <div ref={overlayRef} className="hero-overlay" aria-hidden="true" />

      {/* ── Dark scrim for text legibility ──────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[6] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(10,20,15,0.55) 0%, rgba(10,20,15,0.35) 100%)" }}
        aria-hidden="true"
      />

      {/* ── Centred hero content ─────────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6"
      >
        {/* Badge */}
        <span className="hero-animate inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E87732]" />
          Sorana Glass · Est. 2017
        </span>

        {/* Headline */}
        <h1 className="hero-animate mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.07] text-white text-balance md:text-7xl">
          Engineering light into Ethiopia's{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #E87732, #f9a05a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            finest spaces
          </span>
          .
        </h1>

        {/* Sub-copy */}
        <p className="hero-animate mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          Over 20 years of glass craftsmanship. From tempered facades to frameless
          showers and automotive windshields — processed, finished and installed in
          Addis Ababa.
        </p>

        {/* CTAs */}
        <div className="hero-animate mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-[#0A7C3F] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#0b9048] hover:scale-[1.03] active:scale-[0.98]"
          >
            Request a quote <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-[1.03] active:scale-[0.98]"
          >
            Explore products
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="hero-animate absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="hero-scroll-dot" />
        </div>
      </div>

      {/* Inline keyframe values accessible to inline styles */}
      <style>{`
        :root { --hero-cycle: ${CYCLE_PX}px; }
      `}</style>
    </section>
  );
}
