const path = require("path");
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./.uploads"); // Direktori penyimpanan file yang diunggah
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // Menyimpan file dengan nama unik
//   },
// });
exports.upload = multer({ dest: "./.uploads/" });
