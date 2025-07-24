import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes/AppRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import statsRoutes from "./routes/stats.js";
import s3waasProxyRoutes from "./routes/s3waasProxy.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/forms", router);
app.use("/api/departments", departmentRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/lastupdates", s3waasProxyRoutes); // ✅ Integrated

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
