const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.buffer, {
    use_filename: file.originalname,
    folder: "file-upload",
  });
  return result;
};

const uploadFiles = async (files) => {
  const results = [];
  if (files.length > 1) {
    for (const file of files) {
      const result = await uploadToCloudinary(file);
      results.push(result.secure_url);
    }
    return results;
  } else {
    const singleResult = await uploadToCloudinary(files);
    return singleResult.secure_url;
  }
};

module.exports = { uploadFiles };
