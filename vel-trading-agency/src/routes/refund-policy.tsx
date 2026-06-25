import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, XCircle, HelpCircle, Mail } from 'lucide-react';

export const Route = createFileRoute('/refund-policy')({
    component: RefundPolicy,
});

function RefundPolicy() {
    return (
        <div className="min-h-screen bg-secondary/30 py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-8 hover:opacity-80 transition-all group">
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Back
                </Link>

                <article className="bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-border bg-secondary/50">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                                <RefreshCw className="size-5 text-destructive" />
                            </div>
                            <h1 className="text-3xl font-bold">Cancellation & Refund Policy</h1>
                        </div>
                        <p className="text-xs text-muted-foreground ml-14">Last updated: January 2026</p>
                    </div>

                    <div className="p-8 sm:p-12 space-y-12">
                        <p className="text-sm text-muted-foreground leading-relaxed italic border-l-4 border-destructive/20 pl-6">
                            At Vel Trading Agency, customer satisfaction and product integrity are our priorities. We understand that sometimes you may need to cancel an order or request a refund. This policy outlines the terms for cancellation and returns.
                        </p>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5">
                                <AlertCircle className="size-5 text-destructive" /> Order Cancellation
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-5 rounded-2xl bg-secondary/30 border border-border">
                                    <h3 className="text-sm font-bold mb-2 uppercase tracking-wider text-primary">Before Dispatch</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Orders can be cancelled free of charge within <strong>12 hours</strong> of placement, provided they haven't left our facility.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-secondary/30 border border-border">
                                    <h3 className="text-sm font-bold mb-2 uppercase tracking-wider text-destructive">After Dispatch</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Once dispatched, orders cannot be cancelled. You may refuse delivery, but return shipping costs will apply.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-5">Return Policy</h2>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                We accept returns under the following specific conditions for botanical integrity:
                            </p>
                            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 className="size-4 text-green-500 mt-0.5 shrink-0" />
                                        Items must be unopened and in original sealed packaging.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 className="size-4 text-green-500 mt-0.5 shrink-0" />
                                        Returns must be initiated within 7 days of delivery.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 className="size-4 text-green-500 mt-0.5 shrink-0" />
                                        Physical damage or leakage during transit.
                                    </li>
                                </ul>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <XCircle className="size-4 text-destructive mt-0.5 shrink-0" />
                                        Custom-processed powders are non-returnable.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <XCircle className="size-4 text-destructive mt-0.5 shrink-0" />
                                        Items showing signs of use or tampering.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <XCircle className="size-4 text-destructive mt-0.5 shrink-0" />
                                        Bulk orders exceeding 100Kg (Special trade terms apply).
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="bg-secondary/20 -mx-8 sm:-mx-12 px-8 sm:px-12 py-10 border-y border-border">
                            <h2 className="text-xl font-bold mb-6">Refund Process</h2>
                            <p className="text-sm text-muted-foreground mb-6">Once we receive and inspect your returned botanical items:</p>
                            <div className="grid sm:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-primary uppercase">Step 1</div>
                                    <h4 className="font-bold">Inspection</h4>
                                    <p className="text-[11px] text-muted-foreground">2-3 business days after receiving return.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-primary uppercase">Step 2</div>
                                    <h4 className="font-bold">Processing</h4>
                                    <p className="text-[11px] text-muted-foreground">5-7 business days for banking systems.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-primary uppercase">Step 3</div>
                                    <h4 className="font-bold">Credit</h4>
                                    <p className="text-[11px] text-muted-foreground">Original USD/INR payment source.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-5 italic">
                                Non-Refundable Items
                            </h2>
                            <ul className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                                <li className="p-3 bg-secondary/40 rounded-xl border border-border">• Personalized botanical blends</li>
                                <li className="p-3 bg-secondary/40 rounded-xl border border-border">• Clearance/Trade Sale items</li>
                                <li className="p-3 bg-secondary/40 rounded-xl border border-border">• Improperly stored perishable roots</li>
                                <li className="p-3 bg-secondary/40 rounded-xl border border-border">• Custom-printed corporate packaging</li>
                            </ul>
                        </section>

                        <div className="pt-10 border-t border-border flex flex-col sm:flex-row justify-between items-start gap-8">
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Mail className="size-4 text-destructive" /> Claim Settlements</h3>
                                <div className="text-sm space-y-1">
                                    <p className="text-destructive font-semibold">refunds@veltradingagency.com</p>
                                    <p className="text-muted-foreground">+91 81246 75463</p>
                                </div>
                            </div>
                            <div className="text-[10px] text-muted-foreground text-right flex items-center gap-2">
                                <HelpCircle className="size-4" /> Need help? Contact Support
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
