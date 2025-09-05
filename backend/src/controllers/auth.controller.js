// src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, RefreshToken } = require("../models");
const { signAccessToken, issueRefreshToken } = require("../services/token.service");

function setAuthCookies(res, accessToken, refreshToken) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: (parseInt(process.env.REFRESH_EXPIRES_DAYS || '7', 10)) * 24 * 60 * 60 * 1000,
  });
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
    const refreshToken = await issueRefreshToken(user);
    setAuthCookies(res, accessToken, refreshToken);
    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ where: { email } });

    
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = await issueRefreshToken(user);
    setAuthCookies(res, accessToken, refreshToken);
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (e) {
    next(e);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const incoming = req.body?.refreshToken || req.cookies?.refreshToken;
    if (!incoming) return res.status(401).json({ message: 'No refresh token' });
    const row = await RefreshToken.findOne({ where: { token: incoming, revokedAt: null }, include: [User] });
    if (!row) return res.status(401).json({ message: 'Invalid refresh token' });
    if (RefreshToken.verifyExpiration(row)) return res.status(401).json({ message: 'Refresh token expired' });
    row.revokedAt = new Date();
    await row.save();
    const accessToken = signAccessToken(row.User);
    const newRefresh = await issueRefreshToken(row.User);
    setAuthCookies(res, accessToken, newRefresh);
    return res.json({ accessToken, refreshToken: newRefresh });
  } catch (e) { next(e); }
};

exports.logout = async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ success: true });
};
