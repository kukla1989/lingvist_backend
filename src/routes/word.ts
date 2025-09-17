import { Router } from "express";
import Word from "../models/word";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const words = await Word.findAll();
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch words" });
  }
});

export default router;
