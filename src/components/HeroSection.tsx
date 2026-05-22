import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import logoSvg from "@/assets/logo/Sorana-Logo.svg";

// --- Image imports: images from the same folder are always kept as a pair ---
import tempered1   from "@/assets/glasses/tempered/pexels-joerg-hartmann-626385254-20677918.jpg";
import tempered2   from "@/assets/glasses/tempered/pexels-noahdwilke-68724.jpg";
import frosted1    from "@/assets/glasses/frosted/beau-carpenter-EMSoTmhcm3g-unsplash.jpg";
import frosted2    from "@/assets/glasses/frosted/tsuyoshi-kozu-aYI9KmlyWF8-unsplash.jpg";
import frameless1  from "@/assets/glasses/frameless/marina-nazina-nP9e3fu9O1k-unsplash.jpg";
import frameless2  from "@/assets/glasses/frameless/pexels-artbovich-6436749.jpg";
import shower1     from "@/assets/glasses/shower/pexels-artbovich-7546284.jpg";
import shower2     from "@/assets/glasses/shower/pexels-artbovich-8082556.jpg";
import laminated1  from "@/assets/glasses/laminated/eiichi-hirakawa-q_FWWQCPTNw-unsplash.jpg";
import laminated2  from "@/assets/glasses/laminated/martin-bollero-oepMVk65V3g-unsplash.jpg";
import autoglass1  from "@/assets/glasses/autoglass/pexels-introspectivedsgn-4839258.jpg";
import autoglass2  from "@/assets/glasses/autoglass/pexels-uk-car-glass-222332278-11950154.jpg";
import bulletproof1 from "@/assets/glasses/bulletproof/eiichi-hirakawa-q_FWWQCPTNw-unsplash (1).jpg";
import bulletproof2 from "@/assets/glasses/bulletproof/pexels-haberdoedas-33530415.jpg";
import printed1    from "@/assets/glasses/printed/annie-spratt-RAsj_sLQbJ0-unsplash.jpg";
import printed2    from "@/assets/glasses/printed/pexels-macb25-18836811.jpg";
import sandblasted1 from "@/assets/glasses/sandblasted/hung-nguyen-6vve9yyicyc-unsplash.jpg";
import sandblasted2 from "@/assets/glasses/sandblasted/pexels-kassiamelox-14303756.jpg";

gsap.registerPlugin(ScrollTrigger);

// Must match LoadingScreen total animation time (2200ms stage1 + 1200ms split = 3400ms)
const LOADING_DURATION = 3400;

type PairEntry = { imgs: [string, string]; name: string; category: string };

/** Each pair = two images from the same folder + metadata */
const ALL_PAIRS: PairEntry[] = [
  { imgs: [tempered1,    tempered2],    name: "Tempered Glass",      category: "Architectural" },
  { imgs: [frosted1,     frosted2],     name: "Frosted Glass",        category: "Decorative"    },
  { imgs: [frameless1,   frameless2],   name: "Frameless Partitions", category: "Interior"      },
  { imgs: [shower1,      shower2],      name: "Shower Enclosures",    category: "Bathroom"      },
  { imgs: [laminated1,   laminated2],   name: "Laminated Glass",      category: "Security"      },
  { imgs: [autoglass1,   autoglass2],   name: "Auto Glass",           category: "Automotive"    },
  { imgs: [bulletproof1, bulletproof2], name: "Bulletproof Glass",    category: "Security"      },
  { imgs: [printed1,     printed2],     name: "Printed Glass",        category: "Decorative"    },
  { imgs: [sandblasted1, sandblasted2], name: "Sandblasted Glass",    category: "Frosted"       },
];

// Strip layout: three rows. Middle strip (index 1) is the one that un-rotates on scroll.
const STRIPS = [
  { start: 0, dir:  1, speed: 38 },
  { start: 3, dir: -1, speed: 30 },
  { start: 6, dir:  1, speed: 44 },
] as const;

// Each image: 230×310 px  |  within-pair gap: 10 px  |  between-pair gap: 16 px
// 6 pairs per strip → CYCLE = 6×(230+10+230) + 5×16 + 16 = 2916 px
const CYCLE_PX = 2916;

function buildStripPairs(start: number, count = 6): PairEntry[] {
  return Array.from({ length: count }, (_, i) => ALL_PAIRS[(start + i) % ALL_PAIRS.length]);
}

// Number of additional product showcases after the initial reveal
const EXTRA_STEPS = 2;

// Total scroll height: 200vh for phase1+2, then 150vh per extra step, then 100vh buffer to exactly match ScrollTrigger end
const TOTAL_VH = 200 + EXTRA_STEPS * 130 + 80;

export function HeroSection() {
  // ── DOM refs ──────────────────────────────────────────────────────────────
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroRef            = useRef<HTMLElement>(null);
  const stripsWrapperRef   = useRef<HTMLDivElement>(null);
  const clonePairRef       = useRef<HTMLDivElement>(null);
  const overlayRef         = useRef<HTMLDivElement>(null);
  const contentRef         = useRef<HTMLDivElement>(null);
  const scrimRef           = useRef<HTMLDivElement>(null);

  // Expanded view refs
  const infoCardRef         = useRef<HTMLDivElement>(null);
  const infoCardInnerRef    = useRef<HTMLDivElement>(null);

  // Scroll-state tracking
  const hasFoundCenterRef     = useRef(false);
  const activePairRef         = useRef<HTMLElement | null>(null);
  const startWrapperOffsetRef = useRef({ x: 0, y: 0 });
  const timerRef              = useRef<ReturnType<typeof setTimeout>>();
  const initialPairIdxRef     = useRef(0);
  const extraPairsRef         = useRef<PairEntry[]>([]);

  // ── GSAP setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    // Pick pairs that correspond to the visual middle strip so we can map them
    const middlePairs = buildStripPairs(3);

    const ctx = gsap.context(() => {
      // Hero text entrance (fires after loading screen clears)
      const els = contentRef.current?.querySelectorAll<HTMLElement>(".hero-animate");
      if (els?.length) {
        gsap.set(els, { opacity: 0, y: 36 });
        timerRef.current = setTimeout(() => {
          gsap.to(els, { opacity: 1, y: 0, stagger: 0.14, duration: 1, ease: "power3.out" });
        }, LOADING_DURATION + 100);
      }

      // Set initial state for the info card
      gsap.set(infoCardRef.current, {
        xPercent:        -50,
        yPercent:        -50,
        height:          1,
        autoAlpha:       0,
        transformOrigin: "50% 50%",
      });
      gsap.set(infoCardInnerRef.current, { autoAlpha: 0 });
      // Clone starts invisible but stays in the render tree
      gsap.set(clonePairRef.current, { autoAlpha: 0 });

      // ── Main scroll-driven animation ──────────────────────────────────────
      const scrollProxy = { p: 0 };
      const proxyTween = gsap.to(scrollProxy, {
        p: 1,
        ease: "none",
        paused: true,
        onUpdate: () => {
          const p = scrollProxy.p; // 0 → 1

          // ─ Phase 1 (p: 0 → 0.45): de-rotate strips, fade hero text ────────
          const p1 = Math.min(p / 0.45, 1);

          // Use autoAlpha so the nodes become pointer-events: none when fully faded
          gsap.set(overlayRef.current, { autoAlpha: 1 - p1 });
          gsap.set(scrimRef.current, { autoAlpha: 1 - p1 });
          gsap.set(contentRef.current, { autoAlpha: 1 - p1 });

          // ─ Phase 2 progress ───────────────────────────────────────────────
          const p2     = Math.max(0, (p - 0.45) / 0.55);
          const p2card = Math.max(0, (p2 - 0.35) / 0.65);

          // One-shot center-pair detection & freeze ─────────────────────────
          if (p > 0.005 && !hasFoundCenterRef.current) {
            hasFoundCenterRef.current = true;

            // 1. Pause CSS animation
            document.querySelectorAll<HTMLElement>(".hero-strip").forEach(el => {
              el.style.animationPlayState = "paused";
            });

            // 2. Temporarily apply exact Phase 1 end state to get straight geometries
            gsap.set(stripsWrapperRef.current, { rotate: 0, scale: 1 });

            const strips = document.querySelectorAll<HTMLElement>(".hero-strip");
            if (strips.length > 1) {
              const middleStrip = strips[1];
              const pairEls = Array.from(middleStrip.querySelectorAll<HTMLElement>(".hero-pair"));

              const cx = document.documentElement.clientWidth / 2;
              const cy = window.innerHeight / 2;

              let bestIdx = 0;
              let bestDist = Infinity;
              pairEls.forEach((el, idx) => {
                const r = el.getBoundingClientRect();
                const dist = Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
                if (dist < bestDist) { bestDist = dist; bestIdx = idx; }
              });

              const targetPairEl = pairEls[bestIdx];
              activePairRef.current = targetPairEl;
              targetPairEl.classList.add("is-active");

              initialPairIdxRef.current = bestIdx % middlePairs.length;

              // Pick random extras — different from initial
              const available = ALL_PAIRS.filter((_, i) => i !== initialPairIdxRef.current);
              const shuffled = [...available].sort(() => Math.random() - 0.5);
              extraPairsRef.current = shuffled.slice(0, EXTRA_STEPS);

              // Calculate translation needed to center this exact pair
              const r = targetPairEl.getBoundingClientRect();
              startWrapperOffsetRef.current = {
                x: cx - (r.left + r.width / 2),
                y: cy - (r.top + r.height / 2)
              };

              // Populate clone images for seamless handoff
              const imgs = targetPairEl.querySelectorAll("img");
              const cloneImgs = clonePairRef.current?.querySelectorAll("img");
              if (cloneImgs && cloneImgs.length === 2 && imgs.length === 2) {
                cloneImgs[0].src = imgs[0].src;
                cloneImgs[1].src = imgs[1].src;
              }

              // Populate Card Text and Wipe Images
              const entry = middlePairs[bestIdx % middlePairs.length];
              const textGroups = document.querySelectorAll<HTMLElement>(".hero-card-text-group");
              
              if (textGroups[0]) {
                const tl = textGroups[0].querySelector(".hero-card-tl");
                const bl = textGroups[0].querySelector(".hero-card-bl");
                if (tl) tl.textContent = entry.name;
                if (bl) bl.textContent = entry.category;
              }

              const wipeLayers = document.querySelectorAll<HTMLElement>(".hero-slide-layer");
              extraPairsRef.current.forEach((pair, i) => {
                const layer = wipeLayers[i];
                if (layer) {
                  const imgL = layer.querySelector(".hero-slide-img-left") as HTMLImageElement;
                  const imgR = layer.querySelector(".hero-slide-img-right") as HTMLImageElement;
                  if (imgL) imgL.src = pair.imgs[0];
                  if (imgR) imgR.src = pair.imgs[1];
                }
                const group = textGroups[i + 1];
                if (group) {
                  const tl = group.querySelector(".hero-card-tl");
                  const bl = group.querySelector(".hero-card-bl");
                  if (tl) tl.textContent = pair.name;
                  if (bl) bl.textContent = pair.category;
                }
              });
            }
          }

          // Revert if scrolled back to top ──────────────────────────────────
          if (p <= 0.005 && hasFoundCenterRef.current) {
            hasFoundCenterRef.current = false;
            document.querySelectorAll<HTMLElement>(".hero-strip").forEach((el) => {
              el.style.animationPlayState = "running";
            });
            if (activePairRef.current) {
               activePairRef.current.classList.remove("is-active");
               activePairRef.current = null;
            }
          }

          // Apply Phase 1 transforms — runs every frame unconditionally ─────
          gsap.set(stripsWrapperRef.current, {
            rotate: gsap.utils.interpolate(-25, 0, p1),
            scale:  gsap.utils.interpolate(1.8, 1, p1),
          });

          // ─ Phase 2 (p: 0.45 → 1.0): expand clone pair + reveal card ──────
          if (p2 > 0 && hasFoundCenterRef.current && clonePairRef.current && activePairRef.current) {
            const bodyW = document.documentElement.clientWidth;
            const imgW = gsap.utils.interpolate(230, bodyW / 2, p2);
            const imgH = gsap.utils.interpolate(310, window.innerHeight, p2);
            const gap  = gsap.utils.interpolate(10, 0, p2);

            gsap.set(clonePairRef.current.querySelectorAll("img"), { width: imgW, height: imgH });
            gsap.set(clonePairRef.current, { gap: gap, autoAlpha: 1 });

            const origCx = bodyW / 2 - startWrapperOffsetRef.current.x;
            const origCy = window.innerHeight / 2 - startWrapperOffsetRef.current.y;
            const targetCx = bodyW / 2;
            const targetCy = window.innerHeight / 2;

            const currentCx = gsap.utils.interpolate(origCx, targetCx, p2);
            const currentCy = gsap.utils.interpolate(origCy, targetCy, p2);

            const cloneWidth  = imgW * 2 + gap;
            const cloneHeight = imgH;

            gsap.set(clonePairRef.current, {
              left: currentCx - cloneWidth  / 2,
              top:  currentCy - cloneHeight / 2,
            });

            // Fade out the entire grid seamlessly to reveal the clone
            gsap.set(stripsWrapperRef.current, {
              opacity: Math.max(0, 1 - (p2 * 5))
            });
          } else if (p2 <= 0) {
            gsap.set(clonePairRef.current, { autoAlpha: 0 });
            gsap.set(stripsWrapperRef.current, { opacity: 1 });
          }

          gsap.set(infoCardRef.current, {
            height:    `${Math.max(1, p2card * 140)}px`,
            autoAlpha: Math.min(p2card * 2, 1),
          });
          gsap.set(infoCardInnerRef.current, {
            autoAlpha: Math.max(0, (p2card - 0.45) / 0.55),
          });
        },
      });

      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start:   "top top",
        end:     `+=${window.innerHeight * 2}`,  // first 200vh
        scrub:   1.5,
        animation: proxyTween,
      });

      // ── Slideshow Wipes & Info Card Swiping (Mersi-Style) ────────────────────────
      const HOLD_STEPS = 0.6; // Extra progress to hold the final product at the end
      const stepSize = 1 / (EXTRA_STEPS + HOLD_STEPS);
      
      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start:   `top+=${window.innerHeight * 2} top`,
        end:     `top+=${window.innerHeight * (2 + EXTRA_STEPS * 1.5)} top`, // extended end duration
        scrub:   1.2,
        snap: {
          snapTo: (value) => {
            // If the user has scrolled past the final transition (into the hold zone), don't snap
            if (value > stepSize * EXTRA_STEPS + 0.05) return value;
            // Otherwise snap to the nearest step (0, stepSize, stepSize * 2)
            const step = Math.round(value / stepSize);
            return step * stepSize;
          },
          duration: { min: 0.2, max: 0.6 },
          ease: "power2.inOut"
        },
        onUpdate: (self) => {
          const sp = self.progress; // 0 → 1
          
          // 1. Image Wipe Animations
          const wipeLayers = document.querySelectorAll<HTMLElement>(".hero-slide-layer");
          wipeLayers.forEach((layer, i) => {
             const layerStart = i * stepSize;
             const layerEnd = (i + 1) * stepSize;
             
             let p = 0;
             if (sp <= layerStart) p = 0;
             else if (sp >= layerEnd) p = 1;
             else p = (sp - layerStart) / stepSize;
             
             const eased = gsap.utils.clamp(0, 1, p);
             
             const leftWipe = layer.querySelector<HTMLElement>(".hero-slide-wipe-left");
             const rightWipe = layer.querySelector<HTMLElement>(".hero-slide-wipe-right");
             
             if (leftWipe) leftWipe.style.height = `${eased * 100}%`;
             if (rightWipe) rightWipe.style.height = `${eased * 100}%`;
          });

          // 2. Info Card Layer Wipe Animations
          const cardLayers = document.querySelectorAll<HTMLElement>(".hero-info-card-layer");
          cardLayers.forEach((layer, i) => {
            if (i === 0) return; // Base layer is always fully unclipped
            
            // The transition for layer i happens during step i-1
            const layerStart = (i - 1) * stepSize;
            const layerEnd = i * stepSize;
            
            let p = 0;
            if (sp <= layerStart) p = 0;
            else if (sp >= layerEnd) p = 1;
            else p = (sp - layerStart) / stepSize;
            
            const eased = gsap.utils.clamp(0, 1, p);
            
            // Wipe from top to bottom: inset(0 0 100% 0) -> inset(0 0 0 0)
            layer.style.clipPath = `inset(0 0 ${100 - eased * 100}% 0)`;
            
            // Manage pointer events: only the topmost visible layer should be interactive
            if (eased > 0.5 && p < 1) {
              layer.style.pointerEvents = 'auto';
            } else if (eased === 1) {
               layer.style.pointerEvents = 'auto';
            } else {
               layer.style.pointerEvents = 'none';
            }
          });
          
          // Ensure base layer pointer events are turned off if layer 1 is active
          const baseLayer = cardLayers[0];
          if (baseLayer) {
             baseLayer.style.pointerEvents = sp > (stepSize * 0.5) ? 'none' : 'auto';
          }
        },
      });

    }, scrollContainerRef);

    return () => {
      clearTimeout(timerRef.current);
      ctx.revert();
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={scrollContainerRef} style={{ height: `${TOTAL_VH}vh` }}>
      <section
        ref={heroRef}
        id="hero"
        className="relative h-screen overflow-hidden bg-foreground"
        style={{ position: "sticky", top: 0 }}
      >
        {/* ── Diagonal image strips ──────────────────────────────────────────── */}
        <div ref={stripsWrapperRef} className="hero-strips-wrapper">
          {STRIPS.map((strip, si) => {
            const base     = buildStripPairs(strip.start);
            const allPairs = [...base, ...base]; // duplicate for seamless loop

            return (
              <div
                key={si}
                className={`hero-strip ${strip.dir > 0 ? "hero-strip-ltr" : "hero-strip-rtl"}`}
                style={{ animationDuration: `${strip.speed}s` }}
              >
                {allPairs.map((pair, pi) => (
                  <div key={pi} className="hero-pair">
                    <img src={pair.imgs[0]} alt="" aria-hidden="true" loading="eager" decoding="async" className="hero-pair-img" />
                    <img src={pair.imgs[1]} alt="" aria-hidden="true" loading="eager" decoding="async" className="hero-pair-img" />
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* ── High-performance clone for Phase 2 ────────────────────────────── */}
        <div
          ref={clonePairRef}
          className="hero-pair is-active"
          style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none' }}
        >
          <img className="hero-pair-img" alt="" />
          <img className="hero-pair-img" alt="" />
        </div>

        {/* ── Additional Slideshow Wipes (Mersi-Style) ──────────────────────── */}
        <div className="hero-slides-wrapper" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
          {[...Array(EXTRA_STEPS)].map((_, i) => (
             <div key={i} className="hero-slide-layer" style={{ position: 'absolute', inset: 0 }}>
               {/* Left panel wipes UP from BOTTOM */}
               <div className="hero-slide-wipe-left" style={{ position: 'absolute', left: 0, bottom: 0, width: '50%', height: 0, overflow: 'hidden', willChange: 'height' }}>
                 <img className="hero-slide-img-left" alt="" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100vh', objectFit: 'cover' }} />
               </div>
               {/* Right panel wipes DOWN from TOP */}
               <div className="hero-slide-wipe-right" style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: 0, overflow: 'hidden', willChange: 'height' }}>
                 <img className="hero-slide-img-right" alt="" style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100vh', objectFit: 'cover' }} />
               </div>
             </div>
          ))}
        </div>

        {/* ── Brand-colour overlay (fades on scroll phase 1) ─────────────────── */}
        <div ref={overlayRef} className="hero-overlay" aria-hidden="true" />

        {/* ── Dark scrim for text legibility ────────────────────────────────── */}
        <div
          ref={scrimRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 6, background: "linear-gradient(to bottom, rgba(10,20,15,0.55) 0%, rgba(10,20,15,0.35) 100%)" }}
          aria-hidden="true"
        />

        {/* ── Hero text content ──────────────────────────────────────────────── */}
        <div
          ref={contentRef}
          className="relative flex h-full flex-col items-center justify-center text-center px-6"
          style={{ zIndex: 10 }}
        >
          {/* Badge */}
          <span className="hero-animate inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E87732]" />
            Sorana Glass · Est. 2017
          </span>

          {/* Headline */}
          <h1 className="hero-animate mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.07] text-white text-balance md:text-7xl">
            Engineering Right Into Ethiopia's{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #E87732, #f9a05a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Finest Spaces
            </span>
            .
          </h1>

          {/* Sub-copy */}
          <p className="hero-animate mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            Over 20 years of glass craftsmanship. From tempered facades to frameless
            showers and automotive windshields — processed, finished and installed in Addis Ababa.
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
        </div>

        {/* ── Scroll-driven info card ────────────────────────────────────────── */}
        <div ref={infoCardRef} className="hero-info-card" aria-hidden="false">
          <div ref={infoCardInnerRef} className="hero-info-card-inner">

            {/* Render stacked pill layers that wipe over each other */}
            {[...Array(1 + EXTRA_STEPS)].map((_, i) => (
              <div 
                key={i} 
                className="hero-info-card-layer"
                style={{
                  zIndex: i,
                  // Initial: dark green, Middle: #C06B2F, Last: dark green again
                  background: i === 1 ? 'rgba(192, 107, 47, 0.96)' : 'rgba(4, 50, 25, 0.96)',
                  clipPath: i === 0 ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                  pointerEvents: i === 0 ? 'auto' : 'none',
                  // CSS variables to override text colors on the orange background
                  '--text-primary': '#ffffff',
                  '--text-bl': i === 1 ? '#0A7C3F' : '#E87732',
                  '--text-br': '#ffffff',
                  '--arrow-color': i === 1 ? '#0A7C3F' : 'rgba(255,255,255,0.7)',
                } as React.CSSProperties}
              >
                {/* Center: Stamped Logo */}
                <div className="hero-card-center" aria-hidden="true">
                  <img src={logoSvg} alt="" className="hero-card-logo-img" />
                </div>

                <div className="hero-card-text-group" style={{ position: 'absolute', inset: 0 }}>
                  <div className="hero-card-tl"></div>
                  <div className="hero-card-bl"></div>
                  <Link to="/products" className="hero-card-tr" aria-label="View all products">
                    <ArrowRight />
                  </Link>
                  <div className="hero-card-br">Products</div>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Inline keyframe value accessible to inline styles */}
        <style>{`:root { --hero-cycle: ${CYCLE_PX}px; }`}</style>
      </section>
    </div>
  );
}
