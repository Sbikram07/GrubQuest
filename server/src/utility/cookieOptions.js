const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // or "Strict" based on your frontend/backend config
};

module.exports = cookieOptions;
