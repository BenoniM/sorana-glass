import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { services } from "@/lib/site-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICE_IMAGES: Record<string, string> = {
  "Glass Cutting":
    "https://images.pexels.com/photos/7219180/pexels-photo-7219180.jpeg",
  "Glass Drilling":
    "https://images.pexels.com/photos/5691515/pexels-photo-5691515.jpeg",
  Tempering:
    "https://images.pexels.com/photos/11499130/pexels-photo-11499130.jpeg",
  Lamination:
    "https://images.pexels.com/photos/34048368/pexels-photo-34048368.jpeg",
  "Sandblasting & Frosting":
    "https://images.pexels.com/photos/28628031/pexels-photo-28628031.jpeg",
  "Digital Printing on Glass":
    "https://images.pexels.com/photos/18549730/pexels-photo-18549730.jpeg",
  "Bullet-Resistant Processing":
    "https://images.pexels.com/photos/21263452/pexels-photo-21263452.jpeg",
  "Glass Installation":
    "https://images.pexels.com/photos/5691544/pexels-photo-5691544.jpeg",
  "Hardware & Accessories Supply":
    "https://images.pexels.com/photos/3926794/pexels-photo-3926794.jpeg",
  "Custom Glass Fabrication":
    "https://images.pexels.com/photos/7519284/pexels-photo-7519284.jpeg",
};

const FALLBACK =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&fit=crop";

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const total = (services as readonly string[]).length;

  /* ── Embla setup ──────────────────────────────────────────────────── */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  /* ── Inject/remove a global style that nukes the cursor everywhere ── */
  useEffect(() => {
    const styleId = "svc-cursor-none";
    if (cursorVisible) {
      if (!document.getElementById(styleId)) {
        const s = document.createElement("style");
        s.id = styleId;
        s.textContent = "*, *::before, *::after { cursor: none !important; }";
        document.head.appendChild(s);
      }
    } else {
      document.getElementById(styleId)?.remove();
    }
    return () => { document.getElementById(styleId)?.remove(); };
  }, [cursorVisible]);

  /* ── Move cursor via ref (no re-render on every mousemove) ───────── */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }
  }, []);

  /* ── Pin while industries section scrolls over ─────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "bottom bottom",
        end: () => `+=${window.innerHeight}`,
        pin: true,
        pinSpacing: false,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Arrow button shared style ────────────────────────────────────── */
  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    all: "unset" as const,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    background: disabled ? "rgba(10,124,63,0.3)" : "#0A7C3F",
    borderRadius: "50%",
    color: "#ffffff",
    transition: "background 0.2s ease",
    flexShrink: 0,
  });

  /* ── Custom cursor rendered into document.body via portal ─────────── */
  const dragCursor = typeof document !== "undefined"
    ? createPortal(
        <div
          ref={cursorRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transform: "translate(-50%, -50%)",
            opacity: cursorVisible ? 1 : 0,
            transition: "opacity 0.15s ease",
            color: isDragging ? "#fb923c" : "#f97316",
          }}
        >
          {/* Left arrow */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="12 3 5 9 12 15" />
          </svg>

          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              lineHeight: 1,
              color: "currentColor",
            }}
          >
            DRAG
          </span>

          {/* Right arrow */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 3 13 9 6 15" />
          </svg>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {dragCursor}

      <section
        ref={sectionRef}
        className="svc-section"
        aria-labelledby="svc-heading"
      >
        <div className="svc-box">

          {/* ── Split header ──────────────────────────────────────── */}
          <div className="svc-header-mcalpine">
            <h2 className="svc-title-left text-black" id="svc-heading">
              Services
            </h2>
            <div className="svc-header-img-wrapper">
              <img
                src="https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg"
                alt="Factory"
                className="svc-header-img"
              />
            </div>
            <h2 className="svc-title-right text-black">Catalogue</h2>
          </div>

          <div className="svc-carousel-block">
          {/* ── Controls row ─────────────────────────────────────── */}
          <div className="svc-controls">
            {/* Counter */}
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "11px",
                letterSpacing: "0.14em",
                color: "rgba(0, 0, 0, 0.45)",
              }}
            >
              {String(selectedIndex + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>

            {/* Arrow pair */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                aria-label="Previous service"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                style={btnStyle(!canScrollPrev)}
                onMouseEnter={(e) => {
                  if (canScrollPrev)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#0d9e51";
                }}
                onMouseLeave={(e) => {
                  if (canScrollPrev)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#0A7C3F";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="11 4 6 9 11 14" />
                </svg>
              </button>

              <button
                aria-label="Next service"
                onClick={scrollNext}
                disabled={!canScrollNext}
                style={btnStyle(!canScrollNext)}
                onMouseEnter={(e) => {
                  if (canScrollNext)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#0d9e51";
                }}
                onMouseLeave={(e) => {
                  if (canScrollNext)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#0A7C3F";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="7 4 12 9 7 14" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Embla viewport ───────────────────────────────────── */}
          <div
            ref={emblaRef}
            className="svc-embla"
            style={{
              overflow: "hidden",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={(e) => {
              if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
              }
              setCursorVisible(true);
            }}
            onMouseLeave={() => {
              setCursorVisible(false);
              setIsDragging(false);
            }}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
          >
            {/* Embla container */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                touchAction: "pan-y pinch-zoom",
              }}
            >
              {(services as readonly string[]).map((service) => {
                const img = SERVICE_IMAGES[service] ?? FALLBACK;
                return (
                  <Link
                    key={service}
                    to="/services"
                    draggable={false}
                    style={{
                      flexShrink: 0,
                      flexBasis: "380px",
                      height: "490px",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "2px",
                      display: "block",
                      textDecoration: "none",
                    }}
                  >
                    {/* Photo */}
                    <img
                      src={img}
                      alt={service}
                      draggable={false}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition:
                          "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
                        pointerEvents: "none",
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

                    {/* Gradient scrim */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.12) 50%, transparent 70%)",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Label */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "24px 20px 20px",
                        pointerEvents: "none",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "9px",
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.22em",
                          color: "rgba(255,255,255,0.5)",
                          marginBottom: "6px",
                        }}
                      >
                        Sorana Glass
                      </p>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)",
                          fontWeight: 600,
                          color: "#ffffff",
                          lineHeight: 1.1,
                          margin: 0,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {service}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Progress bar ─────────────────────────────────────── */}
          <div className="svc-progress">
            <div
              style={{
                height: "1px",
                background: "rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "#0A7C3F",
                  width: `${((selectedIndex + 1) / total) * 100}%`,
                  transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </div>
          </div>
          </div>

        </div>
      </section>
    </>
  );
}