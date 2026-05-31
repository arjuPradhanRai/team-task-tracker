const router = require("express").Router();
const auth = require('../middleware/auth.middleware')
const {allowRoles} = require('../middleware/role.middleware')
const {createUser,getUsers} = require('../controllers/user.controller')
router.post(
"/",
auth,
allowRoles("ADMIN"),
createUser
);

router.get(
"/",
auth,
allowRoles("ADMIN"),
getUsers
);

module.exports = router;