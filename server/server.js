const express = require("express")
const cors = require("cors")

const app = express()

// PORT
const PORT = 5000



// ================= MIDDLEWARE =================

app.use(cors())
app.use(express.json())



// ================= ROUTES IMPORT =================

const orderRoutes = require("./routes/orderRoutes")
const itemRoutes = require("./routes/itemRoutes")



// ================= API ROUTES =================

app.use("/api/orders", orderRoutes)

app.use("/api/items", itemRoutes)



// ================= ROOT ROUTE =================

app.get("/", (req, res) => {
  res.send("🍽 Restaurant Backend API Running Successfully")
})



// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {

  console.error(err)

  res.status(500).json({
    message: "Server Error"
  })

})



// ================= SERVER START =================

app.listen(PORT, () => {

  console.log("\n======================================")
  console.log(`🚀 Restaurant Backend Running`)
  console.log(`🌐 Server: http://localhost:${PORT}`)
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`)
  console.log(`🍔 Items API: http://localhost:${PORT}/api/items`)
  console.log("======================================\n")

})