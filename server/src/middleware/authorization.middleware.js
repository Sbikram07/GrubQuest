// isOwner => user can only access their own profile
const isOwner = (req, res, next) => {
  const requestedUserId = req.params.id;
  const loggedInUserId = req.userInfo.id;

  if (requestedUserId !== loggedInUserId) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this resource",
    });
  }

  next();
};

module.exports = { isOwner };
