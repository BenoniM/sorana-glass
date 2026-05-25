import React, { useRef, useState } from "react";

const LEADERS = [
  { name: "Solomon Tefera", role: "Chief Executive Officer", image: "https://images.pexels.com/photos/5439149/pexels-photo-5439149.jpeg" },
  { name: "Daniel Tekle", role: "General Manager", image: "https://images.pexels.com/photos/5439405/pexels-photo-5439405.jpeg" },
  { name: "Nahom Solomon", role: "Operations Supervisor", image: "https://images.pexels.com/photos/10376239/pexels-photo-10376239.jpeg" },
  { name: "Abebe Biru", role: "Maintenance Lead", image: "https://images.pexels.com/photos/6285069/pexels-photo-6285069.jpeg" },
];

function LeadershipCard({ leader }: { leader: typeof LEADERS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate max 15 degrees
    const tiltX = -((y - centerY) / centerY) * 15;
    const tiltY = ((x - centerX) / centerX) * 15;

    setTilt({ x: tiltX, y: tiltY });

    // Glare position percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full aspect-[2/3] cursor-pointer"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden shadow-2xl transition-all duration-200 ease-out bg-black"
        style={{
          transform: isHovered ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.05, 1.05, 1.05)` : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Background Image */}
        <img 
          src={leader.image} 
          alt={leader.name} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-40 grayscale-[20%]' : 'opacity-100 grayscale-0'}`} 
        />
        
        {/* Holographic Radial Glare Overlay */}
        {isHovered && (
          <div 
            className="absolute inset-0 z-20 pointer-events-none opacity-60 mix-blend-color-dodge transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(232, 119, 50, 0.5) 0%, rgba(10, 124, 63, 0.4) 30%, transparent 70%)`
            }}
          />
        )}
        
        {/* Holographic Linear Shine */}
        {isHovered && (
           <div 
             className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-overlay"
             style={{
               background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.7) ${glarePosition.x}%, transparent 80%)`
             }}
           />
        )}

        {/* Text Content (Popped out in Z space) */}
        <div 
          className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center pointer-events-none"
          style={{
            transform: 'translateZ(60px)', 
          }}
        >
          <div 
            className={`transition-all duration-500 transform ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
          >
            <h3 className="font-display text-2xl font-bold text-white mb-2">{leader.name}</h3>
            <p className="text-xs tracking-widest uppercase font-semibold text-[#E87732]">{leader.role}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export function LeadershipSection() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-16 pb-32">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="text-center mb-24">
          <h2 className="font-display text-sm tracking-[0.2em] uppercase font-semibold text-muted-foreground">
            Leadership
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8 xl:gap-12">
          {LEADERS.map((leader) => (
            <LeadershipCard key={leader.name} leader={leader} />
          ))}
        </div>
      </div>
    </section>
  );
}
