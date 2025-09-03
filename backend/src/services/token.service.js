const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { RefreshToken } = require('../models');

function signAccessToken(user) {
  const payload = { sub: user.id, role: user.role, email: user.email };
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_EXPIRES || '15m' });
}

async function issueRefreshToken(user) {
  const token = uuidv4();
  const expiryDate = new Date();
  const days = parseInt(process.env.REFRESH_EXPIRES_DAYS || '7', 10);
  expiryDate.setDate(expiryDate.getDate() + days);
  await RefreshToken.create({ userId: user.id, token, expiryDate });
  return token;
}

module.exports = { signAccessToken, issueRefreshToken };
