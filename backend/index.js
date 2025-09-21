const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const { File } = require('undici/lib/fetch/file.js'); 
global.File = File;
const PORT = 3000;

dotenv.config();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", require("./router/authrouter"));
app.use("/api", require("./router/recommendationrouter"));
app.use("/api/courses",require("./router/courserouter"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
