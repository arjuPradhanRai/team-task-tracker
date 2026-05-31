const z = require("zod");

exports.registerSchema = z.object({

    organizationName:
        z.string()
        .min(
            2,
            "organizationName minimum 2 chars"
        ),

    name:
        z.string()
        .min(
            2,
            "name minimum 2 chars"
        ),

    email:
        z.email(
            "invalid email"
        ),

    password:
        z.string()
        .min(
            8,
            "password minimum 8 chars"
        )

});

exports.loginSchema = z.object({

    email:
        z.email(
            "invalid email"
        ),

    password:
        z.string()
        .min(
            1,
            "password required"
        )

});