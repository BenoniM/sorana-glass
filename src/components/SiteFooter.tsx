import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import logoImg from "@/assets/logo/Sorana-Logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface text-surface-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Sorana Glass Logo" className="h-10 w-auto rounded-md object-contain" />
            <div className="font-display text-lg font-semibold">Sorana Glass</div>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            One of Ethiopia's most advanced glass processing factories — over 20 years of expertise
            in tempered, laminated, architectural and automotive glass.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/products" className="hover:text-primary">Products</Link></li>
            <li><Link to="/projects" className="hover:text-primary">Projects</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-accent" /> Nifas Silk Lafto, Wereda 12<br />Addis Ababa, Ethiopia</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +251 960 323 232</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +251 955 323 232</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> info@soranaglass.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Sorana Glass PLC. All rights reserved.</p>
          <p>Established 2017 · Built on 20+ years of glass craftsmanship.</p>
        </div>
      </div>
    </footer>
  );
}
