const fs = require ("fs");
const csv = require ("csv-parser");
const Course = require ("../module/course");

const saveCoursesFromCSV = (filePath) =>
  new Promise((resolve, reject) => {
    const courses = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => courses.push(row))
      .on("end", async () => {
        try {
          const inserted = await Course.insertMany(courses);
          resolve(inserted);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
module.exports = { saveCoursesFromCSV };