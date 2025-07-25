import express from "express";
import axios from "axios";
import bcrypt from "bcryptjs";
const router = express.Router();

router.post('/s3waas-login', async (req, res) => {
  try {
    const ts = Math.floor(Date.now() / 1000).toString();
    const secret = "NIC-Elastic-V1-mT=rK^T43E@p^PK";
    const raw = ts + secret;
    const hashed = await bcrypt.hash(raw, 12);
    const finalPassword = ts + hashed;

    const loginRes = await axios.post('https://api.s3waas.gov.in/api/v1/login', {
      device_id: "1QD456R3-3H4C-7654-S09UKDEPT",
      password: finalPassword
    });

    const token = loginRes.data?.data?.token || loginRes.data?.token;
    return res.json({ token });
  } catch (err) {
    console.error("Login Error:", err?.response?.data || err.message);
    return res.status(500).json({ message: "Login failed" });
  }
});

router.get('/s3waas-lastupdated', async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).json({ message: "Token missing" });

  try {
    const domains = [
      "cm.uk.gov.in",
      "agriculture.uk.gov.in",
      "ahd.uk.gov.in",
      "budget.uk.gov.in",
      "cooperative.uk.gov.in",
      "dda.uk.gov.in",
      "dgm.uk.gov.in",
      "ekosh.uk.gov.in",
      "excise.uk.gov.in",
      "fcs.uk.gov.in",
      "govtpress.uk.gov.in",
      "he.uk.gov.in",
      "health.uk.gov.in",
      "highcourtofuttarakhand.gov.in",
      "20pt.uk.gov.in",
      "ceo.uk.gov.in",
      "des.uk.gov.in",
      "dte.uk.gov.in",
      "irrigation.uk.gov.in",
      "medicaleducation.uk.gov.in",
      "nccdte.uk.gov.in",
      "peyjal.uk.gov.in",
      "schooleducation.uk.gov.in",
      "sec.uk.gov.in",
      "sugarcane.uk.gov.in",
      "transport.uk.gov.in",
      "ubs.uk.gov.in",
      "labour.uk.gov.in",
      "minoritywelfare.uk.gov.in",
      "nhm.uk.gov.in",
      "prison.uk.gov.in",
      "registration.uk.gov.in",
      "rojgar.uk.gov.in",
      "rwd.uk.gov.in",
      "sainikkalyan.uk.gov.in",
      "sbb.uk.gov.in",
      "scdrc.uk.gov.in",
      "sgst.uk.gov.in",
      "silk.uk.gov.in",
      "slsa.uk.gov.in",
      "socialwelfare.uk.gov.in",
      "tcp.uk.gov.in",
      "udd.uk.gov.in",
      "uhuda.uk.gov.in",
      "ujala.uk.gov.in",
      "ujs.uk.gov.in",
      "ukrd.uk.gov.in",
      "urrda.uk.gov.in",
      "utdb.uk.gov.in",
      "uttarakhandaudit.uk.gov.in",
      "uttarakhandsugars.uk.gov.in",
      "uttarakhandwaqfboard.uk.gov.in",
      "swajal.uk.gov.in",
      "nndehradun.uk.gov.in",
      "bor.uk.gov.in",
      "uerc.uk.gov.in",
      "siemat.uk.gov.in",
      "upcl.uk.gov.in",
      "pwd.uk.gov.in",
      "sssc.uk.gov.in",
      "ssa.uk.gov.in",
      "ukpst.uk.gov.in",
      "fisheries.uk.gov.in",
      "ubse.uk.gov.in"
    ]



    const result = [];

    for (const domain of domains) {

      const url = `https://api.s3waas.gov.in/api/v1/s3waas_lastupdated/1QD456R3-3H4C-7654-S09UKDEPT/${domain}`;
      // const url = `http://localhost:5000/api/v1/s3waas_lastupdated/1QD456R3-3H4C-7654-S09UKDEPT/${domain}`;
      const resp = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const siteData = resp.data?.result?.[0]; // ✅ FIXED

      const page = siteData?.data?.last_updated?.page;

      console.log(`📦 ${domain} response:`, JSON.stringify(resp.data, null, 2));

      if (page?.date) {
        result.push({
          site_title: siteData.site_title || domain,
          siteurl: siteData.siteurl || domain,
          data: siteData.data,
        });
      }
    }

    return res.json({ result });
  } catch (err) {
    console.error("Fetch Error:", err?.response?.data || err.message);
    return res.status(500).json({ message: "Fetch failed" });
  }
});



export default router;
