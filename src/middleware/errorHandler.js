const { config } = require("dotenv");
config();

exports.errorHandler = (err, req, res, next) => {
  console.error(err, "handler");

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    data: null,
    error: {
      message,
      ...((process.env.NODE_ENV === "development" || "test") && {
        stack: err.stack,
      }),
    },
  });
};
