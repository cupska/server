const supertest = require("supertest");
const app = require("../src/app");
const { deleteByUsername } = require("../src/model/user.model");
const {
  extractTokenFromCookieHeader,
} = require("../src/utils/extractTokenFromCookieHeader");
const { hashingPw } = require("../src/controller/auth.controller");

const user = {
  fullname: "monanza",
  image: "",
  role: "admin",
  username: "@usertest",
  password: "user123",
};
let client = {};

describe("/register, POST", () => {
  beforeAll(async () => {
    await deleteByUsername(user.username);
  });

  it("CREATE user", async () => {
    const res = await supertest(app)
      .post("/api/auth/registration")
      .send(user)
      .expect(201);
    client["userId"] = res.body.data.id;

    expect(res.body.error).toBeFalsy();
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.data.message).toBe("berhasil buat akun");
  });
});

describe("/login, POST", () => {
  it("Login dan mendapatkan Token JWT di cookie", async () => {
    const res = await supertest(app)
      .post("/api/auth/login")
      .send({ username: user.username, password: user.password })
      .expect(200);

    const token = extractTokenFromCookieHeader(res.headers["set-cookie"]);
    // console.log(token)
    expect(token).toBeTruthy();
    expect(res.body.error).toBeFalsy();
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("error");
    expect(res.body.data.message).toBe("berhasil masuk");
  });
});

// describe("/user, PUT", () => {
//   const nameTo = "userUpdated";

//   it("UPDATE fullname menjadi: " + nameTo, async () => {
//     // console.log(client.userId);
//     const res = await supertest(app)
//       .put(`/api/user/${client.userId}`)
//       .send({ fullname: nameTo })
//       .expect(200);
//     // console.log(res.body);
//   });
// });

// describe("/user/check, untuk cek ketersediaan username", () => {
//   it("should return true", async () => {
//     const res = await userController.usernameCheck({
//       params: { username: "yusuf.kurn" },
//     });
//     expect(res).toBeTruthy();
//   });
// });
