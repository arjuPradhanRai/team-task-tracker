const router = require("express").Router();
const auth = require('../middleware/auth.middleware')
const {allowRoles} = require('../middleware/role.middleware')
const {createUser,getUsers} = require('../controllers/user.controller')

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MANAGER, MEMBER]
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Forbidden - Only ADMIN can create users
 */
router.post(
"/",
auth,
allowRoles("ADMIN"),
createUser
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden - Only ADMIN can view users
 */
router.get(
"/",
auth,
allowRoles("ADMIN"),
getUsers
);

module.exports = router;