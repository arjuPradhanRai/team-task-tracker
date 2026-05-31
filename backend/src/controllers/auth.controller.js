const prisma = require("../utils/prismaClient");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/jwt");

exports.register = async (req, res, next) => {

    try {

        const {
            organizationName,
            name,
            email,
            password
        } = req.body;

        const exists = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (exists) {

            return res.status(400).json({
                status: 400,
                code: "EMAIL_EXISTS",
                message: "Email already exists"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const result =
            await prisma.$transaction(async (tx) => {

                const organization =
                    await tx.organization.create({

                        data: {
                            name: organizationName
                        }

                    });

                const user =
                    await tx.user.create({

                        data: {

                            name,

                            email,

                            password: hashedPassword,

                            role: "ADMIN",

                            organizationId:
                                organization.id
                        }

                    });

                const accessToken =
                    generateAccessToken(user);

                const refreshToken =
                    generateRefreshToken(user);

                await tx.refreshToken.create({

                    data: {

                        token: refreshToken,

                        userId: user.id

                    }

                });

                return {
                    organization,
                    user,
                    accessToken,
                    refreshToken
                };

            });

        return res.status(201).json({

            status: 201,

            message: "Registered",

            user: {

                id: result.user.id,

                email: result.user.email,

                role: result.user.role

            },

            tokens: {

                accessToken:
                    result.accessToken,

                refreshToken:
                    result.refreshToken
            }

        });

    } catch (err) {

        next(err);

    }

};

exports.login = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        const user =
            await prisma.user.findUnique({

                where: {
                    email
                }

            });

        if (!user) {

            return res.status(401).json({

                status: 401,

                code: "INVALID_CREDENTIALS",

                message: "Invalid credentials"

            });

        }
        console.log(user)
        const match =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!match) {

            return res.status(401).json({

                status: 401,

                code: "INVALID_CREDENTIALS",

                message: "Invalid credentials"

            });

        }

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);

        await prisma.refreshToken.create({

            data: {

                token: refreshToken,

                userId: user.id

            }

        });

        return res.json({

            accessToken,

            refreshToken

        });

    } catch (err) {

        next(err);

    }

};


exports.refresh = async (req, res, next) => {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {

            return res.status(401).json({

                status: 401,
                code: "TOKEN_REQUIRED",
                message: "Refresh token required"

            });

        }

        const existing =
            await prisma.refreshToken.findUnique({

                where: {
                    token: refreshToken
                }

            });

        if (!existing) {

            return res.status(401).json({

                status: 401,
                code: "INVALID_REFRESH_TOKEN",
                message: "Token invalid"

            });

        }

        const decoded =
            jwt.verify(
                refreshToken,
                process.env.REFRESH_SECRET
            );

        const user =
            await prisma.user.findUnique({

                where: {
                    id: decoded.id
                }

            });

        const newAccess =
            generateAccessToken(user);

        const newRefresh =
            generateRefreshToken(user);

        await prisma.$transaction([

            prisma.refreshToken.delete({

                where: {
                    token: refreshToken
                }

            }),

            prisma.refreshToken.create({

                data: {

                    token: newRefresh,

                    userId: user.id

                }

            })

        ]);

        return res.json({

            accessToken: newAccess,

            refreshToken: newRefresh

        });

    } catch (err) {

        next(err);

    }

};

exports.logout = async(req,res,next)=>{

try{

const {refreshToken}=req.body;

await prisma.refreshToken.delete({

where:{
token:refreshToken
}

});

res.json({
message:"Logged out"
});

}catch(err){

next(err);

}

}