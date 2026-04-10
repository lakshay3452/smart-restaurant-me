import { FileText } from "lucide-react";

export default function InvoiceDownload({ order }) {
  const generateInvoice = () => {
    const taxes = Math.round((order.totalAmount || order.total) * 0.05);
    const grandTotal = (order.totalAmount || order.total) + taxes;

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice - LaCasa</title>
<style>
body { font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; color: #333; }
.header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 15px; margin-bottom: 20px; }
.header h1 { color: #f59e0b; font-size: 28px; margin: 0; font-family: Georgia, serif; }
.header p { color: #666; font-size: 12px; margin: 4px 0 0; }
.info { display: flex; justify-content: space-between; margin-bottom: 20px; }
.info div { font-size: 13px; }
.info .label { color: #888; }
table { width: 100%; border-collapse: collapse; margin: 15px 0; }
th { background: #f8f8f8; padding: 10px; text-align: left; font-size: 12px; color: #666; border-bottom: 1px solid #ddd; }
td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
.total-row { font-weight: bold; }
.total-row td { border-top: 2px solid #333; padding-top: 12px; }
.footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; color: #888; font-size: 11px; }
.amt { text-align: right; }
.grand { color: #f59e0b; font-size: 16px; }
@media print { body { padding: 0; } }
</style>
</head>
<body>
<div class="header">
  <h1>LaCasa</h1>
  <p>ORDER INVOICE</p>
</div>
<div class="info">
  <div>
    <p class="label">Order ID</p>
    <p><strong>${order._id || order.id}</strong></p>
  </div>
  <div>
    <p class="label">Date</p>
    <p>${order.date || new Date(order.createdAt).toLocaleDateString()}</p>
  </div>
</div>
<div class="info">
  <div>
    <p class="label">Customer</p>
    <p>${order.name || "—"}</p>
    <p>${order.phone ? "+91 " + order.phone : ""}</p>
  </div>
  <div>
    <p class="label">Delivery Address</p>
    <p>${order.address || "—"}</p>
  </div>
</div>
<table>
  <thead>
    <tr><th>Item</th><th>Qty</th><th class="amt">Price</th><th class="amt">Total</th></tr>
  </thead>
  <tbody>
    ${(order.items || []).map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td class="amt">₹${item.price}</td>
      <td class="amt">₹${item.price * item.quantity}</td>
    </tr>`).join("")}
    <tr>
      <td colspan="3" class="amt">Subtotal</td>
      <td class="amt">₹${order.totalAmount || order.total}</td>
    </tr>
    <tr>
      <td colspan="3" class="amt">Tax (5%)</td>
      <td class="amt">₹${taxes}</td>
    </tr>
    <tr>
      <td colspan="3" class="amt">Delivery</td>
      <td class="amt" style="color:green;">FREE</td>
    </tr>
    <tr class="total-row">
      <td colspan="3" class="amt">Grand Total</td>
      <td class="amt grand">₹${grandTotal}</td>
    </tr>
  </tbody>
</table>
<div class="footer">
  <p>Thank you for ordering with LaCasa!</p>
  <p>For support, contact us at ug13262@gmail.com</p>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => { win.print(); };
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return (
    <button
      onClick={generateInvoice}
      className="flex items-center gap-1.5 text-xs font-medium bg-white/[0.06] text-white/60 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
      title="Download Invoice"
    >
      <FileText size={12} />
      Invoice
    </button>
  );
}
