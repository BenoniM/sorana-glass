import { useRef, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Sorana Glass" },
      { name: "description", content: "Get in touch with Sorana Glass. Nifas Silk Lafto, Addis Ababa. +251 960 323 232." },
      { property: "og:title", content: "Contact Sorana Glass" },
      { property: "og:description", content: "Talk to our team about your glass project." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "bottom bottom",
        end: "+=100%",
        pin: contentRef.current,
        pinSpacing: true,
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div ref={contentRef} className="relative bg-background">
        <section className="relative overflow-hidden py-16 flex flex-col items-center justify-center text-center">
          {/* Greenish/orangeish glassy background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#0A7C3F]/50 rounded-full blur-[80px] -translate-y-1/3 -translate-x-2/3" />
            <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#E87732]/40 rounded-full blur-[80px] translate-y-1/3 translate-x-2/3" />
            <div className="absolute inset-0 bg-background/30 backdrop-blur-[30px]" />
          </div>

          <div className="relative z-10 h-full w-full max-w-6xl px-6 flex flex-col items-center">
            <h1 className="mb-8 mt-10 max-w-3xl capitalize font-display text-3xl font-semibold leading-tight">
              Let's talk about your project.
            </h1>

            <div className="relative p-2 md:p-3 bg-[#0A7C3F]/30 backdrop-blur-md border border-white/20 shadow-2xl mb-10 w-100 max-w-2xl mx-auto">
              <div className="p-1 rounded-sm">
                <img 
                  src="https://images.unsplash.com/photo-1516387938699-a93567ec168e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  alt="Contact Us" 
                  className="w-full aspect-[4/3] object-cover opacity-95" 
                />
              </div>
            </div>

            <p className="mt-3 max-w-5xl capitalize font-display text-lg font-light text-balance">
              Share your specifications, drawings or questions. Our team typically responds within one business day.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-5">
          <div className="space-y-6 md:col-span-2">
            {[
              { icon: MapPin, title: "Visit us", body: "Nifas Silk Lafto Sub-City, Wereda 12\nAddis Ababa, Ethiopia" },
              { icon: Phone, title: "Call us", body: "+251 960 323 232\n+251 955 323 232" },
              { icon: Mail, title: "Email", body: "info@soranaglass.com" },
              { icon: Clock, title: "Hours", body: "Mon – Sat: 8:30 — 18:00" },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <c.icon className="h-6 w-6 text-accent" />
                <h3 className="mt-3 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="rounded-2xl border border-border bg-card p-8 shadow-card md:col-span-3"
          >
            <h2 className="font-display text-2xl font-semibold">Request a quote</h2>
            <p className="mt-2 text-sm text-muted-foreground">Tell us about your project and we'll get back to you.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" required />
              <Field label="Company" name="company" />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" />
            </div>
            <div className="mt-4">
              <Field label="Project type" name="project" placeholder="Facade, partition, shower, auto glass…" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Message</label>
              <textarea
                name="message"
                rows={5}
                required
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              {sent ? "Thanks — we'll be in touch" : "Send enquiry"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}{required && <span className="text-accent"> *</span>}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
