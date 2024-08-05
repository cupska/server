const { request, response } = require("express");
const { getCategoryModel } = require("../model/category.model");

async function getCategory(req = request, res = response, next) {
  try {
    const data = await getCategoryModel();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategory,
};
