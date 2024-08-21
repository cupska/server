const { request } = require("express");
const db = require("../../config/db");

async function addImage(originalname, buffer) {
  const { rows } = await db.query(
    `INSERT INTO public."image" VALUES ($1,$2) RETURNING name`,
    [originalname, buffer]
  );
  return { name: rows[0].name };
}

async function delImage(imageName) {
  await db.query(`DELETE FROM public."image" WHERE name = $1`, [imageName]);
}

module.exports = {
  addImage,
  delImage,
};
