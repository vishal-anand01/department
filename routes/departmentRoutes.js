import express from "express";
import Department from "../models/Department.js";

const router = express.Router();

// POST - Add department
router.post("/", async (req, res) => {
  try {
    const newDept = await Department.create(req.body);
    res.status(201).json(newDept);
  } catch (err) {
    res.status(500).json({ error: "Insert failed" });
  }
});

// GET - All departments
router.get("/", async (req, res) => {
  try {
    const depts = await Department.find().sort({ _id: -1 });
    res.json(depts);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// DELETE - Remove a department
router.delete("/:id", async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// PUT - Update a department
router.put("/:id", async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

export default router;
