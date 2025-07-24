// backend/routes/AppRoutes.js
import express from "express";
import pool from "../db/db.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO submissions (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [name, email, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/submissions", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM submissions ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
