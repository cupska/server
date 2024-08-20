const db = require("../../config/db");

const getUserById = async (id) => {
  return await db.query(`SELECT * FROM public."user" WHERE id = ${id}`);
};
const createUser = async ({
  fullname,
  image,
  role = "admin",
  username,
  password,
}) => {
  const {
    rows: [user],
  } = await db.query(
    `INSERT INTO public."user"(fullname,image,role,username,password) VALUES ($1,$2,$3,$4,$5) RETURNING id,fullname`,
    [fullname, image, role, username, password]
  );
  return user;
};

const getUserByUsername = async ({ username }) => {
  const {
    rows: [userData],
  } = await db.query(
    `SELECT fullname,id,password FROM public."user" WHERE username = $1`,
    [username]
  );
  if (!userData) {
    const err = new Error("Akun tidak terdaftar");
    throw err;
  }
  return userData;
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

const deleteByUsername = async (username) => {
  try {
    await db.query("DELETE FROM public.user WHERE username = $1", [username]);
  } catch (error) {
    console.error("gagal hapus user", error);
  }
};

module.exports = {
  createUser,
  getUserByUsername,
  updateUser,
  usernameCheck,
  getUserById,
  deleteByUsername,
};
