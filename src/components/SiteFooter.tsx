import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logoImg from "@/assets/logo/Sorana-Logo.png";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
function AnimatedLink({
  to, onClick, children, className = "",
}: {
  to: string; onClick?: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <Link to={to} onClick={onClick}
      className={`group relative overflow-hidden inline-flex items-center w-fit ${className}`}>
      <span className="transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-[110%]">
        {children}
      </span>
      <span className="absolute left-0 top-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-[110%] group-hover:translate-y-0 text-white/60">
        {children}
      </span>
    </Link>
  );
}

export function SiteFooter() {
  const slideRef      = useRef<HTMLDivElement>(null);
  const menuCardRef   = useRef<HTMLDivElement>(null);
  const menuItemsRef  = useRef<HTMLDivElement>(null);
  const soranaRef     = useRef<HTMLDivElement>(null);
  const bottomBarRef  = useRef<HTMLDivElement>(null);
  // The wrapper div that holds the nav capsule — we animate its position
  const navWrapRef    = useRef<HTMLDivElement>(null);
  const menuTlRef     = useRef<gsap.core.Timeline | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [visible,  setVisible]  = useState(false);
  // Once footer is fully settled at bottom, the capsule is in "bottom mode"
  const [bottomMode, setBottomMode] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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
    const navWrap   = navWrapRef.current;
    if (!slide || !sorana || !bottomBar || !navWrap) return;

    // Initial states
    gsap.set(slide,     { yPercent: -100 });
    gsap.set(sorana,    { opacity: 0, scale: 1.08 });
    gsap.set(bottomBar, { opacity: 0, y: 16 });
    // Capsule starts at top: 28px (set via style), we'll animate it via GSAP y offset
    gsap.set(navWrap,   { y: 0 });

    let st: ScrollTrigger | null = null;

    const init = () => {
      const industries = document.getElementById("industries-section");
      if (!industries) { requestAnimationFrame(init); return; }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: industries,
          start: "bottom bottom",
          end:   "bottom top",
          scrub: 1.0,
          onEnter:     () => {
            setVisible(true);
            setBottomMode(false);
            window.dispatchEvent(new Event("footer-overlay-enter"));
          },
          onEnterBack: () => {
            setVisible(true);
            setBottomMode(false);
            setMenuOpen(false);
            window.dispatchEvent(new Event("footer-overlay-enter"));
          },
          onLeaveBack: () => {
            setVisible(false);
            setBottomMode(false);
            window.dispatchEvent(new Event("footer-overlay-leave"));
          },
          onLeave: () => {
            setBottomMode(true);
            setMenuOpen(true);
          },
        },
      });

      // Phase 1 (0→0.5): slide the footer image in from the top
      tl.to(slide,     { yPercent: 0, ease: "none" },          0);
      tl.to(sorana,    { opacity: 1, scale: 1, ease: "none" }, 0.35);
      tl.to(bottomBar, { opacity: 1, y: 0, ease: "none" },     0.55);

      // Phase 2 (0.5→1): animate the nav capsule downward from top:28px
      // to near the bottom. We calculate the distance at runtime.
      const vpH   = window.innerHeight;
      const capH  = 48;
      const padB  = 20; // padding from bottom
      // navWrap top is 28px from top of slideRef (which is full viewport).
      // Target: bottom of viewport - capH - padB = vpH - capH - padB from top
      const targetY = vpH - capH - padB - 28; // 28 = initial top offset

      tl.to(navWrap, { y: targetY, ease: "none" }, 0.5);

      st = tl.scrollTrigger as ScrollTrigger;
    };

    requestAnimationFrame(init);
    return () => { st?.kill(); };
  }, []);

  /* ── Menu open/close animation ──────────────────────────────────────────
     The menu card always sits above the capsule (bottom: calc(100% - 1px)).
     Clip path: opens upward from bottom → inset from bottom shrinks.
  ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const card  = menuCardRef.current;
    const items = menuItemsRef.current;
    if (!card || !items) return;

    const rows = items.querySelectorAll<HTMLElement>(".menu-row");
    // Start clipped from bottom (so it opens upward)
    gsap.set(card, { display: "none", clipPath: "inset(0% 0% 100% 0%)" });
    gsap.set(rows, { y: 30, opacity: 0 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } });
    tl.set(card,  { display: "flex" })
      .to(card,   { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55 })
      .to(rows,   { y: 0, opacity: 1, stagger: 0.05, duration: 0.38 }, "-=0.35");

    menuTlRef.current = tl;
    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    if (!menuTlRef.current) return;
    menuOpen ? menuTlRef.current.play() : menuTlRef.current.reverse();
  }, [menuOpen]);

  return (
    <>
      {/*
        Spacer — gives the page scroll room after industries end.
        The scrub range is industries "bottom bottom" → "bottom top" = 100vh of scroll.
      */}
      <div style={{ height: "100vh" }} aria-hidden="true" />

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
            src="https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1800&q=90&fit=crop"
            alt="Glass architecture"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Scrim */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(170deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.58) 100%)",
          }} />

          {/* ── Nav capsule wrapper — animates from top:28 downward ── */}
          <div
            ref={navWrapRef}
            style={{
              position: "absolute",
              top: 28,
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(340px, 90vw)",
              zIndex: 10,
              display: "flex", flexDirection: "column", alignItems: "center",
            }}
          >
            {/* Menu card — always above the capsule, clips upward */}
            <div
              ref={menuCardRef}
              style={{
                position: "absolute",
                bottom: "calc(100% - 1px)",
                left: 0, right: 0,
                display: "none", flexDirection: "column",
                background: "rgba(12,12,12,0.94)",
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderBottom: "none",
              }}
            >
              <div ref={menuItemsRef} style={{ padding: "2rem 2rem 1.75rem" }}>
                <div className="menu-row" style={{
                  fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.22em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.25rem",
                }}>Menu</div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "0.1rem", marginBottom: "1.5rem" }}>
                  {[
                    { to: "/",         label: "Home"     },
                    { to: "/about",    label: "About"    },
                    { to: "/products", label: "Products" },
                    { to: "/projects", label: "Projects" },
                    { to: "/services", label: "Services" },
                    { to: "/contact",  label: "Contact"  },
                  ].map(({ to, label }) => (
                    <div key={to} className="menu-row">
                      <AnimatedLink to={to} onClick={() => setMenuOpen(false)}
                        className="text-white"
                        style={{ fontSize: "1.85rem", lineHeight: 1.25, fontWeight: 500, letterSpacing: "-0.02em" } as React.CSSProperties}>
                        {label}
                      </AnimatedLink>
                    </div>
                  ))}
                </nav>

                <div className="menu-row" style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem",
                  fontSize: "0.72rem", borderTop: "1px solid rgba(255,255,255,0.10)",
                  paddingTop: "1rem", marginBottom: "1.1rem", color: "rgba(255,255,255,0.52)",
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <AnimatedLink to="/" onClick={() => setMenuOpen(false)} style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.52)" } as React.CSSProperties}>News</AnimatedLink>
                    <AnimatedLink to="/" onClick={() => setMenuOpen(false)} style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.52)" } as React.CSSProperties}>Showroom</AnimatedLink>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", textAlign: "right" }}>
                    <a href="tel:+251960323232" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.52)" }}>+251 960 323 232</a>
                    <a href="mailto:info@soranaglass.com" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.52)", fontSize: "0.68rem" }}>info@soranaglass.com</a>
                  </div>
                </div>

                <a href="/contact" onClick={() => setMenuOpen(false)}
                  className="menu-row hover:bg-white/15 transition-colors"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "0.5rem", width: "100%", padding: "0.875rem",
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)",
                    color: "#fff", fontSize: "0.625rem", letterSpacing: "0.22em",
                    fontWeight: 700, textTransform: "uppercase", textDecoration: "none",
                  }}>
                  <span style={{ fontSize: "0.875rem", lineHeight: 1 }}>↳</span> GET A QUOTE
                </a>
              </div>
            </div>

            {/* Capsule pill */}
            <div
              onClick={() => {
                if (bottomMode && menuOpen) {
                  // In bottom mode, "close" scrolls to top
                  scrollToTop();
                } else {
                  setMenuOpen(p => !p);
                }
              }}
              style={{
                width: "100%", height: 48,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 1rem", cursor: "pointer",
                background: "linear-gradient(90deg, rgba(10,124,63,0.62) 0%, rgba(232,119,50,0.62) 100%)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.20)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.40)",
                position: "relative", zIndex: 1,
              }}
            >
              <img src={logoImg} alt="Sorana"
                style={{ height: 24, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.9 }}
              />
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.22em", color: "#fff", textTransform: "uppercase" }}>
                {menuOpen ? "" : "SORANA"}
              </span>
              <div style={{ color: "#fff", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {menuOpen ? (
                  bottomMode ? (
                    /* Up-arrow → scroll to top */
                    <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
                      <path d="M10 15V5M10 5L5 10M10 5L15 10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    /* Upward-pointing chevron to close when at top */
                    <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
                      <path d="M10 15V5M10 5L5.5 9.5M10 5L14.5 9.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
                    <line x1="3" y1="6"  x2="17" y2="6"  stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="3" y1="10" x2="17" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="3" y1="14" x2="17" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
            </div>
          </div>
          {/* /capsule wrapper */}

        </div>
        {/* /slideRef */}

        {/* SORANA title — inside fixed shell but OUTSIDE slide */}
        <div ref={soranaRef} style={{
          position: "absolute", inset: 0, zIndex: 5,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", userSelect: "none", opacity: 0,
        }}>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(4.5rem, 17vw, 15rem)",
            fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1,
            background: "linear-gradient(130deg, rgba(195,255,130,0.80) 0%, rgba(130,240,160,0.70) 40%, rgba(210,255,120,0.76) 75%, rgba(170,255,100,0.63) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            WebkitTextStroke: "1px rgba(210,255,160,0.25)",
            filter: "drop-shadow(0 2px 40px rgba(140,255,120,0.15))",
          }}>SORANA</span>
        </div>

        {/* Bottom bar — inside fixed shell but OUTSIDE slide */}
        <div ref={bottomBarRef} style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 6, opacity: 0,
        }}>
          <div style={{
            background: "rgba(0,0,0,0.42)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.09)",
          }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", padding: "1rem 1.5rem", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flex: 1, flexWrap: "wrap", fontSize: "0.6875rem", color: "rgba(255,255,255,0.48)" }}>
                <span>©{new Date().getFullYear()}, Sorana Glass</span>
                {["Instagram", "LinkedIn", "YouTube"].map(s => (
                  <a key={s} href="#" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.48)" }}>{s}</a>
                ))}
              </div>
              <button onClick={scrollToTop} aria-label="Back to top"
                className="hover:text-white hover:border-white/40 transition-colors"
                style={{ width: 36, height: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.55)", cursor: "pointer" }}>
                <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
                  <path d="M10 14V6M10 6L6 10M10 6L14 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flex: 1, justifyContent: "flex-end", flexWrap: "wrap", fontSize: "0.6875rem", color: "rgba(255,255,255,0.48)" }}>
                <Link to="/" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.48)" }}>Privacy policy</Link>
                <Link to="/" className="hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.48)" }}>Terms & conditions</Link>
                <span style={{ color: "rgba(255,255,255,0.22)" }} className="hidden lg:inline">Crafted with precision</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* /fixed shell */}
    </>
  );
}