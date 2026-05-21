import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/hero-glass.jpg";
import factory from "@/assets/factory.jpg";
import shower from "@/assets/shower.jpg";
import partition from "@/assets/partition.jpg";
import auto from "@/assets/auto-glass.jpg";
import skylight from "@/assets/skylight.jpg";
import frosted from "@/assets/frosted.jpg";
import railing from "@/assets/railing.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Sorana Glass" },
      { name: "description", content: "A selection of Sorana glass projects: facades, partitions, shower enclosures, skylights, balustrades and automotive glass." },
      { property: "og:title", content: "Sorana Glass — Project Gallery" },
      { property: "og:description", content: "A selection of completed Sorana glass projects." },
      { property: "og:image", content: hero },
    ],
  }),
  component: GalleryPage,
});

const items = [
  { src: hero, title: "High-rise façade", tag: "Architectural" },
  { src: factory, title: "Tempering line", tag: "Workshop" },
  { src: partition, title: "Office partitions", tag: "Interior" },
  { src: shower, title: "Frameless shower", tag: "Interior" },
  { src: skylight, title: "Atrium skylight", tag: "Architectural" },
  { src: railing, title: "Terrace balustrade", tag: "Architectural" },
  { src: frosted, title: "Decorative frosted", tag: "Decorative" },
  { src: auto, title: "Automotive install", tag: "Auto" },
];

function GalleryPage() {
  return (
    <>
      <section className="pb-16 pt-40">
        <div className="container-x max-w-4xl">
          <span className="eyebrow">Gallery</span>
          <h1 className="display mt-6 text-foreground">Selected work.</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            A glimpse of projects we've fabricated and installed — from city façades to private interiors.
          </p>
        </div>
      </section>

      <section className="pb-28">
        <div className="container-x">
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
            {items.map((it, i) => (
              <figure
                key={i}
                className="group relative overflow-hidden rounded-2xl shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-elegant)]"
              >
                <img
                  src={it.src}
                  alt={it.title}
                  loading="lazy"
                  className="w-full transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-primary/90 via-primary/40 to-transparent p-5 text-primary-foreground">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-accent-glow">{it.tag}</div>
                    <div className="mt-1 font-display text-lg">{it.title}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
