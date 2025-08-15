const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const createToken = require("../utility/createToken");
const cookieOptions = require("../utility/cookieOptions");

// ------------------ REGISTER ------------------
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPwd,
    });

    const token = createToken(newUser);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------ LOGIN ------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token:token
      },
    });
  } catch (err) {
    // console.log(err)
    res.status(500).json({ message: err.message });
  }
};

// ------------------ LOGOUT ------------------
const logout = (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

// ------------------ GET ME ------------------
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userInfo.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, logout, getMe };
