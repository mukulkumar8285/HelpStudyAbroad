const express = require("express");
const router = express.Router();
const { login, register } = require("../controller/auth");
// Login route
router.post("/admin/login", login);
// Register route
router.post("/admin/register", register);
module.exports = router;
