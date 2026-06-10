import { useRef, useState, useEffect } from "react";

const MILESTONES = [
  {
    year: "2001",
    tag: "Origins",
    heading: "Where It Began",
    body: "Born from a passion for precision, Sorana's founding team built deep technical expertise in automotive glass — servicing Addis Ababa's growing vehicle fleet and earning a reputation for unmatched accuracy.",
    stat: null as string | null,
    accent: "#0A7C3F",
    tagBg: "rgba(10,124,63,0.08)",
  },
  {
    year: "2008",
    tag: "Expansion",
    heading: "Into Architecture",
    body: "As Ethiopia's construction sector surged, Sorana pivoted its craft toward buildings — supplying tempered and laminated glass to hotels, hospitals, and high-rises reshaping Addis Ababa's skyline.",
    stat: null as string | null,
    accent: "#C5601A",
    tagBg: "rgba(197,96,26,0.09)",
  },
  {
    year: "2022",
    tag: "Technology",
    heading: "North Glass Addition",
    body: "Building on our 25-year history of tempering operations, we made a landmark addition: a new advanced North Glass tempering furnace — pushing daily capacity to 2,000 m² across our 4 furnaces.",
    stat: "2,000 m²/day",
    accent: "#0A7C3F",
    tagBg: "rgba(10,124,63,0.08)",
  },
  {
    year: "2024",
    tag: "Vision",
    heading: "Ethiopia's Most Advanced",
    body: "Over 200 completed projects. 80+ specialists. Four tempering lines. Sorana stands as Ethiopia's most fully integrated glass processor — and sets its sights on becoming a continental leader.",
    stat: "200+ Projects",
    accent: "#C5601A",
    tagBg: "rgba(197,96,26,0.09)",
  },
];

export function MilestonesSection() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const go = (i: number) => {
    const next = Math.max(0, Math.min(MILESTONES.length - 1, i));
    setActive(next);
    setAnimKey((k) => k + 1);
  };

  const m = MILESTONES[active];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');

        .ms-section {
          font-family: system-ui, -apple-system, sans-serif;
          padding: 4rem 0 5rem;
          width: 100%;
          box-sizing: border-box;
        }
        .ms-inner {
          width: 100%;
          padding: 0 clamp(1.5rem, 5vw, 4rem);
          box-sizing: border-box;
        }
        .ms-header {
          margin-bottom: 3.5rem;
        }
        .ms-eyebrow {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.35);
          margin-bottom: 10px;
        }
        .ms-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.05;
          color: #111;
        }
        /* Timeline track */
        .ms-track {
          display: flex;
          gap: 0;
          position: relative;
          margin-bottom: 3rem;
        }
        .ms-track::before {
          content: '';
          position: absolute;
          top: 18px;
          left: 18px;
          right: 18px;
          height: 1px;
          background: rgba(0,0,0,0.1);
          z-index: 0;
        }
        .ms-stop {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          position: relative;
          z-index: 1;
        }
        .ms-stop-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,0.12);
          background: #f7f7f5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 0.75rem;
          color: rgba(0,0,0,0.3);
        }
        .ms-stop-dot.active {
          border-color: transparent;
          color: #fff;
          transform: scale(1.15);
        }
        .ms-stop-year {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(0,0,0,0.35);
          transition: color 0.3s;
        }
        .ms-stop.active .ms-stop-year {
          color: #111;
          font-weight: 600;
        }
        /* Card */
        .ms-card {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 0 clamp(2rem, 5vw, 4rem);
          align-items: center;
          min-height: 260px;
          animation: ms-fade-in 0.4s ease;
        }
        @keyframes ms-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ms-left {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ms-big-year {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(5rem, 11vw, 9rem);
          line-height: 0.88;
          letter-spacing: -0.04em;
          color: #111;
        }
        .ms-tag {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 99px;
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          align-self: flex-start;
        }
        .ms-divider {
          width: 1px;
          align-self: stretch;
        }
        .ms-right {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ms-heading {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.6rem, 2.5vw, 2.4rem);
          font-weight: 400;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: #111;
          margin: 0;
        }
        .ms-body {
          font-size: clamp(0.85rem, 1.1vw, 0.95rem);
          color: #666662;
          line-height: 1.78;
          max-width: 52ch;
          margin: 0;
        }
        .ms-stat {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.2rem, 2vw, 1.7rem);
          letter-spacing: -0.02em;
          padding-bottom: 6px;
          border-bottom: 2px solid;
          display: inline-block;
          margin-top: 8px;
        }
        /* Nav buttons */
        .ms-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 2.5rem;
        }
        .ms-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: #111;
        }
        .ms-btn:hover:not(:disabled) {
          background: #111;
          color: #fff;
          border-color: #111;
        }
        .ms-btn:disabled {
          opacity: 0.25;
          cursor: default;
        }
        .ms-counter {
          font-size: 11px;
          letter-spacing: 0.15em;
          color: rgba(0,0,0,0.25);
        }

        /* Mobile */
        @media (max-width: 640px) {
          .ms-card {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            gap: 1.5rem 0;
          }
          .ms-divider { display: none; }
          .ms-big-year { font-size: clamp(4rem, 18vw, 6rem); }
        }
      `}</style>

      <div className="ms-section">
        <div className="ms-inner">

          {/* Header */}
          <div className="ms-header">
            <p className="ms-eyebrow">Our History</p>
            <h2 className="ms-title">Two Decades of Glass</h2>
          </div>

          {/* Timeline track */}
          <div className="ms-track">
            {MILESTONES.map((stop, i) => (
              <div
                key={i}
                className={`ms-stop${i === active ? " active" : ""}`}
                onClick={() => go(i)}
                role="button"
                aria-label={`Go to ${stop.year}`}
              >
                <div
                  className={`ms-stop-dot${i === active ? " active" : ""}`}
                  style={i === active ? { background: stop.accent, borderColor: stop.accent } : {}}
                >
                  {i !== active && <span>{stop.year.slice(2)}</span>}
                </div>
                <span className="ms-stop-year">{stop.year}</span>
              </div>
            ))}
          </div>

          {/* Card — animKey forces remount for animation restart */}
          <div className="ms-card" key={animKey} ref={cardRef}>
            {/* Left */}
            <div className="ms-left">
              <div className="ms-big-year">{m.year}</div>
              <span
                className="ms-tag"
                style={{ background: m.tagBg, color: m.accent }}
              >
                {m.tag}
              </span>
            </div>

            {/* Divider */}
            <div className="ms-divider" style={{ background: `${m.accent}22` }} />

            {/* Right */}
            <div className="ms-right">
              <h3 className="ms-heading">{m.heading}</h3>
              <p className="ms-body">{m.body}</p>
              {m.stat && (
                <span className="ms-stat" style={{ color: m.accent, borderColor: m.accent }}>
                  {m.stat}
                </span>
              )}
            </div>
          </div>

          {/* Nav */}
          <div className="ms-nav">
            <button
              className="ms-btn"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="ms-btn"
              onClick={() => go(active + 1)}
              disabled={active === MILESTONES.length - 1}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="ms-counter">
              {String(active + 1).padStart(2, "0")} / {String(MILESTONES.length).padStart(2, "0")}
            </span>
          </div>

        </div>
      </div>
    </>
  );
}