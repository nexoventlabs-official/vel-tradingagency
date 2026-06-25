import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Truck, Clock, ShieldCheck, Globe, AlertTriangle, MapPin } from 'lucide-react';

export const Route = createFileRoute('/shipping-policy')({
    component: ShippingPolicy,
});

function ShippingPolicy() {
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
                                <Truck className="size-5 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold">Shipping Policy</h1>
                        </div>
                        <p className="text-xs text-muted-foreground ml-14">Last updated: January 2026</p>
                    </div>

                    <div className="p-8 sm:p-12 space-y-12">
                        <p className="text-base text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-6">
                            At Vel Trading Agency, we are committed to delivering your authentic botanical products safely and on time. This policy outlines our shipping procedures, timelines, and charges for our global trade partners.
                        </p>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <Clock className="size-5 text-primary" /> Order Processing Time
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                All orders are processed within <strong>2-3 business days</strong> (Monday to Saturday, excluding public holidays) after receiving your order confirmation. As we handle natural herbs and seeds, this time is essential for final quality grading and moisture-barrier vacuum packaging.
                            </p>
                        </section>

                        <section className="bg-secondary/20 -mx-8 sm:-mx-12 px-8 sm:px-12 py-10 border-y border-border">
                            <h2 className="text-xl font-bold mb-6">Delivery Timeline</h2>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Domestic (India)</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Standard delivery within India typically takes 3-7 business days.
                                    </p>
                                    <ul className="text-sm space-y-2 text-muted-foreground">
                                        <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-primary" /> <strong>Tamil Nadu:</strong> 2-3 business days</li>
                                        <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-primary" /> <strong>Major Metro Cities:</strong> 3-5 business days</li>
                                        <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-primary" /> <strong>Remote Areas:</strong> 5-7 business days</li>
                                    </ul>
                                </div>
                                <div className="space-y-4 border-l border-border pl-8">
                                    <h3 className="font-bold text-primary text-sm uppercase tracking-wider">International</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Timeline depends on logistical grade and destination country.
                                    </p>
                                    <ul className="text-sm space-y-2 text-muted-foreground">
                                        <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-primary" /> <strong>Air Freight:</strong> 7-12 business days</li>
                                        <li className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-primary" /> <strong>Sea Freight (Bulk):</strong> 25-45 business days</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-5">Shipping Charges</h2>
                            <p className="text-muted-foreground mb-4">Export logistics are calculated based on weight and destination at checkout:</p>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-center">
                                    <div className="text-2xl font-bold text-primary mb-1">FREE</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Orders above $50.00 (India)</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-center">
                                    <div className="text-2xl font-bold mb-1">$2.50</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Flat Rate Domestic</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-center">
                                    <div className="text-2xl font-bold mb-1">Custom</div>
                                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Bulk/RFQ Sea Freight</div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <ShieldCheck className="size-5 text-primary" /> Order Tracking
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Once dispatched, you will receive a tracking number via email and SMS. You can monitor your shipment's progress on our partner website (DHL, FedEx, or Blue Dart). International B/L info is provided via the Trade Portal.
                            </p>
                        </section>

                        <section className="grid sm:grid-cols-2 gap-10">
                            <div>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Globe className="size-5 text-primary" /> Delivery Partners
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    We work with reliable global courier partners including <strong>DHL, Blue Dart, and Maersk</strong> to ensure safe and timely delivery of your botanical orders.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <AlertTriangle className="size-5 text-amber-500" /> Delivery Attempts
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Partners typically make 2-3 delivery attempts. If unsuccessful, the package returns to our facility and redelivery may incur additional charges.
                                </p>
                            </div>
                        </section>

                        <section className="p-6 rounded-3xl bg-secondary/40 border border-border">
                            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <MapPin className="size-5 text-primary" /> Damaged or Lost Shipments
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                While we take utmost care in moisture-proof packaging, if your shipment arrives damaged, please contact us within <strong>48 hours</strong> of delivery with photos to initiate a replacement or refund claim.
                            </p>
                        </section>

                        <div className="pt-10 border-t border-border flex flex-col sm:flex-row justify-between items-start gap-8">
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2">Contact Logistics Team</h3>
                                <div className="text-sm space-y-1">
                                    <p className="text-primary font-semibold">veltradingagency@gmail.com</p>
                                    <p className="text-muted-foreground">+91 81246 75463</p>
                                </div>
                            </div>
                            <div className="text-[10px] text-muted-foreground text-right uppercase tracking-[0.2em] font-bold">
                                Madurai · Tamil Nadu · India
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
