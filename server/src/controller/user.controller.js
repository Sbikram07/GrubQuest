const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { uploadToCloudinary } = require("../utility/cloudinary.helper");

// ✅ Update Profile

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, phone, address } = req.body;

    // Prepare update data
    let updateData = { name, phone , address };

    // If a file is uploaded, upload to Cloudinary
    if (req.file) {
      // console.log(req.file);
      const { url, publicId } = await uploadToCloudinary(
        req.file.path,
        "GrubQuest/avatars"
      );

      updateData.avatar = {
        url,
        public_id: publicId, // match your schema field name
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Delete Profile
const deleteProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Change Password
const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRoleToAgent = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If already an agent
    if (user.role === "agent") {
      return res.status(400).json({
        success: false,
        message: "User is already a delivery agent",
      });
    }

    user.role = "deliveryAgent";
    user.isActive = true; // optional: to mark them as available
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated to delivery agent",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  updateProfile,
  deleteProfile,
  changePassword,
  updateRoleToAgent
};
