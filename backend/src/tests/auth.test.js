const request = require("supertest");
const app = require("../app");

describe("Auth routes", () => {
  describe("POST /auth/login", () => {
    it("should return 400 when login input is invalid", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "not-an-email", password: "password" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        status: 400,
        code: "VALIDATION_ERROR"
      });
    });
  });
});

