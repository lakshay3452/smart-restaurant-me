const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Menu = require("../models/Menu");

// Get AI recommendations based on user's order history
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Get user's past orders
    const orders = await Order.find({ email }).sort({ createdAt: -1 }).limit(20);

    // Count frequency of each item ordered
    const itemFrequency = {};
    const orderedCategories = {};
    const orderedItems = new Set();

    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.name;
        itemFrequency[name] = (itemFrequency[name] || 0) + item.quantity;
        orderedItems.add(name);
      });
    });

    // Get all available menu items
    const allItems = await Menu.find({ available: true });

    // Score each item
    const scored = allItems.map(item => {
      let score = 0;

      // If user ordered this before, boost score by frequency
      if (itemFrequency[item.name]) {
        score += itemFrequency[item.name] * 10;
      }

      // Boost popular items (high rating)
      if (item.avgRating) score += item.avgRating * 2;
      if (item.rating) score += item.rating * 2;

      // Boost bestsellers
      if (item.bestseller) score += 5;

      // Items NOT ordered before get a "try something new" bonus
      if (!orderedItems.has(item.name)) {
        score += 3;
      }

      return { ...item.toObject(), score };
    });

    // Sort by score descending and return top 10
    scored.sort((a, b) => b.score - a.score);
    const recommendations = scored.slice(0, 10);

    res.json({
      recommendations,
      basedOn: orders.length > 0 ? "order_history" : "popular",
      totalOrdersAnalyzed: orders.length
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get recommendations" });
  }
});

module.exports = router;
