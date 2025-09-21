// controllers/courseController.js
const courseService = require("../services/courseService.js");
const elasticService = require("../services/elasticService.js");
const cacheService = require("../services/cacheService.js");

exports.uploadCourses = async (req, res) => {
  try {
    const courses = await courseService.saveCoursesFromCSV(req.file.path);
    console.log(courses);
    await elasticService.bulkIndex(courses);

    res.json({ success: true, count: courses.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchCourses = async (req, res) => {
  const { Program_Name, University, Description, Level, Program_Type, Subject_Area } = req.query;

  try {
    const results = await elasticService.search({
      Program_Name,
      University,
      Description,
      Level,
      Program_Type,
      Subject_Area,
    });
    res.json(results);
  } catch (err) {
    console.error("Controller search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};

