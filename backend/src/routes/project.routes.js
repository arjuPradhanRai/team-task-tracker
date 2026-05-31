const router = require("express").Router();
const auth = require('../middleware/auth.middleware')
const {allowRoles} = require('../middleware/role.middleware')
const {createProject,listProjects} = require('../controllers/project.controller')
router.post(
"/",
auth,
allowRoles(
"ADMIN",
"MANAGER"
),
createProject
);

router.get(
"/",
auth,
listProjects
);

module.exports = router