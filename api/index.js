const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("../server/config/db");

// Load env variables from server/.env in local dev
dotenv.config({ path: path.resolve(__dirname, "../server/.env") });

const app = express();

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());

// ================= CONNECT DATABASE =================

connectDB();

// ================= ROUTES IMPORT =================

const orderRoutes = require("../server/routes/orderRoutes");
const itemRoutes = require("../server/routes/itemRoutes");
const authRoutes = require("../server/routes/authRoutes");
const menuRoutes = require("../server/routes/menuRoutes");
const paymentRoutes = require("../server/routes/paymentRoutes");
const reservationRoutes = require("../server/routes/reservationRoutes");
const settingsRoutes = require("../server/routes/settingsRoutes");
const adminRoutes = require("../server/routes/adminRoutes");
const favouriteRoutes = require("../server/routes/favouriteRoutes");
const couponRoutes = require("../server/routes/couponRoutes");
const flashDealRoutes = require("../server/routes/flashDealRoutes");
const feedbackRoutes = require("../server/routes/feedbackRoutes");
const chatRoutes = require("../server/routes/chatRoutes");
const tableRoutes = require("../server/routes/tableRoutes");
const recommendationRoutes = require("../server/routes/recommendationRoutes");

// ================= API ROUTES =================

app.use("/api/orders", orderRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/flash-deals", flashDealRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/recommendations", recommendationRoutes);

// ================= ROOT ROUTE =================

app.get("/api", (req, res) => {
  res.json({ message: "Restaurant Backend API Running Successfully" });
});

// ================= 404 HANDLER =================

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

// Export for Vercel serverless
module.exports = app;
