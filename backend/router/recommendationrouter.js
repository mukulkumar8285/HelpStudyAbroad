const express = require("express");
const router = express.Router();
const { recommendation } = require("../controller/recommendation");
// const { authenticateToken } = require("../middleware/middleware");
// Recommendation route
router.post("/recommendation", recommendation);
module.exports = router;
