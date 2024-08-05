const { getCategory } = require("../controller/category.controller");

const router = require("express").Router();

router.get("/category", getCategory);

module.exports = router;
