const supertest = require("supertest");
const db = require("../config/db");
const app = require("../src/app");

// describe("GET PRODUCTS", () => {
//   // it("return produk", async () => {
//   //   const product = await supertest(app).get("/api/products").expect(200);
//   //   console.log(product.body);
//   // });
//   afterAll(() => db.end());
//   it("", async () => {
//     const res = await supertest(app)
//       .get("/api/products")
//       .query({ category: 3 })
//       .expect(200)
//       .catch((err) => console.log(err));
//     console.log(res.body);
//   });
// });

const payloadProducts = [
  {
    name: "bajuw",
    image: "zxc",
    sell_price: 8000,
    buy_price: 5000,
    category_id: 1,
    amount: 70,
  },
  {
    name: "celanaw",
    image: "zxc",
    sell_price: 8000,
    buy_price: 5000,
    category_id: 1,
    amount: 70,
  },
  {
    name: "ikat pinggaw",
    image: "zzz",
    amount: 60,
    sell_price: 12000,
    buy_price: 5000,
    category_id: 1,
  },
];

// describe("UPDATE Product", () => {
//   it("", async () => {
//     const res = await supertest(app)
//       .put("/api/products/1")
//       .send({ name: "mantap" });
//   });
// });

describe("POST", () => {
  it("", async () => {
    // try {
    await supertest(app)
      .post("/api/products")
      .send(payloadProducts)
      .expect(201);
  });
});
