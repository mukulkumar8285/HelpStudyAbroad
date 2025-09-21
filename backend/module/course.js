const  mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  course_id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  category: String,
  instructor: String,
  duration: Number,
});

module.exports =  mongoose.model("Course", courseSchema);
