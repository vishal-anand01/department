// backend/routes/AppRoutes.js
import express from "express";
import pool from "../db/db.js";

const router = express.Router();

// ✅ POST - Submit department form (insert into department_form_submissions)
router.post("/submit", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    department,
    websiteUrl,
    createdDate,
    budget,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO department_form_submissions (
        first_name, last_name, email, phone,
        department, website_url, created_date, budget
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        firstName,
        lastName,
        email,
        phone,
        department,
        websiteUrl,
        createdDate,
        budget,
      ]
    );

    res.status(201).json({
      message: "✅ Department form submitted successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error inserting submission:", error);
    res.status(500).json({ error: "Failed to submit form" });
  }
});

// ✅ GET - All form submissions (from department_form_submissions)
router.get("/submissions", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM department_form_submissions ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

export default router;
