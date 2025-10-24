const multer = require("multer");
const storage = multer.memoryStorage();

const filterFunction = (req, file, cb) => {
  const options = ["image/png", "image/jpeg", "image/jpg"];
  const maxSize = 1024 * 1024 * 3;
  if (options.includes(file.mimetype) && file.size < maxSize) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: filterFunction });

const uploadMiddleware = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

module.exports = uploadMiddleware;
