const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const jwtService = {
  verifyAccessToken: (payload) => {
    const decoded = jwt.verify(payload, process.env.ACCESS_TOKEN_SECRET_KEY);
    return decoded;
  },

  verifyRefreshToken: (payload) => {
    try {
      const decoded = jwt.verify(payload, process.env.REFRESH_TOKEN_SECRET_KEY);
      return decoded;
    } catch (error) {
      return false;
    }
  },

  generateAccessToken: (payload) => {
    const access_token = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '5m' }
    );
    return access_token;
  },

  generateRefreshToken: (payload) => {
    const refresh_token = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: '30d' }
    );
    return refresh_token;
  },

  generateAccessTokenFromRefreshToken: function (token) {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
    const accessToken = this.generateAccessToken({
      id: decoded.id,
      username: decoded.username,
      full_name: decoded.full_name,
    });
    return accessToken;
  },
};

module.exports = jwtService;
