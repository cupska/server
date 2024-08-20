const fs = require("fs/promises");
const { ERR_COMMON } = require("../../general/constants");

exports.deleteFile = async (filePath = "") => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    error.message = ERR_COMMON;
    throw new Error(error);
  }
};
