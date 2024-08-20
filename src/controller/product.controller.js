const { request, response } = require("express");
const productModel = require("../model/product.model");
const { deleteFile } = require("../middleware/deleteFile");
const { ERR_COMMON, MSG_BERHASIL_COMMON } = require("../../general/constants");
const fastcsv = require("fast-csv");
const fs = require("fs");
const { error } = require("console");
const db = require("../../config/db");
const path = require("path");
const { config } = require("dotenv");
config();

async function getProducts(req = request, res = response, next) {
  const { limit, page = 1, title = "", category: category_id = "" } = req.query;
  try {
    const {
      rowCount: pageRow,
      data,
      totalRow,
    } = await productModel.getProducts(limit, page, { title, category_id });
    res.status(200).json({
      data,
      pagination: {
        limit,
        page,
        pageRow,
        totalRow,
        filter: { title, category_id },
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req = request, res = response, next) {
  const { params } = req;
  try {
    console.log(params.id), "sa";
    const product = await productModel.getProductById(params.id);
    if (!product) {
      const err = new Error("Produk tidak ditemukan");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ data: product, error: null });
  } catch (error) {
    next(error);
  }
}

async function addProduct(req = request, res = response, next) {
  const { body } = req;
  try {
    const { id: productId } = await productModel.addProducts({
      image: req.file.filename,
      ...body,
    });
    res.status(201).json({
      data: { product: { id: productId }, message: MSG_BERHASIL_COMMON },
      error: null,
    });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
}

async function updateProduct(
  { body, params: { id: productId }, file, files } = (req = request),
  res = response,
  next
) {
  try {
    if (body == {} && !file) {
      throw new Error("Tidak ada payload. Payload: ", body);
    }
    const {
      rows: [{ image: oldImage }],
    } = await productModel.getProductImageById(productId);
    if (oldImage && fs.existsSync("./.uploads/" + oldImage) && file) {
      await deleteFile("./.uploads/" + oldImage);
    }

    await productModel.updateProducts(productId, {
      ...(file && { image: String(file.filename) }),
      ...body,
    });
    res
      .status(200)
      .json({ data: { message: "Berhasil ubah produk" }, error: null });
  } catch (error) {
    error.statusCode = 400;
    console.log(error);
    next(error);
  }
}

async function deleteProduct(req = request, res = response, next) {
  const { params } = req;
  try {
    const {
      rows: [{ image }],
    } = await productModel.getProductImageById(params.id);
    await productModel.deleteProduct(params.id);
    await deleteFile("./.uploads/" + image);
    res.status(200).json({ data: { message: "Berhasil hapus" }, error: null });
  } catch (error) {
    next(error);
  }
}

const exportFile = async (req = request, res, next) => {
  try {
    const filePath = path.join(__dirname, "produk.csv");

    const { rows } = await db.query(
      `SELECT *,'${process.env.API_URL}/img/' || p.image  AS image  FROM public."product" p`
    );
    const ws = fs.createWriteStream(filePath);

    fastcsv
      .write(rows, { headers: true })
      .pipe(ws)
      .on("finish", () => {
        res.download(filePath, "data.csv", (err) => {
          if (err) {
            next(err);
          }
          fs.unlinkSync(filePath);
        });
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  exportFile,
};
