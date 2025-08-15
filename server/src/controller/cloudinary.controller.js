const fs = require("fs");
const path = require("path");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utility/cloudinary.helper");

// @desc Upload Image to Cloudinary
// @route POST /api/cloudinary/upload
// @access Private (Authenticated users only, ideally)
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    const filePath = req.file.path;
    const folder = req.body.folder || "GrubQuest"; // Optional folder input

    const result = await uploadToCloudinary(filePath, folder);

    // Remove local file after upload
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete Image from Cloudinary
// @route DELETE /api/cloudinary/delete/:publicId
// @access Private (Authenticated users only, ideally admin/owner)
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res
        .status(400)
        .json({ success: false, message: "publicId is required" });
    }

    await deleteFromCloudinary(publicId);

    return res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
