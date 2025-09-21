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
  const { q, category, instructor } = req.query;
  const cacheKey = `search:${q || ""}:${category || ""}:${instructor || ""}`;

  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const results = await elasticService.search({ q, category, instructor });
  await cacheService.set(cacheKey, JSON.stringify(results), 60);
  res.json(results);
};
