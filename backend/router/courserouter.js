const express = require("express");
const multer = require("multer");
const { uploadCourses, searchCourses } = require("../controller/course");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadCourses);
router.get("/search", searchCourses);

module.exports  = router;
// 6379