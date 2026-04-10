const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");

// Get all conversations (admin) - grouped by conversationId
// IMPORTANT: This must be BEFORE /:conversationId to avoid being caught by the wildcard
router.get("/admin/conversations", async (req, res) => {
  try {
    const conversations = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$message" },
          lastSender: { $first: "$sender" },
          lastTime: { $first: "$createdAt" },
          senderEmail: { $first: "$senderEmail" },
          unreadCount: {
            $sum: { $cond: [{ $and: [{ $eq: ["$sender", "user"] }, { $eq: ["$read", false] }] }, 1, 0] }
          }
        }
      },
      { $sort: { lastTime: -1 } }
    ]);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

// Get messages for a conversation
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// Send a message
router.post("/", async (req, res) => {
  try {
    const { conversationId, sender, senderEmail, message } = req.body;
    if (!conversationId || !sender || !message) {
      return res.status(400).json({ message: "conversationId, sender, and message required" });
    }
    const msg = await ChatMessage.create({ conversationId, sender, senderEmail, message });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Mark messages as read
router.put("/read/:conversationId/:reader", async (req, res) => {
  try {
    const otherSender = req.params.reader === "admin" ? "user" : "admin";
    await ChatMessage.updateMany(
      { conversationId: req.params.conversationId, sender: otherSender, read: false },
      { read: true }
    );
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

module.exports = router;
