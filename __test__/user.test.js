const supertest = require("supertest");
const db = require("../config/db");
const userController = require("../src/controller/user.controller");
const app = require("../src/app");
const { updateUser } = require("../src/model/user.model");
const jwt = require("jsonwebtoken");

const user = {
  fullname: "usertest1",
  image: "",
  role: "admin",
  username: "@usertest",
  password: "user123",
};
let client = {};
describe("/register, POST", () => {
  beforeAll(async () => {
    try {
      const res = await db.query(
        "DELETE FROM public.user WHERE username = $1",
        [user.username]
      );

      console.log("berhasil hapus user");
    } catch (error) {
      console.error("gagal hapus user", error);
    }
  });

  it("membuat user", async () => {
    const res = await supertest(app)
      .post("/api/auth/registration")
      .send(user)
      .expect(201);
    // console.log(res.body);
    // document.cookie = `token=${token}`;
    client["userId"] = res.body.data.id;
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("fullname");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data).not.toHaveProperty("password");
    expect(res.body).toHaveProperty("error");
  });
});

describe("/login, POST", () => {
  it("", async () => {
    const res = await supertest(app)
      .post("/api/auth/login")
      .send({ username: user.username, password: user.password })
      .expect(200);
    expect(res.text).toEqual("mantap");
  });
});

describe("/user, PUT", () => {
  const nameTo = "userUpdated";

  it("UPDATE fullname menjadi: " + nameTo, async () => {
    console.log(client.userId);
    const res = await supertest(app)
      .put(`/api/user/${client.userId}`)
      .send({ fullname: nameTo })
      .expect(200);
    console.log(res.body);
  });
});

describe("/user/check, untuk cek ketersediaan username", () => {
  it("should return true", async () => {
    const res = await userController.usernameCheck({
      params: { username: "yusuf.kurn" },
    });
    expect(res).toBeTruthy();
  });
});
