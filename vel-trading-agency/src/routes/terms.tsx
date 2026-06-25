import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Scale, ShieldAlert, Globe, Gavel, FileText, AlertTriangle, BookOpen, Handshake, Ban, Mail } from 'lucide-react';

export const Route = createFileRoute('/terms')({
    component: TermsAndConditions,
});

function TermsAndConditions() {
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
                                <Scale className="size-5 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold">Terms & Conditions</h1>
                        </div>
                        <p className="text-xs text-muted-foreground ml-14">Last updated: January 2026</p>
                    </div>

                    <div className="p-8 sm:p-12 space-y-12">
                        <p className="text-base text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-6">
                            Welcome to Vel Trading Agency. By accessing and using our website or purchasing our botanical products, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
                        </p>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <BookOpen className="size-5 text-primary" /> 1. Acceptance of Terms
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                By accessing our website, browsing our products, or placing an order, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy, Shipping Policy, and Refund Policy. If you do not agree with any part of these terms, please do not use our website or services.
                            </p>
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <Globe className="size-5 text-primary" /> 2. Use of Website
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                You agree to use our website only for lawful purposes and in accordance with these terms:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> You must be at least 18 years old to make purchases on our website.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> You are responsible for maintaining the confidentiality of your account credentials.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> You must provide accurate, current, and complete information when creating an account or placing orders.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> You may not use our website for any fraudulent, illegal, or unauthorized purpose.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> You may not use automated systems (bots, scrapers) to access our website without permission.</li>
                            </ul>
                        </section>

                        <section className="bg-secondary/20 -mx-8 sm:-mx-12 px-8 sm:px-12 py-10 border-y border-border">
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <FileText className="size-5 text-primary" /> 3. Product Information & Availability
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                We strive to provide accurate product descriptions, images, and specifications for all our herbs, seeds, roots, and florals. However:
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-card border border-border text-xs text-muted-foreground">
                                    Product colors and textures may vary as they are natural organic botanicals — minor visual variation is inherent.
                                </div>
                                <div className="p-4 rounded-xl bg-card border border-border text-xs text-muted-foreground">
                                    Weights and dimensions are approximate and may have minor variations between batches.
                                </div>
                                <div className="p-4 rounded-xl bg-card border border-border text-xs text-muted-foreground">
                                    We reserve the right to discontinue products or change specifications without prior notice.
                                </div>
                                <div className="p-4 rounded-xl bg-card border border-border text-xs text-muted-foreground">
                                    Product availability is subject to seasonal harvest changes and stock levels.
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-5">4. Pricing and Payments</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                All prices displayed on our website are in <strong>US Dollars (USD)</strong> as our default trade currency:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Prices are subject to change without prior notice based on market conditions.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> The price applicable at the time of order placement will be honored.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> We reserve the right to correct pricing errors, even after an order has been placed.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Bulk order pricing via RFQ may differ from listed website prices.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Payment must be received in full before order dispatch (Debit, Credit, or UPI).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <Handshake className="size-5 text-primary" /> 5. Orders and Order Acceptance
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                When you place an order, you are making an offer to purchase products subject to these terms:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Order confirmation emails do not constitute acceptance of your order.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> We reserve the right to accept or decline any order at our discretion.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> We may limit order quantities per customer or per order.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Acceptance occurs when we dispatch your order and send shipping confirmation.</li>
                            </ul>
                        </section>

                        <section className="p-6 rounded-3xl bg-primary/5 border border-primary/20">
                            <h2 className="text-xl font-bold mb-4">6. Bulk & Export Orders</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                Special terms apply to bulk trade and international export orders placed via our RFQ portal:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Bulk enquiries require advance payment and written specification approval.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Minimum order quantities may apply for certain botanical categories.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Natural color and aroma variations are inherent and not grounds for rejection.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> All export shipments comply with Indian phytosanitary and customs regulations.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-5">7. Shipping and Delivery</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Please refer to our <Link to="/shipping-policy" className="text-primary font-semibold underline hover:opacity-80">Shipping Policy</Link> for detailed information. Key points: Delivery timelines are estimates and not guaranteed. We are not liable for delays caused by courier partners, weather, customs clearance, or force majeure events. Risk of loss transfers to you upon delivery to the courier.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-5">8. Returns, Refunds, and Cancellations</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Please refer to our <Link to="/refund-policy" className="text-primary font-semibold underline hover:opacity-80">Cancellation & Refund Policy</Link> for complete details. We reserve the right to refuse returns that do not meet our policy requirements, charge restocking fees for certain botanical returns, and process refunds only after quality inspection of returned items.
                            </p>
                        </section>

                        <section className="bg-secondary/20 -mx-8 sm:-mx-12 px-8 sm:px-12 py-10 border-y border-border">
                            <h2 className="text-xl font-bold mb-5">9. Intellectual Property Rights</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                All content on our website is protected by intellectual property laws:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Website content, design, logos, and branding are owned by Vel Trading Agency.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Product images, botanical descriptions, and specifications are our property.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> You may not copy, reproduce, or distribute our content without written permission.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <ShieldAlert className="size-5 text-destructive" /> 10. Product Warranty and Liability
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                Our botanical products are warranted to be authentic and free from adulteration:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Products are sold for their intended herbal/botanical use only.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> We warrant quality against adulteration for 30 days from delivery.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Warranty does not cover improper storage (moisture/sunlight exposure).</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Our total liability shall not exceed the purchase price of the products.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <AlertTriangle className="size-5 text-amber-500" /> 11. Limitation of Liability
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                To the maximum extent permitted by law, Vel Trading Agency is not liable for any indirect, incidental, special, or consequential damages. We are not liable for loss of profits or business opportunities, damages from use beyond intended botanical purposes, third-party actions (courier delays, customs holds, payment issues), or force majeure events including natural disasters and pandemics.
                            </p>
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <Ban className="size-5 text-destructive" /> 12. Force Majeure
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Vel Trading Agency shall not be liable for failure to perform obligations due to circumstances beyond our reasonable control, including but not limited to: natural disasters, pandemics, monsoon disruptions, war, government export/import restrictions, labor strikes, transportation disruptions, supply chain issues, and regional power outages.
                            </p>
                        </section>

                        <section className="p-6 rounded-3xl bg-secondary/30 border border-border">
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <Gavel className="size-5 text-primary" /> 13. Governing Law and Jurisdiction
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                These Terms and Conditions are governed by the laws of India:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Any disputes shall be subject to the exclusive jurisdiction of courts in <strong>Madurai, Tamil Nadu</strong>.</li>
                                <li className="flex items-start gap-3"><span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" /> Indian law applies regardless of your location or country of residence.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">14. Modifications to Terms</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use after changes constitutes acceptance of the modified terms. It is your responsibility to review these terms periodically.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">15. Entire Agreement</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                These Terms and Conditions, together with our <Link to="/privacy-policy" className="text-primary underline font-semibold">Privacy Policy</Link>, <Link to="/shipping-policy" className="text-primary underline font-semibold">Shipping Policy</Link>, and <Link to="/refund-policy" className="text-primary underline font-semibold">Cancellation & Refund Policy</Link>, constitute the entire agreement between you and Vel Trading Agency regarding use of our website and services.
                            </p>
                        </section>

                        <div className="pt-10 border-t border-border flex flex-col sm:flex-row justify-between items-start gap-8">
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Mail className="size-4 text-primary" /> Legal Enquiries</h3>
                                <div className="text-sm space-y-1">
                                    <p className="text-primary font-semibold">veltradingagency@gmail.com</p>
                                    <p className="text-muted-foreground">+91 81246 75463</p>
                                    <p className="text-muted-foreground text-xs">102/103, Velar Street, Arapalayam, Madurai, TN – 625016</p>
                                </div>
                            </div>
                            <div className="text-[10px] text-muted-foreground text-right uppercase tracking-[0.2em] font-bold">
                                Business Hours: Mon–Sat, 9 AM – 7 PM
                            </div>
                        </div>

                        <p className="text-xs text-center text-muted-foreground pt-6 border-t border-border italic">
                            By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
}
