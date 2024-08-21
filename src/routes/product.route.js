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

router.get("/img/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const result = await db.query(
      "SELECT name, data FROM public.image WHERE name = $1",
      [name]
    );
    if (result.rows.length > 0) {
      const { name, data } = result.rows[0];

      res.set("Content-Type", "image/jpeg"); // Atur content-type sesuai dengan jenis file (misalnya image/png)
      res.send(data);
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

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
