import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { industries } from "@/lib/site-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INDUSTRIES = [
  { ...industries[0], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=85&fit=crop' },
  { ...industries[1], image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85&fit=crop' },
  { ...industries[2], image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1400&q=85&fit=crop' },
  { ...industries[3], image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1400&q=85&fit=crop' },
  { ...industries[4], image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85&fit=crop' },
  { ...industries[5], image: 'https://images.pexels.com/photos/5442128/pexels-photo-5442128.jpeg' },
];

function ParallaxCard({ image, alt }: { image: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: -14 },
        {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] overflow-hidden shadow-2xl"
    >
      <img
        ref={imgRef}
        src={image}
        alt={alt}
        className="w-full h-[128%] object-cover brightness-75 will-change-transform"
        style={{ marginTop: '-14%' }}
      />
    </div>
  );
}

export function ProjectsIndustriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const totalSteps = INDUSTRIES.length - 1;

      function getClip(i: number, sp: number) {
        let topClip = 100, bottomClip = 0;
        const revealStart = (i - 1) / totalSteps;
        const revealEnd = i / totalSteps;
        const hideStart = i / totalSteps;
        const hideEnd = (i + 1) / totalSteps;

        if (i === 0) {
          topClip = 0;
          if (sp >= hideEnd) {
            bottomClip = 100;
          } else if (sp > hideStart) {
            const p = (sp - hideStart) / (hideEnd - hideStart);
            bottomClip = gsap.utils.clamp(0, 1, gsap.parseEase('power2.inOut')(p)) * 100;
          }
        } else {
          if (sp <= revealStart) {
            topClip = 100; bottomClip = 0;
          } else if (sp >= hideEnd) {
            topClip = 0; bottomClip = 100;
          } else if (sp > revealStart && sp <= revealEnd) {
            const p = (sp - revealStart) / (revealEnd - revealStart);
            topClip = (1 - gsap.utils.clamp(0, 1, gsap.parseEase('power2.inOut')(p))) * 100;
            bottomClip = 0;
          } else if (sp > hideStart && sp < hideEnd) {
            const p = (sp - hideStart) / (hideEnd - hideStart);
            topClip = 0;
            bottomClip = gsap.utils.clamp(0, 1, gsap.parseEase('power2.inOut')(p)) * 100;
          }
        }
        return { topClip, bottomClip };
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          const sp = self.progress;

          INDUSTRIES.forEach((_, i) => {
            const { topClip, bottomClip } = getClip(i, sp);
            if (leftImagesRef.current[i]) {
              leftImagesRef.current[i]!.style.clipPath = `inset(${topClip}% 0 ${bottomClip}% 0)`;
            }
          });

          const cards = cardRefs.current;
          const viewportMid = window.innerHeight / 2;
          let closestIdx = 0;
          let closestDist = Infinity;

          cards.forEach((card, i) => {
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const cardMid = rect.top + rect.height / 2;
            const dist = Math.abs(cardMid - viewportMid);
            if (dist < closestDist) {
              closestDist = dist;
              closestIdx = i;
            }
          });

          setActiveIndex(closestIdx);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#04331A] text-white">
      {/* LEFT SIDE: Image track */}
      <div className="absolute top-0 left-0 w-1/2 h-full hidden md:block z-10 border-r border-white/10">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {INDUSTRIES.map((ind, i) => (
            <div
              key={ind.name}
              ref={el => { leftImagesRef.current[i] = el; }}
              className="absolute inset-0 will-change-[clip-path]"
              style={{ zIndex: i, clipPath: i === 0 ? "inset(0% 0 0% 0)" : "inset(100% 0 0% 0)" }}
            >
              <img src={ind.image} alt={ind.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Scrolling image + description cards */}
<div className="ml-auto w-full md:w-1/2 flex flex-col items-center z-20">
  <div className="w-full relative" style={{ padding: "50vh 0" }}>
    {INDUSTRIES.map((ind, i) => (
      <div
        key={ind.name}
        ref={el => { cardRefs.current[i] = el; }}
        className="h-[100vh] flex flex-col items-center justify-center relative w-full px-4"
      >
        <div className="relative">
          <ParallaxCard image={ind.image} alt={ind.name} />

          {/* Title centered on this specific image */}
          <h2
  className="absolute inset-0 flex items-center justify-center font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-center transition-all duration-500 pointer-events-none"
  style={{
    opacity: activeIndex === i ? 1 : 0,
    transform:
      activeIndex === i
        ? 'translateY(0)'
        : activeIndex > i
          ? 'translateY(-18px)'
          : 'translateY(18px)',

    // Glassy orange blend
    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.98) 0%,
        rgba(255,255,255,0.78) 20%,
        rgba(227,118,50,0.92) 55%,
        rgba(255,255,255,0.72) 78%,
        rgba(227,118,50,0.85) 100%
      )
    `,

    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',

    // subtle glass edge
    WebkitTextStroke: '1px rgba(255,255,255,0.16)',

    // glossy glow
    textShadow: `
      0 2px 10px rgba(227,118,50,0.28),
      0 4px 24px rgba(0,0,0,0.38),
      0 0 18px rgba(255,255,255,0.10)
    `,

    filter: `
      drop-shadow(0 1px 1px rgba(0,0,0,0.18))
      drop-shadow(0 0 10px rgba(227,118,50,0.18))
    `,
  }}
>
  {ind.name}
</h2>
        </div>

        <p className="relative z-30 mt-10 text-center text-white/80 max-w-sm text-sm tracking-wide font-light">
          {ind.desc}
        </p>
      </div>
    ))}
  </div>
</div>
    </section>
  );
}