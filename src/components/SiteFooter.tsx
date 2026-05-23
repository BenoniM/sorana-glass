import { useRef, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
export function SiteFooter() {
  const slideRef      = useRef<HTMLDivElement>(null);
  const soranaRef     = useRef<HTMLDivElement>(null);
  const bottomBarRef  = useRef<HTMLDivElement>(null);

  const [visible,  setVisible]  = useState(false);

  /* ── Scroll-driven slide + nav capsule travel ───────────────────────────
     Phase 1 (progress 0→0.5): footer image slides in from top, capsule
       rides with it (inside slideRef) — it appears at the top of the image.
     Phase 2 (progress 0.5→1): footer is fully in place; capsule travels
       downward to its resting spot near the bottom of the viewport.
  ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const slide     = slideRef.current;
    const sorana    = soranaRef.current;
    const bottomBar = bottomBarRef.current;
    const siteHeader = document.getElementById("site-header");
    if (!slide || !sorana || !bottomBar) return;

    // Initial states
    gsap.set(slide,     { yPercent: -100 });
    gsap.set(sorana,    { opacity: 0, scale: 1.08 });
    gsap.set(bottomBar, { opacity: 0, y: 16 });
    if (siteHeader) {
      gsap.set(siteHeader, { y: 0 });
    }

    let st: ScrollTrigger | null = null;

    const init = () => {
      const industries = document.getElementById("industries-section");
      if (!industries) { requestAnimationFrame(init); return; }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: industries,
          start: "bottom 200%",
          end:   "bottom bottom",
          scrub: 1.0,
          onEnter:     () => {
            setVisible(true);
          },
          onEnterBack: () => {
            setVisible(true);
            window.dispatchEvent(new Event("footer-bottom-leave"));
          },
          onLeaveBack: () => {
            setVisible(false);
          },
          onLeave: () => {
            window.dispatchEvent(new Event("footer-bottom-enter"));
          },
        },
      });

      // Phase 1 (0→0.5): slide the footer image in from the top
      tl.to(slide,     { yPercent: 0, ease: "none" },          0);
      tl.to(sorana,    { opacity: 1, scale: 1, ease: "none" }, 0.35);
      tl.to(bottomBar, { opacity: 1, y: 0, ease: "none" },     0.55);

      // Animate the site header downward simultaneously with the footer image
      const vpH   = window.innerHeight;
      const capH  = 48;
      const padB  = 20; // padding from bottom
      // site-header top is 24px (top-6). Target is near bottom.
      const targetY = vpH - capH - padB - 24;

      // Calculate proportional duration so it moves at exactly the same pixel speed as the slide
      const durationN = 0.5 * (targetY / vpH);
      const startT = 0.5 - durationN;

      if (siteHeader) {
        tl.to(siteHeader, { y: targetY, ease: "none", duration: durationN }, startT);
      }

      st = tl.scrollTrigger as ScrollTrigger;
    };

    requestAnimationFrame(init);
    return () => { st?.kill(); };
  }, []);

  return (
    <>
      {/* Fixed shell */}
      <div style={{
        position: "fixed", inset: 0,
        zIndex: 40, overflow: "hidden",
        pointerEvents: visible ? "auto" : "none",
      }}>
        {/* THE SLIDE DIV — travels from -100vh → 0 */}
        <div
          ref={slideRef}
          style={{ position: "absolute", inset: 0, willChange: "transform" }}
        >
          {/* Background image */}
          <img
            src="https://images.pexels.com/photos/13772063/pexels-photo-13772063.jpeg"
            alt="Glass architecture"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Scrim */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(170deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.58) 100%)",
          }} />



        </div>
        {/* /slideRef */}

        {/* SORANA title — inside fixed shell but OUTSIDE slide */}
        <div ref={soranaRef} style={{
          position: "absolute", inset: 0, zIndex: 5,
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          padding: "0 3rem 12vh 3rem", // Pushed lower and to edges
          pointerEvents: "none", userSelect: "none", opacity: 0,
        }}>
          {["S", "O", "R", "A", "N", "A"].map((letter, i) => (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(4rem, 15vw, 14rem)",
              fontWeight: 700, lineHeight: 0.8,
              background: "linear-gradient(130deg, rgba(10,124,63,0.85) 0%, rgba(232,119,50,0.85) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              color: "transparent",
            }}>{letter}</span>
          ))}
        </div>

        {/* Bottom bar — inside fixed shell but OUTSIDE slide */}
        <div ref={bottomBarRef} style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 6, opacity: 0,
        }}>
          <div>
            <div style={{ width: "100%", margin: "0 auto", display: "flex", alignItems: "center", padding: "1.5rem 3rem", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flex: 1, flexWrap: "wrap", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
                <span>©{new Date().getFullYear()}, Sorana Glass</span>
                {["Instagram", "LinkedIn", "YouTube"].map(s => (
                  <a key={s} href="#" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}>{s}</a>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flex: 1, justifyContent: "flex-end", flexWrap: "wrap", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
                <Link to="/" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}>Privacy policy</Link>
                <Link to="/" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}>Terms & conditions</Link>
                <span style={{ color: "rgba(255,255,255,0.4)" }} className="hidden lg:inline">Crafted with precision</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* /fixed shell */}
    </>
  );
}