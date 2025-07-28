import express from "express";
import Department from "../models/Department.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalDepartments = await Department.countDocuments();
    const totalEmails = await Department.distinct("email");
    const totalWebsites = await Department.find({
      website_url: { $ne: null, $ne: "" },
    }).distinct("website_url");
    const allBudgets = await Department.find({}, "budget");

    const totalBudget = allBudgets.reduce((sum, item) => sum + (item.budget || 0), 0);

    res.json({
      totalDepartments,
      totalEmails: totalEmails.length,
      totalWebsites: totalWebsites.length,
      totalBudget,
    });
  } catch (err) {
    res.status(500).json({ error: "Stats fetch failed" });
  }
});

export default router;
