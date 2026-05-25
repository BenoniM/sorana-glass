import React from "react";
import { Award, ShieldCheck, HeartHandshake, Zap, Users } from "lucide-react";

// Leafy branch SVG component
export const LeafyBranchSVG = () => (
  <svg 
    className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" 
    viewBox="0 0 1200 800" 
    preserveAspectRatio="xMidYMid slice" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="leaf-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0A7C3F" />
        <stop offset="100%" stopColor="#E87732" />
      </linearGradient>
      <filter id="shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="12" />
      </filter>
    </defs>

    {/* Abstract leaf shadows using SVG paths */}
    <g filter="url(#shadow-blur)" fill="url(#leaf-gradient)">
       {/* Top left branch */}
       <path d="M -50,-50 C 150,100 250,50 350,150 C 450,250 300,300 200,400 C 100,500 -50,300 -50,-50 Z" />
       {/* Top right leaves */}
       <path d="M 1250,-100 C 1100,100 1000,50 900,200 C 800,350 950,400 1000,550 C 1100,700 1300,500 1250,-100 Z" />
       {/* Bottom right branch */}
       <path d="M 1300,900 C 1100,750 1000,800 850,700 C 700,600 800,500 950,400 C 1100,300 1300,500 1300,900 Z" />
       {/* Bottom left scattered leaves */}
       <path d="M -100,900 C 100,700 200,850 350,750 C 500,650 400,500 250,450 C 100,400 -50,600 -100,900 Z" />
       <path d="M 500,0 C 600,100 700,-50 800,50 C 900,150 850,250 750,200 C 650,150 550,200 500,0 Z" />
    </g>
  </svg>
);

const VALUES = [
  {
    id: "01",
    title: "Quality",
    icon: Award,
    image: "https://images.pexels.com/photos/9729590/pexels-photo-9729590.jpeg",
    layout: "text-img", // Icon -> Text -> Image -> Num
    colorA: "text-[#E87732]", // Orangeish
    colorN: "text-[#0A7C3F]",
  },
  {
    id: "02",
    title: "Reliability",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    layout: "img-text", // Icon -> Image -> Text -> Num
    colorA: "text-[#0A7C3F]", // Greenish
    colorN: "text-[#E87732]",
  },
  {
    id: "03",
    title: "Responsibility",
    icon: HeartHandshake,
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
    layout: "text-num-img", // Icon -> Text -> Num -> Image
    colorA: "text-[#E87732]", // Orangeish
    colorN: "text-[#0A7C3F]",
  },
  {
    id: "04",
    title: "Efficiency",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    layout: "img-icon-text", // Image -> Icon -> Text -> Num
    colorA: "text-[#0A7C3F]", // Greenish
    colorN: "text-[#E87732]",
  },
  {
    id: "05",
    title: "Customer Focus",
    icon: Users,
    image: "https://images.pexels.com/photos/7689767/pexels-photo-7689767.jpeg",
    layout: "text-img", // Icon -> Text -> Image -> Num
    colorA: "text-[#0A7C3F]", // Greenish
    colorN: "text-[#E87732]",
  },
];

export function CoreValuesSection() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-32 pb-16">
      
      <div className="relative z-10 w-full max-w-4xl px-6">
        <h2 className="text-center font-display text-lg tracking-[0.2em] uppercase font-semibold text-muted-foreground mb-24">
          Our Core Values
        </h2>

        <div className="flex flex-col items-center justify-center gap-12 md:gap-16">
          {VALUES.map((val) => {
            const Icon = val.icon;

            return (
              <div 
                key={val.id} 
                className="group flex flex-wrap items-center justify-center gap-6 cursor-pointer"
              >
                {/* LAYOUT 1: Icon -> Text -> Image -> Num */}
                {val.layout === "text-img" && (
                  <>
                    <Icon className={`w-8 h-8 ${val.colorA} transition-transform group-hover:scale-110`} strokeWidth={2} />
                    <h3 className="font-display text-5xl md:text-6xl font-medium tracking-tight text-foreground">
                      {val.title}
                    </h3>
                    <div className="w-16 h-20 md:w-20 md:h-24 overflow-hidden rounded-md transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:w-32 md:group-hover:w-40 shadow-xl">
                      <img src={val.image} alt={val.title} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                    </div>
                    <span className={`font-display text-4xl md:text-5xl font-light ${val.colorN} opacity-80`}>
                      ({val.id})
                    </span>
                  </>
                )}

                {/* LAYOUT 2: Icon -> Image -> Text -> Num */}
                {val.layout === "img-text" && (
                  <>
                    <Icon className={`w-8 h-8 ${val.colorA} transition-transform group-hover:scale-110`} strokeWidth={2} />
                    <div className="w-16 h-20 md:w-20 md:h-24 overflow-hidden rounded-md transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:w-32 md:group-hover:w-40 shadow-xl">
                      <img src={val.image} alt={val.title} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                    </div>
                    <h3 className="font-display text-5xl md:text-6xl font-medium tracking-tight text-foreground">
                      {val.title}
                    </h3>
                    <span className={`font-display text-4xl md:text-5xl font-light ${val.colorN} opacity-80`}>
                      ({val.id})
                    </span>
                  </>
                )}

                {/* LAYOUT 3: Icon -> Text -> Num -> Image */}
                {val.layout === "text-num-img" && (
                  <>
                    <Icon className={`w-8 h-8 ${val.colorA} transition-transform group-hover:scale-110`} strokeWidth={2} />
                    <h3 className="font-display text-5xl md:text-6xl font-medium tracking-tight text-foreground">
                      {val.title}
                    </h3>
                    <span className={`font-display text-4xl md:text-5xl font-light ${val.colorN} opacity-80`}>
                      ({val.id})
                    </span>
                    <div className="w-16 h-20 md:w-20 md:h-24 overflow-hidden rounded-md transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:w-32 md:group-hover:w-40 shadow-xl">
                      <img src={val.image} alt={val.title} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                    </div>
                  </>
                )}

                {/* LAYOUT 4: Image -> Icon -> Text -> Num */}
                {val.layout === "img-icon-text" && (
                  <>
                    <div className="w-16 h-20 md:w-20 md:h-24 overflow-hidden rounded-md transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:w-32 md:group-hover:w-40 shadow-xl">
                      <img src={val.image} alt={val.title} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                    </div>
                    <Icon className={`w-8 h-8 ${val.colorA} transition-transform group-hover:scale-110`} strokeWidth={2} />
                    <h3 className="font-display text-5xl md:text-6xl font-medium tracking-tight text-foreground">
                      {val.title}
                    </h3>
                    <span className={`font-display text-4xl md:text-5xl font-light ${val.colorN} opacity-80`}>
                      ({val.id})
                    </span>
                  </>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
