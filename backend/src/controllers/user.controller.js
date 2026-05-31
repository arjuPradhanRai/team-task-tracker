const prisma = require("../utils/prismaClient");
const bcrypt=require("bcrypt");

exports.createUser=async(req,res,next)=>{

try{

const {

name,
email,
password,
role

}=req.body;

const hashed=
await bcrypt.hash(password,10);

const user=
await prisma.user.create({

data:{

name,

email,

password:hashed,

role,

organizationId:
req.user.organizationId

}

});

res.status(201).json(user);

}catch(err){

next(err);

}

}

exports.getUsers=async(req,res,next)=>{

try{

const users=
await prisma.user.findMany({

where:{

organizationId:
req.user.organizationId

},

select:{

id:true,

name:true,

email:true,

role:true

}

});

res.json(users);

}catch(err){

next(err);

}

}