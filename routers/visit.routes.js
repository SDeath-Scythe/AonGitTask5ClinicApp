const express = require("express");
const {
        getAllVisits,
        getVisitById,
        insertVisit,
        deleteVisit,
} = require("../controllers/visit.controller");

const router = express.Router();

router.get("/getAll", async (req, res) => {
        let result = await getAllVisits();
        if (!result.success) {
                return res.status(500).json(result);
        }
        res.json(result);
});

router.get("/getById/:id", async (req, res) => {
        let result = await getVisitById(req.params.id);
        if (!result.success) {
                return res.status(404).json(result);
        }
        res.json(result);
});

router.post("/add", async (req, res) => {
        const body = req.body;
        let result = await insertVisit(body);
        if (!result.success) {
                return res.status(400).json(result);
        }
        res.status(201).json(result);
});

router.delete("/delete/:id", async (req, res) => {
        let result = await deleteVisit(req.params.id);
        if (!result.success) {
                return res.status(404).json(result);
        }
        res.json(result);
});

module.exports = router;
