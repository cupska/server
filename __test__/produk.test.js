const supertest = require("supertest");
const db = require("../config/db");
const app = require("../src/app");
const path = require("path");
const { payloadNewProduct } = require("./misc/product.mock");
const { MSG_BERHASIL_COMMON } = require("../general/constants");
const { login } = require("../src/controller/auth.controller");
const { request } = require("express");
const { config } = require("dotenv");

config();

const accessToken = process.env.TOKEN_TEST;

let productCreated = { id: "" };

describe("CRUD PRODUCT", () => {
  afterAll(() => db.end());
  describe("ADD /api/product", () => {
    const url = "/api/product";
    const { image, ...restPayload } = payloadNewProduct;
    const overLimitImage = path.join(__dirname, "misc", "celanaLebih1MB.jpg");

    it('image size > limit size : return error "File too large"', async () => {
      const response = await supertest(app)
        .post(url)
        .attach("image", overLimitImage)
        .field(restPayload)
        .expect(400);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("error");
      expect(response.body.error.message).toBe("File too large");
    });
    it('image size < limit size :  return message "success"', async () => {
      const response = await supertest(app)
        .post(url)
        .attach("image", image)
        .field(restPayload)
        .expect(201);
      productCreated.id = response.body.data.product.id;
      expect(response.body).toHaveProperty("data");
      expect(response.body.data.message).toBe(MSG_BERHASIL_COMMON);
      expect(response.body.data).toHaveProperty("product", {
        id: expect.any(Number),
      });
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBeFalsy();
    });
  });

  describe("GET /api/products/:id", () => {
    const baseUrl = "/api/products/";
    it(" return Error message 'Produk tidak ditemukan' dan statusCode 404", async () => {
      const unExistId = 999999;
      const response = await supertest(app)
        .get(baseUrl + unExistId)
        .expect(404);
      expect(Object.keys(response.body)).toEqual(["data", "error"]);
      expect(response.body.error.message).toBe("Produk tidak ditemukan");
    });
    it("return one product", async () => {
      const id = productCreated.id;
      const response = await supertest(app)
        .get(baseUrl + id)
        .expect(200);

      expect(Object.keys(response.body)).toEqual(["data", "error"]);
      expect(Object.keys(response.body.data)).toEqual(
        expect.arrayContaining([
          "id",
          "name",
          "image",
          "amount",
          "category_id",
          "sell_price",
          "buy_price",
          "created_at",
          "updated_at",
        ])
      );
    });
  });

  describe("UPDATE /api/products/:id", () => {
    const existingProduct = productCreated;
    const payloadUpdate = { name: "kaos kaki" };
    it(" update nama product yang di post pada test diatas kemudian get kembali dengan id yang sama untuk kemudian mendapatkan perubahan nama sesuai payload untuk update ", async () => {
      const res = await supertest(app)
        .put("/api/products/" + existingProduct.id)
        .send(payloadUpdate)
        .expect(200);
      expect(res.body.data.message).toEqual("Berhasil ubah produk");
    });
    it(" get product dengan di yang telah di update dan compare payloadUpdate dengan data terbaru dari response", async () => {
      const updatedProduct = await supertest(app)
        .get("/api/products/" + existingProduct.id)
        .expect(200);
      expect(updatedProduct.body.data.name).toEqual(payloadUpdate.name);
    });
  });

  describe("GET /api/products", () => {
    it(" set access token and return data:array product and pagination includes filter ", async () => {
      const response = await supertest(app)
        .get("/api/products")
        .set("Cookie", `token=${accessToken}`)
        .expect(200);
      expect(Object.keys(response.body)).toEqual([
        "data",
        "pagination",
        "error",
      ]);
      expect(Object.keys(response.body.pagination)).toEqual([
        "limit",
        "page",
        "pageRow",
        "totalRow",
        "filter",
      ]);
      expect(Object.keys(response.body.pagination.filter)).toEqual([
        "title",
        "category_id",
      ]);
    });
  });

  describe("export to csv  /api/export-csv", () => {
    it("return to download file", async () => {
      const res = await supertest(app).get("/api/export-csv").expect(200);
      // console.log(res.body, "download");
    });
  });

  describe("Delete /api/products/:id", () => {
    it(" hapus product yang sudah dibuat(productCreated)", async () => {
      const { id } = productCreated;
      const response = await supertest(app)
        .delete("/api/products/" + id)
        .expect(200);

      expect(response.body.data.message).toEqual("Berhasil hapus");
    });
    it(" get kembali product yang sudah dihapus(productCreated)", async () => {
      await supertest(app)
        .get("/api/products/" + productCreated.id)
        .expect(404);
    });
  });
});
