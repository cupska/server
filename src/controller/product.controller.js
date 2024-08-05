const { request, response } = require("express");
const productModel = require("../model/product.model");
const { deleteFile } = require("../middleware/deleteFile");

async function getProducts(req = request, res = response, next) {
  const { limit = 5, page = 1, title, category } = req.query;
  try {
    const { rowCount, data, totalRow } = await productModel.getProducts(
      limit,
      page,
      title,
      category
    );
    res
      .status(200)
      .json({ data, paging: { limit, page, rowCount, totalRow, title } });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req = request, res = response, next) {
  const { params } = req;
  try {
    const { rows } = await productModel.getProductById(params.id);
    res.status(200).json({ data: rows[0], error: null });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
}

async function addProducts(req = request, res = response, next) {
  const { body } = req;
  try {
    await productModel.addProducts({ image: req.file.filename, ...body });
    res.status(201).json({ data: "Berhasil tambah produk", error: null });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function updateProduct(
  { body, params: { id: productId }, file, files } = (req = request),
  res = response,
  next
) {
  console.log(body, file, files);

  try {
    const { rows } = await productModel.updateProducts(productId, {
      image: String(file.filename),
      ...body,
    });
    res.status(200).json({ data: "Berhasil ubah produk", error: null });
    console.log(body, productId, rows);
  } catch (error) {
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
    res.json({ data: "berhasil hapus", error: null });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductById,
  addProducts,
  deleteProduct,
  updateProduct,
};
