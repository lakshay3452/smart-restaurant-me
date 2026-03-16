const express = require("express");
const Reservation = require("../models/Reservation");
const router = express.Router();

// Create reservation (customer side)
router.post("/", async (req, res) => {
  try {
    const { name, phone, guests, date, time } = req.body;
    if (!name || !phone || !guests || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const reservation = new Reservation({ name, phone, guests, date, time });
    await reservation.save();
    res.json({ message: "Reservation created", reservation });
  } catch (err) {
    res.status(500).json({ message: "Failed to create reservation" });
  }
});

// Get all reservations (admin)
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
});

// Update reservation status (admin)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Reservation updated", reservation });
  } catch (err) {
    res.status(500).json({ message: "Failed to update reservation" });
  }
});

// Delete reservation
router.delete("/:id", async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete reservation" });
  }
});

module.exports = router;
