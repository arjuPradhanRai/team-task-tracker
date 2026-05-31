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

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *       403:
 *         description: Forbidden - Only ADMIN and MANAGER can create tasks
 */
router.post(
"/",
auth,
allowRoles(
"ADMIN",
"MANAGER"
),
task.createTask
);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         description: Unauthorized
 */
router.get(
"/",
auth,
task.listTasks
);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 */
router.get(
"/:id",
auth,
task.getTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       403:
 *         description: Forbidden - Only ADMIN and MANAGER can update tasks
 */
router.put(
"/:id",
auth,
allowRoles(
"ADMIN",
"MANAGER"
),
task.updateTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       403:
 *         description: Forbidden - Only ADMIN can delete tasks
 */
router.delete(
"/:id",
auth,
allowRoles(
"ADMIN"
),
task.deleteTask
);

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Change task status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED]
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       403:
 *         description: Forbidden - Invalid status transition
 */
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