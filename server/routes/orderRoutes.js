const express = require("express")
const router = express.Router()

let orders = []


// PLACE ORDER
router.post("/", (req, res) => {

  const { name, phone, address, items, total } = req.body

  const order = {
    id: Date.now(),
    name,
    phone,
    address,
    items,
    total,
    status: "Pending",
    time: new Date().toLocaleString()
  }

  orders.push(order)

  res.json({
    message: "Order placed successfully",
    order
  })

})




// JSON API (Frontend use karega)
router.get("/json", (req, res) => {

  res.json({
    totalOrders: orders.length,
    orders
  })

})




// CHROME VIEW (Styled Orders)
router.get("/", (req, res) => {

  let rows = orders.map(order => {

    let items = order.items.map(item => `
      <div>${item.name} (x${item.quantity}) - ₹${item.price}</div>
    `).join("")

    return `
      <tr>
        <td>${order.id}</td>
        <td>${order.name}</td>
        <td>${order.phone}</td>
        <td>${order.address}</td>
        <td>${items}</td>
        <td>₹${order.total}</td>
        <td>${order.status}</td>
        <td>${order.time}</td>
      </tr>
    `

  }).join("")


  res.send(`
  <html>
  <head>
  <title>Restaurant Orders</title>

  <style>

  body{
    font-family: Arial;
    background:#0f172a;
    color:white;
    padding:30px;
  }

  h1{
    margin-bottom:20px;
  }

  table{
    width:100%;
    border-collapse: collapse;
    background:#1e293b;
  }

  th,td{
    padding:12px;
    border:1px solid #334155;
    text-align:left;
  }

  th{
    background:#f59e0b;
    color:black;
  }

  tr:hover{
    background:#334155;
  }

  </style>

  </head>

  <body>

  <h1>🍽 Restaurant Orders Dashboard</h1>

  <table>

  <tr>
  <th>Order ID</th>
  <th>Name</th>
  <th>Phone</th>
  <th>Address</th>
  <th>Items</th>
  <th>Total</th>
  <th>Status</th>
  <th>Time</th>
  </tr>

  ${rows}

  </table>

  </body>
  </html>
  `)

})




// UPDATE STATUS
router.put("/:id", (req, res) => {

  const { status } = req.body

  const order = orders.find(o => o.id == req.params.id)

  if (!order) {

    return res.status(404).json({
      message: "Order not found"
    })

  }

  order.status = status

  res.json({
    message: "Order updated",
    order
  })

})


module.exports = router