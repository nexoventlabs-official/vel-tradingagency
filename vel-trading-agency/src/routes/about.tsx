import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Users, Award, MapPin } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Vel Trading Agency" },
      { name: "description", content: "A Madurai-based partnership firm trading in authentic Tamil Nadu herbs, seeds and roots." },
      { property: "og:title", content: "About Vel Trading Agency" },
      { property: "og:description", content: "Madurai-based partnership firm trading in authentic Tamil Nadu herbs." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium">
          <Leaf className="size-3.5 text-primary" /> About us
        </div>
        <h1 className="mt-4 text-display text-4xl sm:text-5xl font-semibold">Rooted in tradition, traded with trust.</h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-3xl">
          Vel Trading Agency is a Madurai-based partnership firm dealing in authentic Siddha and Ayurvedic raw materials — leaves, seeds, roots, dried flowers and spices — sourced directly from farms across Tamil Nadu.
        </p>
      </header>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <InfoCard icon={<Users className="size-5" />} title="Partnership firm" lines={["R. Seetharaman — Partner", "Ramadoss Madhusudhanan — Partner"]} />
        <InfoCard icon={<MapPin className="size-5" />} title="Head office" lines={["102/103, Velar Street", "Arapalayam, Madurai", "Tamil Nadu – 625016"]} />
        <InfoCard icon={<Award className="size-5" />} title="Registrations" lines={["GST: 33ABCFV1505G1ZM", "FSSAI: Licensed & Approved", "MSME: UDYAM-TN-12-0182473", "Business PAN: ABCFV1505G"]} />
        <InfoCard icon={<Leaf className="size-5" />} title="What we do" lines={["Wholesale & retail trade", "Pan-India dispatch", "Export-ready packaging"]} />
      </div>

      <section className="mt-16 grid md:grid-cols-3 gap-8">
        <Value
          n="01"
          t="Authenticity Above All"
          b="We never compromise on the botanical integrity of our products. Every batch is identity-verified before processing."
        />
        <Value
          n="02"
          t="Farmer-First Sourcing"
          b="Our success is tied to our growers. We ensure fair compensation, supporting the farming communities of Tamil Nadu."
        />
        <Value
          n="03"
          t="Logistical Precision"
          b="From our warehouse to your doorstep, we manage every step with precision—ensuring timely delivery across India."
        />
      </section>
    </div>
  );
}

function InfoCard({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-primary/10 text-primary grid place-items-center">{icon}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
        {lines.map((l) => <li key={l}>{l}</li>)}
      </ul>
    </div>
  );
}

function Value({ n, t, b }: { n: string; t: string; b: string }) {
  return (
    <div>
      <div className="text-display text-3xl text-accent font-semibold">{n}</div>
      <div className="mt-1 font-semibold">{t}</div>
      <p className="mt-1 text-sm text-muted-foreground">{b}</p>
    </div>
  );
}
