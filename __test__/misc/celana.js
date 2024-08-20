const fs = require("fs");
const tangImg = fs.readFileSync(__dirname + "/Tang.jpg");
const path = require("path");

exports.payloadNewProduct = {
  name: "Tang",
  image: path.join(__dirname, "Tang.jpg"),
  sell_price: 8000,
  buy_price: 5000,
  category_id: 1,
  amount: 70,
};
