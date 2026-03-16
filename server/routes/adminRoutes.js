const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const Reservation = require("../models/Reservation");
const Menu = require("../models/Menu");
const router = express.Router();

// Dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const acceptedOrders = await Order.countDocuments({ status: "Accepted" });
    const preparingOrders = await Order.countDocuments({ status: "Preparing" });
    const readyOrders = await Order.countDocuments({ status: "Ready" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const rejectedOrders = await Order.countDocuments({ status: "Rejected" });
    const totalUsers = await User.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const totalMenuItems = await Menu.countDocuments();

    // Revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $nin: ["Rejected"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Today's stats
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: startOfDay } });
    const todayRevenueResult = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfDay }, status: { $nin: ["Rejected"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    // Last 7 days chart data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = await Order.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });
      const dayRevenueResult = await Order.aggregate([
        { $match: { createdAt: { $gte: date, $lt: nextDate }, status: { $nin: ["Rejected"] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]);

      last7Days.push({
        date: date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
        orders: dayOrders,
        revenue: dayRevenueResult[0]?.total || 0
      });
    }

    // Recent orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalOrders,
      pendingOrders,
      acceptedOrders,
      preparingOrders,
      readyOrders,
      deliveredOrders,
      rejectedOrders,
      totalUsers,
      totalReservations,
      totalMenuItems,
      totalRevenue,
      todayOrders,
      todayRevenue,
      last7Days,
      recentOrders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// Get all users (admin)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Toggle user block
router.put("/users/:id/toggle-block", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = user.role === "blocked" ? "user" : "blocked";
    await user.save();
    res.json({ message: `User ${user.role === "blocked" ? "blocked" : "unblocked"}`, user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Get orders for a specific user
router.get("/users/:id/orders", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const orders = await Order.find({ name: user.name }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

module.exports = router;
