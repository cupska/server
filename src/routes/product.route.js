const express = require("express");
const path = require("path");
const router = express.Router();
const productController = require("../controller/product.controller");
const { z } = require("zod");
const { addProductSchema } = require("../lib/zod/product.validation");
const { upload } = require("../middleware/uploadHandler");

// START
router.use("/img", express.static(path.join(__dirname, "../../.uploads")));

router.get("/products", productController.getProducts);

router.get("/products/:id", productController.getProductById);

router.post("/products", upload.single("image"), productController.addProducts);

router.put(
  "/products/:id",
  upload.single("image"),
  productController.updateProduct
);

router.delete("/products/:id", productController.deleteProduct);

router.post("/test", upload.single("gambar"), (req, res) =>
  console.log(req.file, req.files, req.body)
);

module.exports = router;
