const db = require("../../config/db");

async function getCategoryModel() {
  return (await db.query(`SELECT * FROM public."category"`)).rows;
}
module.exports = { getCategoryModel };
