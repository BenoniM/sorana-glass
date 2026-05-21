import React, { useEffect, useState } from "react";
import logoImg from "@/assets/logo/Sorana-Logo.png";

export function LoadingScreen() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isSplitting, setIsSplitting] = useState(false);

  useEffect(() => {
    // Stage 1: Logo rotates and lines extend/detract.
    // This phase takes 2.2s.
    const splitTimer = setTimeout(() => {
      setIsSplitting(true);
    }, 2200);

    // Stage 2: The panels split and slide off-screen.
    // The panel transition is set to 1.2s (1200ms). So total animation time is 2200ms + 1200ms = 3400ms.
    const endTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 3400);

    return () => {
      clearTimeout(splitTimer);
      clearTimeout(endTimer);
    };
  }, []);

  if (!isAnimating) return null;

  return (
    <>
      <style>{`body { overflow: hidden !important; }`}</style>
      <div
        className={`fixed inset-0 z-[9999] overflow-hidden select-none bg-transparent ${
          isSplitting ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        {/* Left Panel - Slides to the left */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full overflow-hidden bg-[#fff9f2]"
          style={{
            transition: "transform 1200ms cubic-bezier(0.76, 0, 0.24, 1)",
            transform: isSplitting ? "translateX(-100%)" : "translateX(0)",
          }}
        >
          {/* Left Edge Line */}
          <div className="loading-edge-line-left" />

          {/* Top Center Line (positioned at the right edge of this panel) */}
          <div className="loading-center-line-top" />

          {/* 200% wrapper ensures perfectly aligned centering based on container width rather than vw */}
          <div className="absolute top-0 left-0 w-[200%] h-full pointer-events-none">
            <div className="loading-logo-circle">
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 90 90">
                <defs>
                  <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0A7C3F" />
                    <stop offset="100%" stopColor="#E87732" />
                  </linearGradient>
                </defs>
                <circle
                  cx="45" cy="45" r="44"
                  fill="none"
                  stroke="url(#circleGrad)"
                  strokeWidth="2"
                  className="loading-circle-draw"
                  strokeLinecap="round"
                />
              </svg>
              <div className="loading-logo-inner">
                <img
                  src={logoImg}
                  alt="Sorana Glass Logo"
                  className="loading-logo-img"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Slides to the right */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full overflow-hidden bg-[#fff9f2]"
          style={{
            transition: "transform 1200ms cubic-bezier(0.76, 0, 0.24, 1)",
            transform: isSplitting ? "translateX(100%)" : "translateX(0)",
          }}
        >
          {/* Right Edge Line */}
          <div className="loading-edge-line-right" />

          {/* Bottom Center Line (positioned at the left edge of this panel) */}
          <div className="loading-center-line-bottom" />

          {/* 200% wrapper shifted left by 100% of this panel to align exactly with the left panel */}
          <div className="absolute top-0 left-[-100%] w-[200%] h-full pointer-events-none">
            <div className="loading-logo-circle">
              <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 90 90">
                <defs>
                  <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0A7C3F" />
                    <stop offset="100%" stopColor="#E87732" />
                  </linearGradient>
                </defs>
                <circle
                  cx="45" cy="45" r="44"
                  fill="none"
                  stroke="url(#circleGrad)"
                  strokeWidth="2"
                  className="loading-circle-draw"
                  strokeLinecap="round"
                />
              </svg>
              <div className="loading-logo-inner">
                <img
                  src={logoImg}
                  alt="Sorana Glass Logo"
                  className="loading-logo-img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
