import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Lock, Eye, Database, Share2, ShieldCheck, UserCheck, Smartphone } from 'lucide-react';

export const Route = createFileRoute('/privacy-policy')({
    component: PrivacyPolicy,
});

function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-secondary/30 py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-8 hover:opacity-80 transition-all group">
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Back
                </Link>

                <article className="bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-border bg-secondary/50">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Lock className="size-5 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold">Privacy Policy</h1>
                        </div>
                        <p className="text-xs text-muted-foreground ml-14">Last updated: January 2026</p>
                    </div>

                    <div className="p-8 sm:p-12 space-y-12">
                        <section className="space-y-4">
                            <p className="text-base text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-6">
                                At Vel Trading Agency, we are committed to protecting your corporate and personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our herbal trade portal.
                            </p>
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
                                <Database className="size-5 text-primary" /> Information We Collect
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-4 p-6 rounded-2xl bg-secondary/30 border border-border">
                                    <h3 className="flex items-center gap-2 font-bold text-sm text-primary uppercase tracking-wider">
                                        <UserCheck className="size-4" /> Personal / Business
                                    </h3>
                                    <ul className="text-xs space-y-2 text-muted-foreground">
                                        <li>• Account Name & Representative Info</li>
                                        <li>• Corporate Email & Phone Number</li>
                                        <li>• GST / MSME / PAN Identification</li>
                                        <li>• Shipping Address & Port Preferences</li>
                                        <li>• Payment Details (secured via gateway)</li>
                                    </ul>
                                </div>
                                <div className="space-y-4 p-6 rounded-2xl bg-secondary/30 border border-border">
                                    <h3 className="flex items-center gap-2 font-bold text-sm text-primary uppercase tracking-wider">
                                        <Smartphone className="size-4" /> Automatically Collected
                                    </h3>
                                    <ul className="text-xs space-y-2 text-muted-foreground">
                                        <li>• IP Address & General Geographic Location</li>
                                        <li>• Device Type & Browser Identifiers</li>
                                        <li>• Website Usage Patterns & Cart History</li>
                                        <li>• Professional Interest in Specific Botanicals</li>
                                        <li>• Cookies & Similar Tracking Technologies</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <Eye className="size-5 text-primary" /> How We Use Your Information
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                Your data is processed only for legitimate commercial and operational reasons:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { label: "Order Fulfillment", desc: "Processing & shipping botanicals" },
                                    { label: "Compliance", desc: "Export & trade regulations" },
                                    { label: "Communication", desc: "Order tracking & updates" },
                                    { label: "Security", desc: "Fraud prevention & safety" },
                                ].map((item, i) => (
                                    <div key={i} className="text-center p-4 rounded-xl bg-secondary/20 border border-border/50">
                                        <div className="text-[10px] font-bold text-primary uppercase mb-1">{item.label}</div>
                                        <div className="text-[9px] text-muted-foreground">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-secondary/20 -mx-8 sm:-mx-12 px-8 sm:px-12 py-10 border-y border-border">
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
                                <Share2 className="size-5 text-primary" /> How We Share Your Information
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                We do <strong>not sell, rent, or trade</strong> your personal information to third parties. We may share your data only with:
                            </p>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> <strong>Service Providers:</strong> Trusted logistics (DHL, Blue Dart) and payment processors who are contractually bound to protect your data.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> <strong>Legal Requirements:</strong> When required by Indian law, court order, or government trade regulation.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> <strong>With Your Consent:</strong> When you explicitly authorize sharing for specific purposes.</li>
                            </ul>
                            <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                                <ShieldCheck className="size-6 text-primary shrink-0" />
                                <p className="text-xs text-muted-foreground italic">
                                    All data transmission is protected with Secure Socket Layer (SSL) encryption. Payment processing is PCI-DSS compliant.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">Cookies and Tracking Technologies</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                We use cookies and similar technologies to enhance your browsing experience:
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-secondary/40 border border-border text-xs text-muted-foreground"><strong>Essential Cookies:</strong> Required for cart and checkout functionality.</div>
                                <div className="p-4 rounded-xl bg-secondary/40 border border-border text-xs text-muted-foreground"><strong>Analytics Cookies:</strong> Help us understand how visitors navigate our portal.</div>
                                <div className="p-4 rounded-xl bg-secondary/40 border border-border text-xs text-muted-foreground"><strong>Preference Cookies:</strong> Remember your language and currency settings.</div>
                                <div className="p-4 rounded-xl bg-secondary/40 border border-border text-xs text-muted-foreground"><strong>Marketing Cookies:</strong> Used to deliver relevant product recommendations.</div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">Data Retention</h2>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> <strong>Account Information:</strong> Until you request deletion or close your account.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> <strong>Order Records:</strong> 7 years to comply with Indian tax and international trade regulations.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> <strong>Analytics Data:</strong> Aggregated and anonymized after 24 months.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">Your Rights and Choices</h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {["Access your data", "Correct inaccurate info", "Request deletion", "Opt-out of marketing", "Data portability", "Object to processing"].map((right, i) => (
                                    <div key={i} className="p-3 text-xs text-muted-foreground bg-secondary/30 border border-border rounded-xl text-center font-medium">
                                        {right}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">Children's Privacy</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Our website and services are intended for business-to-business (B2B) purposes and are not directed at children under 18 years of age. We do not knowingly collect personal information from minors.
                            </p>
                        </section>

                        <div className="pt-10 border-t border-border flex flex-col sm:flex-row justify-between items-start gap-8">
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2">Privacy Enquiries</h3>
                                <div className="text-sm space-y-1">
                                    <p className="text-primary font-semibold">veltradingagency@gmail.com</p>
                                    <p className="text-muted-foreground">+91 81246 75463</p>
                                    <p className="text-muted-foreground text-xs">102/103, Velar Street, Arapalayam, Madurai</p>
                                </div>
                            </div>
                            <div className="text-[10px] text-muted-foreground text-right uppercase tracking-[0.2em] font-bold">
                                Business Hours: Mon–Sat, 9 AM – 7 PM
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
