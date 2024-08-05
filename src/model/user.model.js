const db = require("../../config/db");

const createUser = async ({ fullname, image, role, username, password }) => {
  const newUser = await db.query(
    `INSERT INTO public."user"(fullname,image,role,username,password) VALUES ($1,$2,$3,$4,$5) RETURNING id,fullname`,
    [fullname, image, role, username, password]
  );
  const { password: passwordCB, ...rest } = newUser.rows[0];
  return rest;
};

const getPayloadLoginByUsername = async ({ username }) => {
  const res = await db.query(
    `SELECT fullname,id,password FROM public."user" WHERE username = $1`,
    [username]
  );
  return res.rows[0];
};

const updateUser = async (id, payload) => {
  const payloadToString = () => {
    let pairs = "";
    for (let key in payload) {
      pairs += `${key}='${payload[key]}',`;
    }

    return pairs.slice(0, -1);
  };
  // console.log(payloadToString());
  const res = await db.query(
    `UPDATE public."user" SET ${payloadToString()} WHERE id = ${Number(id)}`
  );
};

const usernameCheck = async (username = "yusuf.kurn") => {
  const res = await db.query(
    `SELECT EXISTS(SELECT 1 FROM public."user" WHERE username = $1)`,
    [username]
  );
  return res.rows[0].exists;
};

module.exports = {
  createUser,
  getPayloadLoginByUsername,
  updateUser,
  usernameCheck,
};
