const jwt = require("jsonwebtoken");

const requireLogin = (req, res, next) => {
  const token = req.cookies.token;
  //
  //
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please log in.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
//  console.log("Decoded JWT:", decoded);
   req.userInfo = {
     id: decoded.id,
     role: decoded.role,
     email: decoded.email,
   };


    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = requireLogin;
