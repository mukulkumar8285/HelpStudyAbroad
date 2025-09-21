const userSchema = require("../module/authmodule");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const User = await userSchema.findOne({ email });
    if (!User) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: User._id, email: User.email },
      process.env.JWT_SECRET,
      {
        expiresIn: 3600,
      }
    );

    res.status(200).json({ message: "Login successful", token: token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email and password are required" });
  }

  try {
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userSchema({ email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({
        id: newUser._id,
        email: newUser.email,
        message: "User registered successfully",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { login, register };
