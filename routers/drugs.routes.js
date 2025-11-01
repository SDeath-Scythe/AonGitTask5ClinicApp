const express = require("express");
const {
  getAllDrugs,
  getDrugsById,
  insertDrug,
  deleteDrug,
} = require("../controllers/drugs.controller");

const router = express.Router();

router.get("/getAll", async (req, res) => {
  let result = await getAllDrugs();
  if (!result.success) {
    return res.status(500).json(result);
  }
  res.json(result);
});

router.get("/getById/:id", async (req, res) => {
  let result = await getDrugsById(req.params.id);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json(result);
});

router.post("/add", async (req, res) => {
  const body = req.body;
  let result = await insertDrug(body);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.status(201).json(result);
});

router.delete("/delete/:id", async (req, res) => {
  let result = await deleteDrug(req.params.id);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json(result);
});

module.exports = router;
