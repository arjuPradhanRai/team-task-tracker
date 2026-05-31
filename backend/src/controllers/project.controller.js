const prisma = require("../utils/prismaClient");

exports.createProject=async(req,res,next)=>{
try{
console.log(req.user)
const project=
await prisma.project.create({

data:{

name:req.body.name,

organizationId:
req.user.organizationId

}

});

res.status(201).json(project);

}catch(err){

next(err);

}

}
exports.listProjects=async(req,res,next)=>{

try{

const projects=
await prisma.project.findMany({

where:{

organizationId:
req.user.organizationId

}

});

res.json(projects);

}catch(err){

next(err);

}

}