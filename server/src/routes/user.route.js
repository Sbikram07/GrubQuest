const express = require("express");
const router = express.Router();

const {
  updateProfile,
  deleteProfile,
  changePassword,
  updateRoleToAgent,
} = require("../controller/user.controller");

const  requireLogin  = require("../middleware/requireLogin");
const { isOwner } = require("../middleware/authorization.middleware");
const upload = require("../middleware/multer.middleware");

// 🔐 Auth + Authorization (user must be the owner)
router.put("/update/:id", requireLogin, isOwner, upload.single("image"),updateProfile);
router.delete("/delete/:id", requireLogin, isOwner, deleteProfile);
router.put("/change-password/:id", requireLogin, isOwner, changePassword);

// Already implemented earlier:
router.put("/update-role", requireLogin, updateRoleToAgent);

module.exports = router;
