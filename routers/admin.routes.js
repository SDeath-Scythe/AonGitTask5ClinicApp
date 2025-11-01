const express = require("express");
const {
  getAllAdmins,
  getAdminById,
  insertAdmin,
  deleteAdmin,
  generateOTP,
  verifyOTP,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/getAll", async (req, res) => {
  let result = await getAllAdmins();
  if (!result.success) {
    return res.status(500).json(result);
  }
  res.json(result);
});

router.get("/getById/:id", async (req, res) => {
  let result = await getAdminById(req.params.id);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json(result);
});

router.post("/add", async (req, res) => {
  const body = req.body;
  let result = await insertAdmin(body);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.status(201).json(result);
});

router.delete("/delete/:id", async (req, res) => {
  let result = await deleteAdmin(req.params.id);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json(result);
});

// OTP Generation Route
router.post("/otp/generate", async (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }
  
  const result = await generateOTP(phone);
  
  if (result.error) {
    return res.status(404).json(result);
  }
  
  res.json(result);
});

// OTP Verification Route
router.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  
  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone and OTP are required" });
  }
  
  const result = await verifyOTP(phone, otp);
  
  if (result.error) {
    return res.status(401).json(result);
  }
  
  res.json(result);
});

module.exports = router;
