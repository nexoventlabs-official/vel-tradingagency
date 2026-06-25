import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Building2, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vel Trading Agency" },
      { name: "description", content: "Get in touch with Vel Trading Agency in Madurai for orders, enquiries and partnerships." },
      { property: "og:title", content: "Contact Vel Trading Agency" },
      { property: "og:description", content: "Reach Vel Trading Agency in Madurai by phone, email or WhatsApp." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-display text-4xl sm:text-5xl font-semibold">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">We're happy to answer questions about pricing, availability, and shipping — for both Indian and overseas buyers.</p>
      </header>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <ContactCard icon={<Phone className="size-5" />} title="Phone" body="+91 81246 75463" href="tel:+918124675463" />
        <ContactCard icon={<MessageCircle className="size-5" />} title="WhatsApp" body="Chat with our sales team" href="https://wa.me/918124675463" />
        <ContactCard icon={<Mail className="size-5" />} title="Email" body="veltradingagency@gmail.com" href="mailto:veltradingagency@gmail.com" />
        <ContactCard icon={<MapPin className="size-5" />} title="Address" body="102/103, Velar Street, Arapalayam, Madurai, Tamil Nadu – 625016" />
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <Building2 className="size-5 text-primary" />
            <div className="font-semibold">Company details</div>
          </div>
          <dl className="mt-4 text-sm space-y-2">
            <Row k="Company type" v="Partnership Firm" />
            <Row k="GST No" v="33ABCFV1505G1ZM" />
            <Row k="MSME No" v="UDYAM-TN-12-0182473" />
            <Row k="Business PAN" v="ABCFV1505G" />
            <Row k="Partner 1" v="R. Seetharaman" />
            <Row k="Partner 2" v="Ramadoss Madhusudhanan" />
          </dl>
        </div>

        <div className="rounded-2xl overflow-hidden border border-border min-h-[300px]">
          <iframe
            title="Vel Trading Agency — Madurai"
            src="https://www.google.com/maps?q=Velar+Street,+Arapalayam,+Madurai,+Tamil+Nadu+625016&output=embed"
            className="w-full h-full min-h-[300px]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon, title, body, href }: { icon: React.ReactNode; title: string; body: string; href?: string }) {
  const inner = (
    <div className="p-6 rounded-2xl bg-card border border-border h-full hover:border-primary transition-colors">
      <div className="size-10 rounded-full bg-primary/10 text-primary grid place-items-center">{icon}</div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{body}</div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{inner}</a> : inner;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/60 pb-1.5">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}
