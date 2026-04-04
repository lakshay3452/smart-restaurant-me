const express = require("express")
const nodemailer = require("nodemailer")
const router = express.Router()
const Order = require("../models/Order")

// Nodemailer transporter for order emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Send order confirmation email
async function sendOrderConfirmationEmail(email, order) {
  const itemsHtml = order.items.map(item => {
    const extrasText = item.extras && item.extras.length > 0
      ? `<div style="color:#f59e0b;font-size:11px;margin-top:2px;">+ ${item.extras.map(e => escapeHtml(e)).join(", ")}</div>`
      : ""
    const spiceText = item.spiceLevel
      ? `<div style="color:#999;font-size:11px;margin-top:1px;">🌶️ ${escapeHtml(item.spiceLevel)}</div>`
      : ""
    const imageCell = item.image
      ? `<td style="padding:12px;width:60px;"><img src="${item.image}" alt="${escapeHtml(item.name)}" style="width:50px;height:50px;border-radius:8px;object-fit:cover;" onerror="this.style.display='none'" /></td>`
      : `<td style="padding:12px;width:60px;"><div style="width:50px;height:50px;border-radius:8px;background:#333;display:flex;align-items:center;justify-content:center;font-size:20px;">🍽️</div></td>`

    return `
    <tr style="border-bottom:1px solid #2a2a2a;">
      ${imageCell}
      <td style="padding:12px;text-align:left;vertical-align:top;">
        <div style="font-weight:600;color:#fff;font-size:14px;">${escapeHtml(item.name)}</div>
        ${extrasText}
        ${spiceText}
      </td>
      <td style="padding:12px;text-align:center;color:#ccc;vertical-align:top;">x${item.quantity}</td>
      <td style="padding:12px;text-align:right;color:#f59e0b;font-weight:600;vertical-align:top;">&#8377;${item.price * item.quantity}</td>
    </tr>
  `}).join("")

  const taxes = Math.round(order.totalAmount * 0.05)
  const grandTotal = order.totalAmount + taxes

  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;border-radius:16px;overflow:hidden;color:#fff;">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1a1a1a,#0f0f0f);padding:30px;text-align:center;border-bottom:1px solid #222;">
        <h1 style="color:#f59e0b;font-size:28px;margin:0;font-family:Georgia,serif;">LaCasa</h1>
        <p style="color:#666;font-size:12px;margin:8px 0 0;letter-spacing:2px;text-transform:uppercase;">Order Confirmation</p>
      </div>

      <div style="padding:25px 30px;">

        <!-- Success Badge -->
        <div style="text-align:center;margin-bottom:25px;">
          <div style="display:inline-block;background:#10b98120;border:1px solid #10b98140;border-radius:50px;padding:10px 24px;">
            <span style="color:#10b981;font-size:14px;font-weight:600;">✓ Order Placed Successfully</span>
          </div>
        </div>

        <!-- Order Info -->
        <div style="background:#1a1a1a;border:1px solid #222;padding:18px;border-radius:12px;margin-bottom:20px;">
          <table style="width:100%;font-size:13px;">
            <tr><td style="color:#888;padding:4px 0;">Order ID</td><td style="color:#fff;text-align:right;padding:4px 0;font-weight:600;">${order._id}</td></tr>
            <tr><td style="color:#888;padding:4px 0;">Name</td><td style="color:#fff;text-align:right;padding:4px 0;">${escapeHtml(order.name)}</td></tr>
            <tr><td style="color:#888;padding:4px 0;">Phone</td><td style="color:#fff;text-align:right;padding:4px 0;">${escapeHtml(order.phone)}</td></tr>
            <tr><td style="color:#888;padding:4px 0;">Address</td><td style="color:#fff;text-align:right;padding:4px 0;">${escapeHtml(order.address)}</td></tr>
          </table>
        </div>

        <!-- Items Table -->
        <p style="font-size:13px;font-weight:700;color:#f59e0b;margin:20px 0 10px;text-transform:uppercase;letter-spacing:1px;">Order Items</p>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#1a1a1a;">
              <th style="padding:10px 12px;text-align:left;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">&nbsp;</th>
              <th style="padding:10px 12px;text-align:left;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Item</th>
              <th style="padding:10px 12px;text-align:center;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Qty</th>
              <th style="padding:10px 12px;text-align:right;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Bill Summary -->
        <div style="background:#1a1a1a;border:1px solid #222;padding:18px;border-radius:12px;margin-top:20px;">
          <table style="width:100%;font-size:13px;">
            <tr><td style="color:#888;padding:5px 0;">Subtotal</td><td style="color:#ccc;text-align:right;padding:5px 0;">&#8377;${order.totalAmount}</td></tr>
            <tr><td style="color:#888;padding:5px 0;">Delivery Fee</td><td style="color:#10b981;text-align:right;padding:5px 0;font-weight:600;">FREE</td></tr>
            <tr><td style="color:#888;padding:5px 0;">Taxes (5%)</td><td style="color:#ccc;text-align:right;padding:5px 0;">&#8377;${taxes}</td></tr>
            <tr style="border-top:1px solid #333;">
              <td style="color:#fff;padding:10px 0 0;font-size:16px;font-weight:700;">Total</td>
              <td style="color:#f59e0b;text-align:right;padding:10px 0 0;font-size:18px;font-weight:700;">&#8377;${grandTotal}</td>
            </tr>
          </table>
        </div>

        <!-- Status -->
        <div style="text-align:center;margin-top:25px;">
          <span style="display:inline-block;background:#f59e0b20;border:1px solid #f59e0b40;border-radius:50px;padding:8px 20px;color:#f59e0b;font-size:13px;font-weight:600;">
            📋 Status: ${escapeHtml(order.status)}
          </span>
        </div>

      </div>

      <!-- Footer -->
      <div style="background:#0a0a0a;padding:20px 30px;text-align:center;border-top:1px solid #1a1a1a;">
        <p style="color:#555;font-size:12px;margin:0;">Thank you for ordering with LaCasa! 🍽️</p>
        <p style="color:#333;font-size:11px;margin:8px 0 0;">© ${new Date().getFullYear()} LaCasa Restaurant. All rights reserved.</p>
      </div>

    </div>
  `;

  await transporter.sendMail({
    from: `"LaCasa Restaurant" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🧾 LaCasa — Order Confirmed #${order._id}`,
    html
  });
}

// Helper to escape HTML
function escapeHtml(str) {
  if (typeof str !== "string") return str
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

// PLACE ORDER
router.post("/", async (req, res) => {
  try {
    const { name, phone, address, items, total, email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required for order confirmation" })
    }

    const order = new Order({
      name,
      phone,
      address,
      items,
      totalAmount: total,
      status: "Pending"
    })

    await order.save()

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(email, order)
    } catch (emailErr) {
      console.error("Failed to send order confirmation email:", emailErr)
      // Continue with order creation even if email fails
    }

    res.json({
      message: "Order placed successfully",
      order
    })
  } catch (err) {
    console.error("Order placement error:", err)
    res.status(500).json({ message: "Failed to place order" })
  }
})

// JSON API
router.get("/json", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json({
      totalOrders: orders.length,
      orders
    })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" })
  }
})

// CHROME VIEW (Styled Orders) - XSS safe
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })

    let rows = orders.map(order => {
      let items = (order.items || []).map(item => `
        <div>${escapeHtml(item.name)} (x${item.quantity}) - &#8377;${item.price}</div>
      `).join("")

      return `
        <tr>
          <td>${escapeHtml(String(order._id))}</td>
          <td>${escapeHtml(order.name)}</td>
          <td>${escapeHtml(order.phone)}</td>
          <td>${escapeHtml(order.address)}</td>
          <td>${items}</td>
          <td>&#8377;${order.totalAmount}</td>
          <td>${escapeHtml(order.status)}</td>
          <td>${order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</td>
        </tr>
      `
    }).join("")

    res.send(`
    <html>
    <head>
    <title>Restaurant Orders</title>
    <style>
    body{font-family:Arial;background:#0f172a;color:white;padding:30px;}
    h1{margin-bottom:20px;}
    table{width:100%;border-collapse:collapse;background:#1e293b;}
    th,td{padding:12px;border:1px solid #334155;text-align:left;}
    th{background:#f59e0b;color:black;}
    tr:hover{background:#334155;}
    </style>
    </head>
    <body>
    <h1>Restaurant Orders Dashboard</h1>
    <table>
    <tr>
    <th>Order ID</th><th>Name</th><th>Phone</th><th>Address</th><th>Items</th><th>Total</th><th>Status</th><th>Time</th>
    </tr>
    ${rows}
    </table>
    </body>
    </html>
    `)
  } catch (err) {
    res.status(500).send("Error loading orders")
  }
})

// UPDATE STATUS
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json({ message: "Order updated", order })
  } catch (err) {
    res.status(500).json({ message: "Failed to update order" })
  }
})

// DELETE ORDER
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json({ message: "Order deleted successfully", order })
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order" })
  }
})

module.exports = router
