const bcrypt = require('bcryptjs');
const { User, RefreshToken } = require('../models');
const { signAccessToken, issueRefreshToken } = require('./token.service');

async function register({ name, email, password, role }) {
  const exists = await User.findOne({ where: { email } });
  if (exists) throw Object.assign(new Error('Email already registered'), { status: 400 });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: role || 'User' });
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user);
  return { user, accessToken, refreshToken };
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user);
  return { user, accessToken, refreshToken };
}

async function refresh(tokenStr) {
  const row = await RefreshToken.findOne({ where: { token: tokenStr, revokedAt: null }, include: [User] });
  if (!row) throw Object.assign(new Error('Invalid refresh token'), { status: 401 });
  if (RefreshToken.verifyExpiration(row)) throw Object.assign(new Error('Refresh token expired'), { status: 401 });
  row.revokedAt = new Date();
  await row.save();
  const accessToken = signAccessToken(row.User);
  const refreshToken = await issueRefreshToken(row.User);
  return { accessToken, refreshToken };
}

module.exports = { register, login, refresh };
