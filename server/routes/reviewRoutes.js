const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Menu = require("../models/Menu");
const authMiddleware = require("../middleware/authMiddleware");

// Get all reviews for a menu item
router.get("/item/:menuItemId", async (req, res) => {
  try {
    const reviews = await Review.find({ menuItemId: req.params.menuItemId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all reviews by a user
router.get("/user/all", authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate("menuItemId", "name image");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a review
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { menuItemId, rating, title, comment, images } = req.body;

    if (!menuItemId || !rating) {
      return res.status(400).json({ error: "Menu Item and Rating required" });
    }

    // Check if user already reviewed this item
    const existingReview = await Review.findOne({
      menuItemId,
      userId: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ error: "You already reviewed this item" });
    }

    const review = new Review({
      menuItemId,
      userId: req.user._id,
      userName: req.user.name,
      rating,
      title,
      comment,
      images,
      verified: true,
    });

    await review.save();

    // Update Menu item average rating
    const allReviews = await Review.find({ menuItemId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Menu.findByIdAndUpdate(menuItemId, {
      avgRating: avgRating.toFixed(1),
      reviewCount: allReviews.length,
    });

    res.json({ message: "Review posted successfully", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a review
router.put("/:reviewId", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    Object.assign(review, req.body);
    await review.save();

    // Recalculate menu rating
    const allReviews = await Review.find({ menuItemId: review.menuItemId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Menu.findByIdAndUpdate(review.menuItemId, {
      avgRating: avgRating.toFixed(1),
    });

    res.json({ message: "Review updated", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a review
router.delete("/:reviewId", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const menuItemId = review.menuItemId;
    await Review.findByIdAndDelete(req.params.reviewId);

    // Recalculate rating
    const allReviews = await Review.find({ menuItemId });
    const avgRating =
      allReviews.length > 0
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
        : 0;

    await Menu.findByIdAndUpdate(menuItemId, {
      avgRating,
      reviewCount: allReviews.length,
    });

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark review as helpful
router.put("/:reviewId/helpful", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
