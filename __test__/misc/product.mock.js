const path = require("path");

exports.payloadNewProduct = {
  name: "Celana Jeans",
  image: path.join(__dirname, "celana.jpg"),
  sell_price: 8000,
  buy_price: 5000,
  category_id: 1,
  amount: 70,
};
