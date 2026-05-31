const jwt=require("jsonwebtoken");

module.exports=(req,res,next)=>{

const token=req.headers.authorization?.split(" ")[1];

if(!token){
return res.status(401).json({
status:401,
code:"UNAUTHORIZED",
message:"Missing token"
})
}

try{

const decoded=jwt.verify(
token,
process.env.JWT_SECRET
)

req.user=decoded;

next();

}catch{

return res.status(401).json({
status:401,
code:"INVALID_TOKEN",
message:"Token invalid"
})

}

}