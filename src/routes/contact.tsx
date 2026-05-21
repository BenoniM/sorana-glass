import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";

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

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Contact</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold text-balance md:text-6xl">
            Let's talk about your project.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Share your specifications, drawings or questions. Our team typically responds within one
            business day.
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
    </>
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
