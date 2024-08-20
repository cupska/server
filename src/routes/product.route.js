const express = require("express");
const path = require("path");
const router = express.Router();
const productController = require("../controller/product.controller");
const authController = require("../controller/auth.controller");
const { z } = require("zod");
const { addProductSchema } = require("../lib/zod/product.validation");
const { upload } = require("../middleware/uploadHandler");
const { tokenValidator } = require("../middleware/token/tokenValidator");
const db = require("../../config/db");
const fs = require("fs");
const fastcsv = require("fast-csv");

// START
router.use("/img", express.static(path.join(__dirname, "../../.uploads")));

router.get("/products", authController.validate, productController.getProducts);

router.get(
  "/products/:id",
  authController.validate,
  productController.getProductById
);

router.get(
  "/export-csv",
  authController.validate,
  productController.exportFile
);

router.post(
  "/product",
  authController.validate,
  upload.single("image"),
  (err, req, res, next) => {
    if (err) {
      err.statusCode = 400;
      next(err);
    }
    next();
  },
  productController.addProduct
);

router.put(
  "/products/:id",
  authController.validate,
  upload.single("image"),
  productController.updateProduct
);

router.delete(
  "/products/:id",
  authController.validate,
  productController.deleteProduct
);

module.exports = router;
