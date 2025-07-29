import express from "express";
import axios from "axios";
import bcrypt from "bcryptjs";
import LastUpdated from "../models/LastUpdated.js";

const router = express.Router();

const DOMAIN_LIST = [ /* 🎯 Keep all domains here */
  "cm.uk.gov.in", "agriculture.uk.gov.in", "ahd.uk.gov.in", "budget.uk.gov.in",
  "cooperative.uk.gov.in", "dda.uk.gov.in", "dgm.uk.gov.in", "ekosh.uk.gov.in",
  "excise.uk.gov.in", "fcs.uk.gov.in", "govtpress.uk.gov.in", "he.uk.gov.in",
  "health.uk.gov.in", "highcourtofuttarakhand.gov.in", "20pt.uk.gov.in", "ceo.uk.gov.in",
  "des.uk.gov.in", "dte.uk.gov.in", "irrigation.uk.gov.in", "medicaleducation.uk.gov.in",
  "nccdte.uk.gov.in", "peyjal.uk.gov.in", "schooleducation.uk.gov.in", "sec.uk.gov.in",
  "sugarcane.uk.gov.in", "transport.uk.gov.in", "ubs.uk.gov.in", "labour.uk.gov.in",
  "minoritywelfare.uk.gov.in", "nhm.uk.gov.in", "prison.uk.gov.in", "registration.uk.gov.in",
  "rojgar.uk.gov.in", "rwd.uk.gov.in", "sainikkalyan.uk.gov.in", "sbb.uk.gov.in",
  "scdrc.uk.gov.in", "sgst.uk.gov.in", "silk.uk.gov.in", "slsa.uk.gov.in",
  "socialwelfare.uk.gov.in", "tcp.uk.gov.in", "udd.uk.gov.in", "uhuda.uk.gov.in",
  "ujala.uk.gov.in", "ujs.uk.gov.in", "ukrd.uk.gov.in", "urrda.uk.gov.in",
  "utdb.uk.gov.in", "uttarakhandaudit.uk.gov.in", "uttarakhandsugars.uk.gov.in",
  "uttarakhandwaqfboard.uk.gov.in", "swajal.uk.gov.in", "nndehradun.uk.gov.in",
  "bor.uk.gov.in", "uerc.uk.gov.in", "siemat.uk.gov.in", "upcl.uk.gov.in",
  "pwd.uk.gov.in", "sssc.uk.gov.in", "ssa.uk.gov.in", "ukpst.uk.gov.in",
  "fisheries.uk.gov.in", "ubse.uk.gov.in"
];

const loginAndGetToken = async () => {
  const ts = Math.floor(Date.now() / 1000).toString();
  const secret = "NIC-Elastic-V1-mT=rK^T43E@p^PK";
  const raw = ts + secret;
  const hashed = await bcrypt.hash(raw, 12);
  const finalPassword = ts + hashed;

  const loginRes = await axios.post("https://api.s3waas.gov.in/api/v1/login", {
    device_id: "1QD456R3-3H4C-7654-S09UKDEPT",
    password: finalPassword,
  });

  return loginRes.data?.data?.token || loginRes.data?.token;
};

// ✅ POST - Login API
router.post("/s3waas-login", async (req, res) => {
  try {
    const token = await loginAndGetToken();
    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err?.response?.data || err.message);
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ GET - Latest Updates API
// ✅ GET - Latest Updates API (Always show all 66 domains)
router.get("/s3waas-lastupdated", async (req, res) => {
  try {
    let token = req.query.token;

    if (!token || token === "auto") {
      token = await loginAndGetToken();
    }

    const result = [];

    for (const domain of DOMAIN_LIST) {
      try {
        const url = `https://api.s3waas.gov.in/api/v1/s3waas_lastupdated/1QD456R3-3H4C-7654-S09UKDEPT/${domain}`;
        const resp = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const siteData = resp.data?.result?.[0];
        const page = siteData?.data?.last_updated?.page;

        const entry = {
          site_title: siteData?.site_title || domain,
          siteurl: siteData?.siteurl || domain,
          data: siteData?.data || {},
          error: false,
        };

        await LastUpdated.findOneAndUpdate(
          { siteurl: entry.siteurl },
          {
            ...entry,
            fetchedAt: new Date(),
            lastUpdatedAt: new Date(),
          },
          { upsert: true, new: true }
        );

        result.push(entry);
      } catch (err) {
        // ⚠️ If error, still push entry with basic info
        const fallbackEntry = {
          site_title: domain,
          siteurl: domain,
          data: {},
          error: true,
        };

        result.push(fallbackEntry);
        console.warn(`⚠️ Failed to fetch ${domain}:`, err?.response?.data || err.message);
      }
    }

    res.json(result); // Always send full result list
  } catch (err) {
    console.error("Update Fetch Error:", err?.response?.data || err.message);
    res.status(500).json({ message: "Fetch failed" });
  }
});



// ✅ GET - Mongo data only
router.get("/mongo-latest", async (req, res) => {
  try {
    const data = await LastUpdated.find().sort({ site_title: 1 });
    res.json(data);
  } catch (err) {
    console.error("Mongo Fetch Error:", err.message);
    res.status(500).json({ message: "Failed to load from DB" });
  }
});

export default router;
