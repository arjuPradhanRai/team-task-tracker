const router=
require("express").Router();

const auth=
require("../middleware/auth.middleware");

const {
allowRoles
}=
require("../middleware/role.middleware");

const task=
require("../controllers/task.controller");

const {
canChangeTaskStatus
} = require(
"../middleware/taskPermission.middleware"
);

router.post(
"/",
auth,
allowRoles(
"ADMIN",
"MANAGER"
),
task.createTask
);

router.get(
"/",
auth,
task.listTasks
);

router.get(
"/:id",
auth,
task.getTask
);

router.put(
"/:id",
auth,
allowRoles(
"ADMIN",
"MANAGER"
),
task.updateTask
);

router.delete(
"/:id",
auth,
allowRoles(
"ADMIN"
),
task.deleteTask
);

router.patch(
"/:id/status",
auth,
allowRoles(
   "ADMIN",
   "MANAGER",
   "MEMBER"
),
canChangeTaskStatus,
task.changeStatus
);
module.exports=router;