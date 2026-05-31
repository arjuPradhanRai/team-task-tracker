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