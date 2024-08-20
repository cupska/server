const path = require("path");
const multer = require("multer");
const { IMAGE_LIMIT } = require("../../general/constants");

const storage = multer.diskStorage({
  destination: "./.uploads/",
  filename: (req, file, cb) => {
    console.log(file);
    return cb(null, `${file.fieldname}_${Date.now()}.png`);
  },
});
exports.upload = multer({
  storage,
  limits: { fileSize: IMAGE_LIMIT },
});
