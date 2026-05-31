const router = require("express").Router();
const validate =
require("../middleware/validate.middleware");
const {

registerSchema,

loginSchema

} = require("../validations/auth.validation");


const {
    register,
    login,
    refresh,
    logout
} = require("../controllers/auth.controller");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: User registered successfully
 */

router.post(
    "/register",
    validate(registerSchema),
    register
);

router.post(
    "/login",
    validate(loginSchema),
    login
);

router.post("/refresh", refresh);

router.post("/logout", logout);

module.exports = router;