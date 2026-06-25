import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Truck, ShieldCheck, Globe2, History, MapPin, Award, Scale } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vel Trading Agency — Authentic Herbs from Madurai" },
      { name: "description", content: "Wholesale supplier of senna, moringa, ashwagandha, vettiver, hibiscus and more — direct from Tamil Nadu." },
      { property: "og:title", content: "Vel Trading Agency" },
      { property: "og:description", content: "Wholesale supplier of authentic Tamil Nadu herbs, seeds, roots and dried flowers." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = PRODUCTS.slice(0, 8);
  return (
    <>
      <section className="bg-hero-gradient overflow-hidden text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-primary-foreground">
              <Leaf className="size-3.5 text-primary-foreground" /> Sourced from Tamil Nadu farms
            </div>
            <h1 className="mt-5 text-display text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
              Pure Herbs.<br />
              <span className="text-secondary italic">Global Standards.</span>
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-lg leading-relaxed font-light">
              Vel Trading Agency: Built on honest trade and rooted in tradition. We deliver high-grade Siddha & Ayurvedic raw materials from Tamil Nadu farms to the world.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-bold hover:bg-secondary transition-all shadow-xl shadow-black/20">
                Browse Collection <ArrowRight className="size-4" />
              </Link>
              <Link to="/enquiry" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 bg-white/10 backdrop-blur font-semibold hover:bg-white/20 transition-colors">
                Send Bulk Enquiry
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-8 border-t border-white/10 pt-10">
              <Stat n="18+" l="Premium Grades" />
              <Stat n="FSSAI" l="Approved Trade" />
              <Stat n="MSME" l="Certified Agency" />
              <Stat n="PAN" l="India Shipping" />
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="grid grid-cols-2 gap-4 w-full">
              {PRODUCTS.slice(0, 4).map((p, i) => (
                <div key={p.id} className={`group relative rounded-3xl overflow-hidden shadow-2xl ${i % 2 ? "translate-y-12" : ""}`}>
                  <img src={p.image} alt={p.name} className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-medium">{p.name}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Decorative element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] aspect-square bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Feature Section with more depth */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 border-y border-border/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-display text-3xl sm:text-4xl font-semibold">The Vel Commitment</h2>
          <p className="mt-4 text-muted-foreground">We don't just trade; we curate. Every seed, leaf, and root passes through a rigorous quality check in our Madurai facility.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Award className="size-6" />}
            title="Graded for Purity"
            body="Our herbs are sorted by color, aroma, and moisture content to meet pharmaceutical and export standards."
          />
          <FeatureCard
            icon={<Truck className="size-6" />}
            title="Reliable Logistics"
            body="From consolidated smaller shipments to full container loads, we ensure timely delivery across India and beyond."
          />
          <FeatureCard
            icon={<Scale className="size-6" />}
            title="Transparent Pricing"
            body="We maintain honest margins, ensuring fair pay to farmers while offering competitive rates to our trade partners."
          />
        </div>
      </section>

      {/* Heritage Section - The "Match ideas" part */}
      <section className="bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-display text-4xl font-semibold mb-6">Standard of Quality</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                At Vel Trading Agency, we don't just move products — we manage purity. Our multi-stage grading process ensures that every shipment meets the specific phytochemical requirements of our global buyers.
              </p>
              <div className="space-y-8">
                <QualityStep
                  number="01"
                  title="Botanical Verification"
                  body="Every batch is cross-checked for species authenticity and regional origin to ensure therapeutic efficacy."
                />
                <QualityStep
                  number="02"
                  title="Manual Sorting & Cleaning"
                  body="Our experienced team hand-sorts the harvest to remove foreign matter and selects only prime-grade materials."
                />
                <QualityStep
                  number="03"
                  title="Standardized Packing"
                  body="Moisture-controlled HDPE bags or vacuum-sealed packs are used to preserve freshness during long-haul transit."
                />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1515446134809-993c501ca304?q=80&w=2000"
                  alt="Herbal quality control"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-12">
                  <div className="text-white">
                    <div className="text-5xl font-display font-bold mb-2">99%</div>
                    <div className="text-sm uppercase tracking-widest opacity-90 font-semibold">Purity Guarantee</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-display text-3xl sm:text-4xl font-semibold">Trade Catalog</h2>
            <p className="text-muted-foreground mt-2">Discover our current inventory of premium raw materials.</p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary border border-border text-sm font-semibold hover:bg-background transition-colors">
            View All Products <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Final CTA */}
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-display text-3xl font-semibold">{n}</div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1 font-bold">{l}</div>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-colors group">
      <div className="size-14 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{body}</p>
    </div>
  );
}

function QualityStep({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex gap-6 group">
      <div className="text-display text-4xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
        {number}
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
}
