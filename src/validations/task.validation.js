const z = require("zod");

exports.createTaskSchema = z.object({

    title:
        z.string()
        .min(1, "title required"),

    description:
        z.string()
        .optional(),

    priority:
        z.enum([
            "LOW",
            "MEDIUM",
            "HIGH"
        ]),

    assigneeId:
        z.number(),

    projectId:
        z.number(),

    due_date:
        z.string()
        .datetime()
        .optional()

});