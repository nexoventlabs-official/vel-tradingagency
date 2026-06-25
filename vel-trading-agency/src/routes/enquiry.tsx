import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PRODUCTS } from "@/lib/products";
import { Send, CheckCircle2, Building2, ClipboardList, Package, ArrowLeft } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/enquiry")({
  validateSearch: (search) => z.object({
    product: z.string().optional(),
  }).parse(search),
  head: () => ({
    meta: [
      { title: "Bulk Enquiry & RFQ — Vel Trading Agency" },
      { name: "description", content: "Submit a Request for Quotation (RFQ) for wholesale or export orders." },
    ],
  }),
  component: Enquiry,
});

function Enquiry() {
  const { product: preselectedProduct } = Route.useSearch();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    product: preselectedProduct || "",
    qty: "",
    message: "",
    destination: ""
  });

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text =
      `*BULK ENQUIRY / RFQ*\n\n` +
      `*Business Details:*\n` +
      `Name: ${form.name}\n` +
      `Company: ${form.company}\n` +
      `Location: ${form.destination}\n\n` +
      `*Requirement:*\n` +
      `Product: ${form.product}\n` +
      `Quantity: ${form.qty}\n\n` +
      `*Notes:*\n${form.message}`;

    window.open(`https://wa.me/918124675463?text=${encodeURIComponent(text)}`, "_blank");
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-secondary/30 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-8 hover:opacity-80">
          <ArrowLeft className="size-4" /> Return to Catalogue
        </Link>

        <header className="mb-12">
          <h1 className="text-display text-4xl sm:text-5xl font-bold text-foreground">Global Trading Portal</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">Submit a Request for Quotation (RFQ). Our export specialists will provide a custom commercial offer within 24 hours.</p>
        </header>

        {sent ? (
          <div className="bg-card border-2 border-primary/20 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <CheckCircle2 className="size-64" />
            </div>
            <div className="relative z-10">
              <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="size-10 text-primary" />
              </div>
              <h2 className="text-display text-3xl font-bold mb-4">RFQ Successfully Generated</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">Your enquiry for <span className="text-foreground font-bold">{form.product}</span> has been processed. Our team has been notified via our secure trade channel.</p>

              <div className="bg-secondary/50 rounded-2xl p-6 text-left mb-8 max-w-sm mx-auto border border-border">
                <div className="text-xs font-bold text-muted-foreground uppercase mb-3">Enquiry Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Product:</span> <span className="font-semibold">{form.product}</span></div>
                  <div className="flex justify-between"><span>Quantity:</span> <span className="font-semibold">{form.qty || "Not specified"}</span></div>
                  <div className="flex justify-between"><span>Destination:</span> <span className="font-semibold">{form.destination || "Not specified"}</span></div>
                </div>
              </div>

              <button
                onClick={() => { setSent(false); setForm({ name: "", company: "", email: "", phone: "", product: "", qty: "", message: "", destination: "" }); }}
                className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 shadow-xl shadow-primary/20 transition-all"
              >
                Create New Requirement
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden">
            <div className="p-8 border-b border-border bg-secondary/50 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardList className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Request for Quotation Form</h3>
                <p className="text-xs text-muted-foreground">Fields marked * are mandatory for trade verification.</p>
              </div>
            </div>

            <div className="p-8 sm:p-12 space-y-10">
              {/* Business Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 text-primary font-bold text-sm uppercase tracking-widest">
                  <Building2 className="size-4" /> 01. Business Information
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label="Contact Person *" required value={form.name} onChange={onChange("name")} placeholder="Your full name" />
                  <Field label="Company / Entity Name" value={form.company} onChange={onChange("company")} placeholder="Business name" />
                  <Field label="Corporate Email *" type="email" required value={form.email} onChange={onChange("email")} placeholder="email@company.com" />
                  <Field label="Phone / WhatsApp *" type="tel" required value={form.phone} onChange={onChange("phone")} placeholder="+91 ..." />
                  <div className="sm:col-span-2">
                    <Field label="Delivery Destination / Port" value={form.destination} onChange={onChange("destination")} placeholder="City, Country or Nearest Port" />
                  </div>
                </div>
              </section>

              {/* Requirement Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 text-primary font-bold text-sm uppercase tracking-widest">
                  <Package className="size-4" /> 02. Requirement Details
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <label className="block text-sm">
                    <span className="font-bold text-foreground/80 mb-2 block">Product Selection *</span>
                    <select required value={form.product} onChange={onChange("product")} className="w-full h-14 rounded-2xl border-2 border-border bg-background px-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all">
                      <option value="">Choose a product catalogue item</option>
                      {PRODUCTS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                      <option value="Custom / Multiple Blends">Custom / Multiple Blends</option>
                    </select>
                  </label>
                  <Field label="Target Quantity (Kg/Tons) *" required value={form.qty} onChange={onChange("qty")} placeholder="e.g., 500 Kg or 2 Metric Tons" />

                  <div className="sm:col-span-2">
                    <label className="block text-sm">
                      <span className="font-bold text-foreground/80 mb-2 block">Special Instructions / Grade Requirements</span>
                      <textarea
                        value={form.message}
                        onChange={onChange("message")}
                        rows={4}
                        placeholder="Specify moisture levels, packaging types (PP/Jute), or specific botanical grades."
                        className="w-full rounded-2xl border-2 border-border bg-background px-4 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                      />
                    </label>
                  </div>
                </div>
              </section>

              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-xs text-muted-foreground max-w-sm">By submitting this RFQ, you agree to our trade terms and export compliance standards.</p>
                <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 shadow-2xl shadow-primary/20 transition-all">
                  Generate Quotation Request <Send className="size-5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block text-sm">
      <span className="font-bold text-foreground/80 mb-2 block">{label}</span>
      <input {...rest} className="w-full h-14 rounded-2xl border-2 border-border bg-background px-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all" />
    </label>
  );
}
