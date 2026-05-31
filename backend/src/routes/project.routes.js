const router = require("express").Router();
const auth = require('../middleware/auth.middleware')
const {allowRoles} = require('../middleware/role.middleware')
const {createProject,listProjects} = require('../controllers/project.controller')

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       403:
 *         description: Forbidden - Only ADMIN and MANAGER can create projects
 */
router.post(
"/",
auth,
allowRoles(
"ADMIN",
"MANAGER"
),
createProject
);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *       401:
 *         description: Unauthorized
 */
router.get(
"/",
auth,
listProjects
);

module.exports = router