import express from "express";
import Menu from "../models/Menu.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await Menu.find();
  res.json(items);
});

router.post("/", async (req, res) => {
  const item = new Menu(req.body);
  await item.save();
  res.json("Item added");
});

export default router;
