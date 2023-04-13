import { expect } from "chai";
import supertest from "supertest";

let request;

describe("Ecommerce API test", () => {

  before(() => {request = supertest("http://localhost:8080")});

  describe("GET to /", () => {
    it("should return a 302 code", async () => {
      const response = await request.get("/")
      expect(response.status).to.eql(302);
    })
  });

  describe("POST to /add", () => {
    const testProd = {
      prodName: "test",
      username: "test"
    };
    it("should return a 200 code", async () => {
      const response = await request.post("/add").send(testProd);
      expect(response.status).to.eql(200);
    });
  })

});