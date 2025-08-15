const authorized = (...roles) => {
  return (req, res, next) => {
    const userRole = req.userInfo?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not authorized for this action.",
      });
    }

    next();
  };
};

module.exports = authorized;
