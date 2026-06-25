import { Link } from "@tanstack/react-router";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center">
              <Leaf className="size-5" />
            </div>
            <div className="text-display text-xl font-semibold">Vel Trading Agency</div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            Authentic herbs, seeds, roots & florals sourced from Tamil Nadu's farms.
            Wholesale & export inquiries welcome.
          </p>
          <div className="mt-5 text-xs text-muted-foreground space-y-1">
            <div><span className="font-medium text-foreground">GST:</span> 33ABCFV1505G1ZM</div>
            <div><span className="font-medium text-foreground">MSME:</span> UDYAM-TN-12-0182473</div>
            <div><span className="font-medium text-foreground">Business PAN:</span> ABCFV1505G</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Explore</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-primary">Products</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/enquiry" className="hover:text-primary">Bulk Enquiry</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Reach us</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><MapPin className="size-4 mt-0.5 shrink-0" /> 102/103, Velar Street, Arapalayam, Madurai, Tamil Nadu – 625016</li>
            <li className="flex gap-2"><Phone className="size-4 mt-0.5 shrink-0" /> +91 81246 75463</li>
            <li className="flex gap-2"><Mail className="size-4 mt-0.5 shrink-0" /> veltradingagency@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-[10px] sm:text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-2 md:order-1 font-medium">
            <Link to="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link>
            <Link to="/refund-policy" className="hover:text-primary transition-colors">Cancellation & Refund</Link>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          </div>
          <div className="text-center md:text-right order-1 md:order-2">
            <span>© {new Date().getFullYear()} Vel Trading Agency. Madurai, India.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
