const cloudinary=require("../config/cloudinary")


const uploadToCloudinary = async (localPath, folder) => {
  const result = await cloudinary.uploader.upload(localPath, {
    folder,
  });
   console.log("file uploaded to cloudianry");
  return {
    url: result.secure_url,
    publicId: result.public_id, // ← this line is probably missing or incorrect
  };
};


const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
