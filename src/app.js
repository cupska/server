const { config } = require("dotenv");
const cors = require("cors");
const express = require("express");
const userRouter = require("./routes/user.route.js");
const authRouter = require("./routes/auth.route.js");
const productRouter = require("./routes/product.route.js");
const categoryRouter = require("./routes/category.route.js");
const authController = require("./controller/auth.controller.js");
const { errorHandler } = require("./middleware/errorHandler.js");
const app = express();
config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.info("SERVER berjalan pada port: ", PORT);
});

module.exports = app;
