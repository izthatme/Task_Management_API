// src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

function signAccessToken(user) {
  const payload = { id: user.id, role: user.role };
  const secret = process.env.JWT_ACCESS_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES || "15m";
  return jwt.sign(payload, secret, { expiresIn });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already used" });

    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);
    const hash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      passwordHash: hash,
      role: role || "User",
    });

    const accessToken = signAccessToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,              // JS se readable nahi (secure)
      secure: true, // HTTPS par true, local HTTP par false
      sameSite: "none",
      maxAge: 15 * 60 * 1000,      // 15 minutes
    });

    // Optional: implement refresh tokens later
    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {

  console.log("hiiii", req.cookies);
  
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (e) {
    next(e);
  }
};

// Placeholder for refresh (implement if storing refresh tokens)
exports.refresh = async (req, res) => {
  return res.status(501).json({ message: "Refresh not implemented" });
};
