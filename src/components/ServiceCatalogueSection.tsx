import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CATALOGUE_SERVICES = [
  {
    title: 'Glass Cutting',
    image: 'https://images.pexels.com/photos/7219180/pexels-photo-7219180.jpeg',
  },
  {
    title: 'Glass Drilling',
    image: 'https://images.pexels.com/photos/5691515/pexels-photo-5691515.jpeg',
  },
  {
    title: 'Tempering',
    image: 'https://images.pexels.com/photos/7191404/pexels-photo-7191404.jpeg',
  },
  {
    title: 'Lamination',
    image: 'https://images.pexels.com/photos/5797/kitchen-boards-laminated-wenge.jpg',
  },
  {
    title: 'Sandblasting & Frosting',
    image: 'https://images.pexels.com/photos/28628031/pexels-photo-28628031.jpeg',
  },
  {
    title: 'Digital Printing on Glass',
    image: 'https://images.pexels.com/photos/18549730/pexels-photo-18549730.jpeg',
  },
];

const N = CATALOGUE_SERVICES.length;

export function ServiceCatalogueSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rightContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const centerImagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const bgImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ease = gsap.parseEase('power2.inOut');

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          // Pause the animation slightly before the section ends
          // so the user has time to read the last item before the footer arrives.
          const effectiveProgress = Math.min(1, self.progress / 0.85);
          const sp = effectiveProgress;
          const totalSteps = N - 1;
          const step = sp * totalSteps;

          CATALOGUE_SERVICES.forEach((_, i) => {
            const container = rightContainersRef.current[i];
            const centerImg = centerImagesRef.current[i];
            const bgImg = bgImagesRef.current[i];
            
            if (!container || !centerImg || !bgImg) return;

            const distance = step - i;

            // Container clip-path reveal
            if (distance <= -1) {
              container.style.clipPath = 'inset(100% 0 0% 0)';
            } else if (distance >= 0) {
              container.style.clipPath = 'inset(0% 0 0% 0)';
            } else {
              const p = distance + 1; 
              const eased = ease(p);
              container.style.clipPath = `inset(${(1 - eased) * 100}% 0 0% 0)`;
            }

            // Image scaling effect
            if (distance < 0) {
              const p = Math.max(0, distance + 1);
              const eased = ease(p);
              centerImg.style.transform = `scale(${1.4 - 0.4 * eased})`;
              bgImg.style.transform = `scale(${1.2 - 0.2 * eased})`;
            } else {
              const p = Math.min(1, distance);
              const eased = ease(p);
              centerImg.style.transform = `scale(${1 - 0.15 * eased})`;
              bgImg.style.transform = `scale(${1 - 0.05 * eased})`;
            }
          });

          const newIdx = Math.min(Math.round(step), N - 1);
          if (newIdx !== activeIndexRef.current) {
            activeIndexRef.current = newIdx;
            setActiveIndex(newIdx);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
        .caps-section {
          font-family: 'DM Sans', sans-serif;
        }
        .caps-headline {
          font-family: 'DM Serif Display', serif;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full"
        style={{ height: `${(N + 0.5) * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex bg-[#083D1F]">
          
          {/* LEFT: Texts */}
          <div className="w-1/2 h-full flex flex-col justify-center px-10 md:px-16 lg:px-24 z-10 caps-section relative">
            
            {/* Header Block */}
            <div className="mb-12 lg:mb-16">
              <h2 className="caps-headline text-4xl lg:text-5xl text-white mb-4">Service Catalogue</h2>
            </div>

            {/* List Block */}
            <div className="w-full flex flex-col">
              {CATALOGUE_SERVICES.map((cap, i) => (
                <div 
                  key={`text-${i}`} 
                  className={`flex gap-6 mb-5 lg:mb-8 transition-all duration-700 ease-out items-center ${
                    activeIndex === i ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'
                  }`}
                >
                  <span className="text-sm font-medium text-white/40 w-6">
                    0{i + 1}
                  </span>
                  <h3 className="text-2xl lg:text-3xl caps-headline text-white">{cap.title}</h3>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT: Images */}
          <div className="w-1/2 h-full relative overflow-hidden bg-black">
            {CATALOGUE_SERVICES.map((cap, i) => (
              <div
                key={`img-container-${i}`}
                ref={el => { rightContainersRef.current[i] = el; }}
                className="absolute inset-0 w-full h-full will-change-[clip-path]"
                style={{
                  zIndex: i,
                  clipPath: i === 0 ? 'inset(0% 0 0% 0)' : 'inset(100% 0 0% 0)',
                }}
              >
                {/* Blurred Background */}
                <div 
                  ref={el => { bgImagesRef.current[i] = el; }}
                  className="absolute inset-0 bg-cover bg-center will-change-transform"
                  style={{ 
                    backgroundImage: `url(${cap.image})`, 
                    filter: 'blur(30px) brightness(0.7)', 
                    transform: 'scale(1.2)' 
                  }}
                />
                
                {/* Foreground Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[55%] aspect-[4/5] overflow-hidden shadow-2xl relative">
                    <img
                      ref={el => { centerImagesRef.current[i] = el; }}
                      src={cap.image}
                      alt={cap.title}
                      className="w-full h-full object-cover will-change-transform"
                      style={{ transform: i === 0 ? 'scale(1)' : 'scale(1.4)' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>
    </>
  );
}
