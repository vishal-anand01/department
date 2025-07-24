import express from "express";
import pool from "../db/db.js";

const router = express.Router();

// ✅ POST - Add new department
router.post("/", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    department,
    websiteUrl,
    createdDate,
    budget
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO department_form_submissions (
        first_name, last_name, email, phone,
        department, website_url, created_date, budget
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [firstName, lastName, email, phone, department, websiteUrl, createdDate, budget]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error inserting department:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET all departments
router.get("/", async (req, res) => {
  try {
    const totalDepartments = await pool.query("SELECT COUNT(*) FROM department_form_submissions");
    const totalEmails = await pool.query("SELECT COUNT(DISTINCT email) FROM department_form_submissions");
    const totalWebsites = await pool.query("SELECT COUNT(DISTINCT website_url) FROM department_form_submissions WHERE website_url IS NOT NULL AND website_url != ''");
    const totalBudget = await pool.query("SELECT COALESCE(SUM(budget), 0) FROM department_form_submissions");

    res.json({
      totalDepartments: parseInt(totalDepartments.rows[0].count),
      totalEmails: parseInt(totalEmails.rows[0].count),
      totalWebsites: parseInt(totalWebsites.rows[0].count),
      totalBudget: parseFloat(totalBudget.rows[0].coalesce),
    });
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ error: "Stats fetch failed" });
  }
});

// ✅ DELETE a department
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM department_form_submissions WHERE id = $1", [id]);
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// ✅ PUT - Update department
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phone,
    department,
    websiteUrl,
    createdDate,
    budget
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE department_form_submissions SET
        first_name = $1,
        last_name = $2,
        email = $3,
        phone = $4,
        department = $5,
        website_url = $6,
        created_date = $7,
        budget = $8
      WHERE id = $9 RETURNING *`,
      [firstName, lastName, email, phone, department, websiteUrl, createdDate, budget, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

export default router;
