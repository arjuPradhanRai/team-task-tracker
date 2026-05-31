const request = require("supertest");
const app = require("../app");

describe("Task status route", () => {
  describe("PATCH /tasks/:id/status", () => {
    it("should return 401 when no auth token is provided", async () => {
      const response = await request(app)
        .patch("/tasks/1/status")
        .send({ status: "IN_PROGRESS" });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        status: 401,
        code: "UNAUTHORIZED"
      });
    });

    it("should return 401 for an invalid auth token", async () => {
      const response = await request(app)
        .patch("/tasks/1/status")
        .set("Authorization", "Bearer invalid-token")
        .send({ status: "IN_PROGRESS" });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        status: 401,
        code: "INVALID_TOKEN"
      });
    });
  });
});
