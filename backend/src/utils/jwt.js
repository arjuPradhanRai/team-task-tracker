const jwt=require("jsonwebtoken");

exports.generateAccessToken=(user)=>{
return jwt.sign(
{
id:user.id,
role:user.role,
organizationId: user.organizationId

},
process.env.JWT_SECRET,
{
expiresIn:"15m"
}
)
}

exports.generateRefreshToken=(user)=>{
return jwt.sign(
{
id:user.id
},
process.env.REFRESH_SECRET,
{
expiresIn:"7d"
}
)
}