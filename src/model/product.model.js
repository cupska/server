const db = require("../../config/db");

async function getProducts(limit, page, title = "", category_id = 0) {
  const offset = (page - 1) * limit;
  const filterSql = `LIMIT ${limit} OFFSET ${offset}`;
  const conditionSql = `(p.name ILIKE '${title}%' OR p.name ILIKE '% ${title}%' OR p.name ILIKE '% ${title}') ${
    category_id != 0 ? `AND p.category_id = ${category_id}` : ""
  }`;
  const joinSql = `INNER JOIN public."category" c ON p.category_id = c.id`;

  const transaction = db.connect();
  try {
    const { rows, rowCount } = await db.query(
      `SELECT p.*,c.name as category_name FROM public."product" p ${joinSql} WHERE ${conditionSql} ORDER BY name ASC ${filterSql}`
    );
    const {
      rows: [totalRow],
    } = await db.query(
      `SELECT COUNT(*) FROM public."product" p WHERE ${conditionSql} `
    );
    // console.log(rows);
    return { data: rows, rowCount, totalRow: Number(totalRow.count) };
  } catch (error) {
    error.statusCode = 400;
    throw error;
  } finally {
    (await transaction).release();
  }
}

async function getProductById(id) {
  return await db.query(`SELECT * FROM public."product" WHERE id = ${id}`);
}

async function addProducts(
  payload = { name, image, sell_price, buy_price, amount, category_id }
) {
  const { amount, buy_price, category_id, image, name, sell_price } = payload;
  const payloadToArr = [
    name,
    image,
    sell_price,
    buy_price,
    amount,
    category_id,
  ]; // biar urut
  const reduc = `(${payloadToArr.map((val) => `'${val}'`).join()})`;
  await db.query(
    `INSERT INTO public."product"(name,image,sell_price,buy_price,amount,category_id) VALUES ${reduc}`
  );
}

async function updateProducts(id, payload = {}) {
  let set = [];
  for (const [key, val] of Object.entries(payload)) {
    set.push(`${key}='${val}'`);
  }
  return await db.query(
    `UPDATE public."product" SET ${set.join()} WHERE id = ${id}`
  );
}

async function deleteProduct(id) {
  await db.query(`DELETE FROM public."product" WHERE id = $1`, [id]);
}

async function getProductImageById(id) {
  return await db.query(`SELECT image FROM public."product" WHERE id = $1`, [
    id,
  ]);
}

module.exports = {
  getProducts,
  getProductById,
  getProductImageById,
  addProducts,
  deleteProduct,
  updateProducts,
};
