import { useRef, useEffect } from 'react';
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

export function ProjectsIndustriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftImagesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const totalSteps = INDUSTRIES.length - 1;

      function getClip(i: number, sp: number) {
        let topClip = 100, bottomClip = 0;
        const revealStart = (i - 1) / totalSteps;
        const revealEnd   = i / totalSteps;
        const hideStart   = i / totalSteps;
        const hideEnd     = (i + 1) / totalSteps;

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
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#04331A] text-white">
      {/* LEFT SIDE: Absolute track + Sticky container */}
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

      {/* RIGHT SIDE: Scrolling Titles */}
      <div className="ml-auto w-full md:w-1/2 flex flex-col items-center z-20">
        {/* Padding so first item hits center when section hits top, and last hits center when section hits bottom */}
        <div className="w-full relative" style={{ padding: "50vh 0" }}>
           {INDUSTRIES.map((ind) => (
              <div key={ind.name} className="h-[100vh] flex flex-col items-center justify-center relative w-full px-4">
                 {/* Small image container */}
                 <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] z-10 shadow-2xl flex items-center justify-center">
                    <img src={ind.image} alt={ind.name} className="absolute inset-0 w-full h-full object-cover brightness-75 transition-transform duration-700 hover:scale-105" />
                    
                    {/* Giant overlapping text precisely centered over the image */}
                    <div className="absolute inset-0 w-[150%] left-[-25%] flex items-center justify-center z-20 pointer-events-none">
                      <h2 
                          className="font-display text-[#C9A265] text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-medium leading-[0.9] text-center" 
                          style={{ textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}
                      >
                        {ind.name}
                      </h2>
                    </div>
                 </div>
                 <p className="relative z-30 mt-12 text-center text-white/80 max-w-sm text-sm tracking-wide font-light">
                    {ind.desc}
                 </p>
              </div>
           ))}
        </div>
      </div>
    </section>
  );
}
