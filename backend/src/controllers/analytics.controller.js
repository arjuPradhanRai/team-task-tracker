const prisma = require("../utils/prismaClient");

exports.getAnalytics = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const now = new Date();

    // Overdue tasks per user (due_date < now and status not DONE)
    const overduePerUser = await prisma.$queryRaw`
      SELECT 
        u.id AS userId,
        u.name,
        u.email,
        COUNT(t.id) AS overdueTasks
      FROM User u
      LEFT JOIN Task t 
        ON t.assigneeId = u.id
        AND t.due_date < ${now}
        AND t.status NOT IN ('DONE', 'BLOCKED')
      WHERE u.organizationId = ${orgId}
      GROUP BY u.id, u.name, u.email
      ORDER BY overdueTasks DESC
    `;

    // Avg completion time in hours (createdAt → updatedAt where status = DONE)
    const avgCompletion = await prisma.$queryRaw`
      SELECT
        u.id AS userId,
        u.name,
        ROUND(
          AVG(
            TIMESTAMPDIFF(HOUR, t.createdAt, t.updatedAt)
          ), 2
        ) AS avgCompletionHours
      FROM Task t
      JOIN User u ON u.id = t.assigneeId
      WHERE t.status = 'DONE'
        AND u.organizationId = ${orgId}
      GROUP BY u.id, u.name
    `;

    // Merge both results by userId
    const completionMap = {};
    for (const row of avgCompletion) {
      completionMap[Number(row.userId)] = Number(row.avgCompletionHours);
    }

    const result = overduePerUser.map((row) => ({
      userId: Number(row.userId),
      name: row.name,
      email: row.email,
      overdueTasks: Number(row.overdueTasks),
      avgCompletionHours: completionMap[Number(row.userId)] ?? null,
    }));

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};