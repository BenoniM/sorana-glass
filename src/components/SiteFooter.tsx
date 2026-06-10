import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative bg-[#111] overflow-hidden pt-24 pb-8">
      {/* Background image & scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/13772063/pexels-photo-13772063.jpeg"
          alt="Glass architecture"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* SORANA title */}
        <div className="flex justify-center mb-16 w-full cursor-default select-none">
          {["S", "O", "R", "A", "N", "A"].map((letter, i) => (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700, 
              fontSize: "clamp(4rem, 15vw, 15rem)",
              lineHeight: 0.8,
              background: "linear-gradient(130deg, rgba(10,124,63,0.85) 0%, rgba(232,119,50,0.85) 100%)",
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent", 
              backgroundClip: "text",
              color: "transparent",
            }}>{letter}</span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-sm font-sans text-white/60 pt-8 border-t border-white/10 gap-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <span>©{new Date().getFullYear()} Sorana Glass</span>
            <div className="flex items-center gap-4">
              {["Instagram", "LinkedIn", "YouTube"].map(s => (
                <a key={s} href="#" className="hover:text-white transition-colors">{s}</a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-white transition-colors">Privacy policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms & conditions</Link>
            <span className="hidden lg:inline text-white/40">Crafted with precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}