import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import statsRoutes from "./routes/stats.js";
import latestUpdateRoutes from "./routes/s3waasProxy.js";
import cron from "node-cron";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use("/api/departments", departmentRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/lastupdates", latestUpdateRoutes);

// ✅ CRON - Every 5 hours, calls existing route
cron.schedule("0 */5 * * *", async () => {
  try {
    console.log(`[${new Date().toLocaleTimeString()}] ⏳ CRON: Triggering /s3waas-lastupdated...`);
    await axios.get(`http://localhost:${PORT}/api/lastupdates/s3waas-lastupdated?token=auto`);
    console.log(`[${new Date().toLocaleTimeString()}] ✅ CRON success!`);
  } catch (err) {
    console.error(`[${new Date().toLocaleTimeString()}] ❌ CRON failed:`, err.message);
  }
});



// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
