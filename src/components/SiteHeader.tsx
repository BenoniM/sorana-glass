import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/logo/Sorana-Logo.png";
import gsap from "gsap";

function AnimatedLink({ to, onClick, children, className = "" }: { to: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <Link to={to} onClick={onClick} className={`group relative overflow-hidden inline-flex items-center w-fit ${className}`}>
      <span className="transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-[110%]">
        {children}
      </span>
      <span className="absolute left-0 top-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-[110%] group-hover:translate-y-0 text-white/70">
        {children}
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  
  const router = useRouterState();
  const pathname = router.location.pathname;
  
  // Approximate active name
  let activeName = "HOME";
  if (pathname.includes("about")) activeName = "ABOUT";
  else if (pathname.includes("products")) activeName = "COLLECTION";
  else if (pathname.includes("projects")) activeName = "PROJECTS";
  else if (pathname.includes("services")) activeName = "APPROACH";
  else if (pathname.includes("contact")) activeName = "CONTACT";
  else if (pathname.includes("gallery")) activeName = "GALLERY";

  useEffect(() => {
    if (!capsuleRef.current || !menuRef.current || !containerRef.current) return;
    
    // Initial states for the dropdown menu
    gsap.set(menuRef.current, { 
      clipPath: "inset(0% 0% 100% 0%)",
      y: -20, // slightly behind the header
      display: "none"
    });

    const ctx = gsap.context(() => {
      // Build a reusable, paused timeline
      const tl = gsap.timeline({ 
        paused: true,
        defaults: { ease: "power3.inOut", duration: 0.5 }
      });
      
      tl.to(".closed-content", { opacity: 0, duration: 0.2 })
        .to(capsuleRef.current, { width: 48, duration: 0.4 }, "-=0.1")
        .to(".open-content", { opacity: 1, autoAlpha: 1, duration: 0.2 }, "-=0.2")
        .set(menuRef.current, { display: "block" }, "-=0.4")
        .to(menuRef.current, { 
          clipPath: "inset(0% 0% 0% 0%)", 
          y: 0, 
          duration: 0.5 
        }, "-=0.3");

      tlRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Play or reverse the timeline based on state without re-creating it
    if (tlRef.current) {
      if (isOpen) {
        tlRef.current.play();
      } else {
        tlRef.current.reverse();
      }
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header ref={containerRef} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center w-[320px]">
      
      {/* DROPDOWN MENU (Behind capsule) */}
      <div 
        ref={menuRef}
        className="absolute top-0 left-0 w-full pt-[64px] -z-10"
      >
        <div className="w-full bg-gradient-to-br from-[#0A7C3F]/95 to-[#E87732]/95 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-none">
           <div className="p-8 flex flex-col gap-5 text-white justify-between">
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] mb-4 uppercase opacity-60">Menu</div>
                <nav className="flex flex-col gap-3 text-[28px] leading-tight font-medium tracking-tight">
                  <AnimatedLink to="/" onClick={() => setIsOpen(false)}>Home</AnimatedLink>
                  <AnimatedLink to="/about" onClick={() => setIsOpen(false)}>About</AnimatedLink>
                  <AnimatedLink to="/products" onClick={() => setIsOpen(false)}>Collection</AnimatedLink>
                  <AnimatedLink to="/projects" onClick={() => setIsOpen(false)}>Projects</AnimatedLink>
                  <AnimatedLink to="/services" onClick={() => setIsOpen(false)}>Approach</AnimatedLink>
                  <AnimatedLink to="/contact" onClick={() => setIsOpen(false)}>Contact</AnimatedLink>
                </nav>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mt-6 pt-4 border-t border-white/20">
                <div className="flex flex-col gap-2">
                  <AnimatedLink to="/" onClick={() => setIsOpen(false)} className="text-xs font-normal">News</AnimatedLink>
                  <AnimatedLink to="/" onClick={() => setIsOpen(false)} className="text-xs font-normal">Showroom</AnimatedLink>
                </div>
                <div className="flex flex-col gap-2 text-right">
                  <a href="tel:02081567290" className="hover:opacity-70 transition-opacity">020 8156 7290</a>
                  <a href="mailto:sales@fluid.glass" className="hover:opacity-70 transition-opacity">sales@fluid.glass</a>
                </div>
              </div>

              <a 
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full py-3 bg-[#0A100D]/80 text-white flex items-center justify-center gap-2 hover:bg-black transition-colors rounded-none text-[10px] tracking-[0.2em] uppercase font-bold"
              >
                <span className="text-sm leading-none mb-[2px]">↳</span> GET A QUOTE
              </a>
           </div>
        </div>
      </div>

      {/* CAPSULE */}
      <div 
        ref={capsuleRef}
        onClick={toggleMenu}
        className="h-12 bg-gradient-to-r from-[#0A7C3F]/60 to-[#E87732]/60 backdrop-blur-2xl border border-white/20 relative mx-auto overflow-hidden shadow-2xl cursor-pointer rounded-none z-20"
        style={{ width: "100%" }}
      >
        {/* Closed State Content */}
        <div className="closed-content absolute inset-0 flex items-center justify-between px-4 w-full max-w-[320px]">
          <div className="flex items-center shrink-0">
            <img src={logoImg} alt="Sorana Glass Logo" className="h-6 w-auto object-contain brightness-0 invert" />
          </div>
          <div className="font-semibold tracking-[0.2em] text-[11px] text-white uppercase whitespace-nowrap overflow-hidden text-center mx-2">
            {activeName}
          </div>
          <div className="text-white hover:opacity-80 shrink-0 flex items-center">
            <Menu className="w-5 h-5" />
          </div>
        </div>

        {/* Open State Content (Close Button) */}
        <div className="open-content absolute inset-0 flex items-center justify-center opacity-0 invisible">
          <div className="text-white hover:opacity-80 flex items-center justify-center w-full h-full">
            <X className="w-5 h-5" />
          </div>
        </div>
      </div>

    </header>
  );
}
