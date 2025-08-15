const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT token for a user.
 *
 * @param {Object} user - Mongoose user object.
 * @param {string} user._id - User's MongoDB ObjectId.
 * @param {string} user.role - User's role (e.g., 'user', 'admin').
 * @param {string} user.email - User's email.
 * @returns {string} JWT token.
 */
const createToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

module.exports = createToken;
