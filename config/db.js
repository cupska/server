const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({ connectionString: process.env.PG_URL });
// db.on(("connect", ) => console.log("db Connected"));

module.exports = db;
