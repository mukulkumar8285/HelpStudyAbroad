const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  course_id: { type: String, required: true, unique: true },
  Program_Name: { type: String, required: true },
  University: { type: String, required: true },
  Description: { type: String },
  Level: { type: String },
  Duration_Months: { type: Number },
  Language: { type: String },
  Cost_USD_Per_Year: { type: Number },
  Application_Deadline: { type: String  },
  Program_Type: { type: String },
  Subject_Area: { type: String },
});

module.exports = mongoose.model("Course", courseSchema);
