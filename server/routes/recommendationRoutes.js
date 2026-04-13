const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Menu = require("../models/Menu");

// Get AI recommendations based on user's order history
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Get user's past orders
    const orders = await Order.find({ email }).sort({ createdAt: -1 }).limit(30);

    // Analyze ordering patterns
    const itemFrequency = {};
    const categoryFrequency = {};
    const priceRange = { min: Infinity, max: 0, avg: 0 };
    const orderedItems = new Set();
    let totalItems = 0;
    let totalSpent = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.name;
        itemFrequency[name] = (itemFrequency[name] || 0) + item.quantity;
        orderedItems.add(name);

        if (item.category) {
          categoryFrequency[item.category] = (categoryFrequency[item.category] || 0) + item.quantity;
        }

        const price = item.price || 0;
        priceRange.min = Math.min(priceRange.min, price);
        priceRange.max = Math.max(priceRange.max, price);
        totalSpent += price * item.quantity;
        totalItems += item.quantity;
      });
    });

    priceRange.avg = totalItems > 0 ? totalSpent / totalItems : 300;

    // Get all available menu items
    const allItems = await Menu.find({ available: true });

    // Determine time-of-day preference
    const hour = new Date().getHours();
    const mealTime = hour < 11 ? "breakfast" : hour < 15 ? "lunch" : hour < 18 ? "snack" : "dinner";

    // Top categories user prefers
    const topCategories = Object.entries(categoryFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat.toLowerCase());

    // Score each item
    const scored = allItems.map(item => {
      let score = 0;

      // Frequency-based score (capped to avoid over-domination)
      if (itemFrequency[item.name]) {
        score += Math.min(itemFrequency[item.name] * 8, 40);
      }

      // Category preference (user likes this type of food)
      const itemCat = (item.category || "").toLowerCase();
      if (topCategories.includes(itemCat)) {
        score += 15;
      }

      // Price range affinity (recommend items in user's comfortable price range)
      if (totalItems > 0) {
        const priceDiff = Math.abs(item.price - priceRange.avg);
        score += Math.max(0, 10 - priceDiff / 50);
      }

      // Rating boost
      const rating = item.avgRating || item.rating || 0;
      score += rating * 3;

      // Bestseller bonus
      if (item.bestseller) score += 8;

      // "Try something new" bonus for items user hasn't ordered
      if (!orderedItems.has(item.name) && orders.length > 2) {
        score += 12;
      }

      // Time-of-day boost (if item category/tag matches mealtime)
      const nameLC = item.name.toLowerCase();
      const descLC = (item.description || "").toLowerCase();
      if (mealTime === "breakfast" && /breakfast|coffee|tea|paratha|dosa|idli|poha/.test(nameLC + descLC)) score += 10;
      if (mealTime === "lunch" && /thali|rice|biryani|dal|meal|combo/.test(nameLC + descLC)) score += 10;
      if (mealTime === "snack" && /snack|fries|momos|roll|chaat|shake|juice/.test(nameLC + descLC)) score += 10;
      if (mealTime === "dinner" && /curry|naan|paneer|chicken|butter|tandoor/.test(nameLC + descLC)) score += 10;

      // Small random factor for variety
      score += Math.random() * 3;

      return { ...item.toObject(), score };
    });

    // Sort by score descending and return top 12
    scored.sort((a, b) => b.score - a.score);
    const recommendations = scored.slice(0, 12);

    res.json({
      recommendations,
      basedOn: orders.length > 0 ? "order_history" : "popular",
      totalOrdersAnalyzed: orders.length,
      mealTime,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get recommendations" });
  }
});

module.exports = router;
