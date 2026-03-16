const express = require("express")
const router = express.Router()
const Order = require("../models/Order")

// Helper to escape HTML
function escapeHtml(str) {
  if (typeof str !== "string") return str
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

// PLACE ORDER
router.post("/", async (req, res) => {
  try {
    const { name, phone, address, items, total } = req.body

    const order = new Order({
      name,
      phone,
      address,
      items,
      totalAmount: total,
      status: "Pending"
    })

    await order.save()

    res.json({
      message: "Order placed successfully",
      order
    })
  } catch (err) {
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

module.exports = router
