const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");
const { getAnalytics } = require("../controllers/analytics.controller");

/**
 * @swagger
 * /analytics:
 *   get:
 *     summary: Get overdue tasks per user and average completion time
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data for the organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       overdueTasks:
 *                         type: integer
 *                       avgCompletionHours:
 *                         type: number
 *                         nullable: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only ADMIN and MANAGER can access analytics
 */
router.get(
  "/",
  auth,
  allowRoles("ADMIN", "MANAGER"),
  getAnalytics
);

module.exports = router;