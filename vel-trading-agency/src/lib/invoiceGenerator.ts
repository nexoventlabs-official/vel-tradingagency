import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  priceUSD: number;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  merchantTxnId: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: string;
  gid?: string;
  createdAt: string;
}

// jsPDF built-in Helvetica only supports latin-1 (ISO 8859-1).
// Strip ALL characters outside latin-1 range (codepoint > 255) before
// passing any string to jsPDF — otherwise the entire string gets corrupted.
function safe(str: string): string {
  return str
    .replace(/₹/g, "Rs.")          // rupee sign → Rs.
    .replace(/–/g, "-")             // en-dash → hyphen
    .replace(/—/g, "-")             // em-dash → hyphen
    .replace(/[^\x00-\xFF]/g, "?"); // strip anything else outside latin-1
}
export function generateInvoicePDF(order: Order) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const INR_RATE = 83.2;

  // Safe currency formatter — ASCII only
  const inrVal  = (usd: number) => `INR ${(usd * INR_RATE).toFixed(2)}`;
  const usdVal  = (usd: number) => `USD ${usd.toFixed(2)}`;
  const combined = (usd: number) => `${inrVal(usd)}  (${usdVal(usd)})`;

  // Safe date — avoid locale strings that might include unicode punctuation
  const fmtDate = (d: string) => {
    const dt = new Date(d);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    const hh = String(dt.getHours()).padStart(2, "0");
    const min = String(dt.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy}  ${hh}:${min}`;
  };

  // ── Header bar ──────────────────────────────────────────────────────────────
  doc.setFillColor(22, 101, 52);
  doc.rect(0, 0, pageW, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("VEL TRADING AGENCY", 14, 12);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("102/103, Velar Street, Arapalayam, Madurai, Tamil Nadu - 625016", 14, 19);
  doc.text("+91 81246 75463  |  veltradingagency@gmail.com  |  GST: 33ABCFV1505G1ZM", 14, 24);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("INVOICE", pageW - 14, 18, { align: "right" });

  // ── Invoice meta (left column) ───────────────────────────────────────────────
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  const metaY = 36;

  const metaRow = (label: string, value: string, y: number, valueColor?: [number,number,number]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(label, 14, y);
    doc.setFont("helvetica", "normal");
    if (valueColor) doc.setTextColor(...valueColor);
    else doc.setTextColor(30, 30, 30);
    doc.text(value, 46, y);
  };

  metaRow("Invoice No :", safe(order.merchantTxnId), metaY);
  metaRow("Date       :", fmtDate(order.createdAt), metaY + 7);
  metaRow(
    "Status     :",
    safe(order.paymentStatus),
    metaY + 14,
    order.paymentStatus === "PAID" ? [21, 128, 61] : [185, 28, 28]
  );
  if (order.gid) {
    metaRow("Gateway ID :", safe(order.gid), metaY + 21);
  }

  // ── Billing box (right column) ───────────────────────────────────────────────
  const boxX = pageW / 2 + 8;
  const boxW = pageW - boxX - 14;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(boxX, metaY - 5, boxW, 44, 3, 3, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text("BILLED TO", boxX + 4, metaY + 1);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  // Truncate name to fit box
  const nameStr = safe(order.customer.name).substring(0, 28);
  doc.text(nameStr, boxX + 4, metaY + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  // Address — split long lines safely
  const addrLine  = safe(`${order.customer.address}, ${order.customer.city}`).substring(0, 38);
  const stateLine = safe(`${order.customer.state} - ${order.customer.pincode}`);
  const phoneLine = safe(`Ph: ${order.customer.phone}`);
  const emailLine = safe(order.customer.email).substring(0, 36);

  doc.text(addrLine,  boxX + 4, metaY + 16);
  doc.text(stateLine, boxX + 4, metaY + 22);
  doc.text(phoneLine, boxX + 4, metaY + 28);
  doc.text(emailLine, boxX + 4, metaY + 34);

  // ── Items table ──────────────────────────────────────────────────────────────
  const tableY = metaY + 52;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(22, 101, 52);
  doc.text("ORDER ITEMS", 14, tableY);

  autoTable(doc, {
    startY: tableY + 4,
    head: [["#", "Product", "Unit (USD)", "Qty", "Amount (INR / USD)"]],
    body: order.items.map((item, i) => [
      String(i + 1),
      safe(item.name),   // ← sanitize product name
      usdVal(item.priceUSD),
      String(item.qty),
      combined(item.priceUSD * item.qty),
    ]),
    headStyles: {
      fillColor: [22, 101, 52],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 30, 30],
    },
    alternateRowStyles: { fillColor: [247, 250, 247] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 72 },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 12, halign: "center" },
      4: { cellWidth: 48, halign: "right" },
    },
    margin: { left: 14, right: 14 },
    styles: { font: "helvetica", overflow: "linebreak" },
  });

  // ── Totals ───────────────────────────────────────────────────────────────────
  const finalY = (doc as any).lastAutoTable.finalY + 8;

  doc.setFillColor(245, 247, 250);
  doc.roundedRect(pageW - 92, finalY, 78, 32, 3, 3, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text("Subtotal :", pageW - 88, finalY + 8);
  doc.text("Shipping :", pageW - 88, finalY + 15);

  doc.setTextColor(30, 30, 30);
  doc.text(combined(order.totalAmount), pageW - 16, finalY + 8, { align: "right" });
  doc.setTextColor(22, 101, 52);
  doc.text("FREE", pageW - 16, finalY + 15, { align: "right" });

  doc.setDrawColor(22, 101, 52);
  doc.setLineWidth(0.4);
  doc.line(pageW - 88, finalY + 20, pageW - 16, finalY + 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(22, 101, 52);
  doc.text("TOTAL :", pageW - 88, finalY + 28);
  doc.text(combined(order.totalAmount), pageW - 16, finalY + 28, { align: "right" });

  // ── Notes ────────────────────────────────────────────────────────────────────
  const notesY = finalY + 42;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text("Thank you for choosing Vel Trading Agency. This is a computer-generated invoice.", 14, notesY);
  doc.text("Queries: veltradingagency@gmail.com  |  MSME: UDYAM-TN-12-0182473  |  PAN: ABCFV1505G", 14, notesY + 5);

  // ── Footer bar ────────────────────────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFillColor(22, 101, 52);
  doc.rect(0, footerY - 5, pageW, 15, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "Vel Trading Agency  |  Madurai, Tamil Nadu  |  Authentic Herbs, Seeds & Roots",
    pageW / 2,
    footerY + 3,
    { align: "center" }
  );

  doc.save(`Invoice_${order.merchantTxnId}.pdf`);
}
