const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const helmet = require("helmet")
const compression = require("compression")
const mongoSanitize = require("express-mongo-sanitize")
const hpp = require("hpp")
const rateLimit = require("express-rate-limit")
const connectDB = require("./config/db")

// Load env variables
dotenv.config()

// ── Validate required env variables ──
const requiredEnv = ["MONGO_URI", "JWT_SECRET", "EMAIL_USER", "EMAIL_PASS"]
const missingEnv = requiredEnv.filter((key) => !process.env[key])
if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(", ")}`)
  process.exit(1)
}

const app = express()

const PORT = process.env.PORT || 5000

// ================= SECURITY MIDDLEWARE =================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable CSP for API server
}))

// Gzip compression
app.use(compression())

// CORS with proper config
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:5174"]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, true) // Allow all in development; tighten in production
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Sanitize data against NoSQL injection
app.use(mongoSanitize())

// Prevent HTTP parameter pollution
app.use(hpp())

// ── Rate Limiting ──
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again after 15 minutes" }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // stricter for auth routes
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later" }
})

app.use("/api/", apiLimiter)
app.use("/api/auth/", authLimiter)

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ================= CONNECT DATABASE =================

connectDB()

// ================= ROUTES IMPORT =================

const orderRoutes = require("./routes/orderRoutes")
const itemRoutes = require("./routes/itemRoutes")
const authRoutes = require("./routes/authRoutes")
const menuRoutes = require("./routes/menuRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const reservationRoutes = require("./routes/reservationRoutes")
const settingsRoutes = require("./routes/settingsRoutes")
const adminRoutes = require("./routes/adminRoutes")
const favouriteRoutes = require("./routes/favouriteRoutes")
const couponRoutes = require("./routes/couponRoutes")
const flashDealRoutes = require("./routes/flashDealRoutes")
const feedbackRoutes = require("./routes/feedbackRoutes")
const chatRoutes = require("./routes/chatRoutes")
const tableRoutes = require("./routes/tableRoutes")
const recommendationRoutes = require("./routes/recommendationRoutes")
const loyaltyRoutes = require("./routes/loyaltyRoutes")
const walletRoutes = require("./routes/walletRoutes")
const referralRoutes = require("./routes/referralRoutes")

// ================= API ROUTES =================

app.use("/api/orders", orderRoutes)
app.use("/api/items", itemRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/menu", menuRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/reservations", reservationRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/favourites", favouriteRoutes)
app.use("/api/coupons", couponRoutes)
app.use("/api/flash-deals", flashDealRoutes)
app.use("/api/feedback", feedbackRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/tables", tableRoutes)
app.use("/api/recommendations", recommendationRoutes)
app.use("/api/loyalty", loyaltyRoutes)
app.use("/api/wallet", walletRoutes)
app.use("/api/referral", referralRoutes)

// ================= ROOT ROUTE =================

app.get("/", (req, res) => {
  res.send("Restaurant Backend API Running Successfully")
})

// ================= 404 HANDLER =================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  })
})

// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error("Error:", err.stack || err.message)
  const statusCode = err.status || 500
  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal Server Error" : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  })
})

// ================= SERVER START =================

const server = app.listen(PORT, () => {
  console.log("\n======================================")
  console.log(`  LaCasa Backend v2.0`)
  console.log(`  Server: http://localhost:${PORT}`)
  console.log(`  Env: ${process.env.NODE_ENV || "development"}`)
  console.log(`  API: http://localhost:${PORT}/api`)
  console.log("======================================\n")
})

// ── Graceful Shutdown ──
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`)
  server.close(() => {
    console.log("Server closed.")
    process.exit(0)
  })
  setTimeout(() => {
    console.log("Forcing shutdown...")
    process.exit(1)
  }, 10000)
}

process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT", () => shutdown("SIGINT"))
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
})
