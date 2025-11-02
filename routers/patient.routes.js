const express = require("express");
const {
        getAllPatients,
        getPatientById,
        insertPatient,
        updatePatient,
        deletePatient,
} = require("../controllers/patient.controller");

const router = express.Router();

router.get("/getAll", async (req, res) => {
        let result = await getAllPatients();
        if (!result.success) {
                return res.status(500).json(result);
        }
        res.json(result);
});

router.get("/getById/:id", async (req, res) => {
        let result = await getPatientById(req.params.id);
        if (!result.success) {
                return res.status(404).json(result);
        }
        res.json(result);
});

router.post("/add", async (req, res) => {
        const body = req.body;
        let result = await insertPatient(body);
        if (!result.success) {
                return res.status(400).json(result);
        }
        res.status(201).json(result);
});

router.put("/update/:id", async (req, res) => {
        const body = req.body;
        let result = await updatePatient(req.params.id, body);
        if (!result.success) {
                return res.status(400).json(result);
        }
        res.json(result);
});

router.delete("/delete/:id", async (req, res) => {
        let result = await deletePatient(req.params.id);
        if (!result.success) {
                return res.status(404).json(result);
        }
        res.json(result);
});

module.exports = router;
