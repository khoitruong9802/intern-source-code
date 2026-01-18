const { verifyAccessToken } = require('../services/jwtService');

exports.authMiddleware = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    const decoded = verifyAccessToken(accessToken);
    // console.log("Welcome to the protected route! admin info:", decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
