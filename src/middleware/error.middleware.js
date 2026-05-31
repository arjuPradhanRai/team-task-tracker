module.exports = (err, req, res, next) => {

    console.error(err);

     if (err.name === "ZodError") {

        return res.status(400).json({

            status: 400,

            code: "VALIDATION_ERROR",

            message:
                err.issues[0].message

        });

    }


    /*
      Prisma Errors
    */

    if (err.code === "P2002") {

        return res.status(400).json({

            status: 400,

            code: "DUPLICATE_ENTRY",

            message: "Unique field already exists"

        });

    }

    /*
      Validation Errors
    */

    if (err.name === "ZodError") {

        return res.status(400).json({

            status: 400,

            code: "VALIDATION_ERROR",

            message: err.errors[0].message

        });

    }

    /*
      Default Error
    */

    return res.status(
        err.status || 500
    ).json({

        status: err.status || 500,

        code:
            err.code ||
            "INTERNAL_SERVER_ERROR",

        message:
            err.message ||
            "Something went wrong"

    });

};