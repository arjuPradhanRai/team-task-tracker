const prisma=require("../utils/prismaClient");
exports.canChangeTaskStatus =
async(req,res,next)=>{

const task =
await prisma.task.findUnique({

where:{
id:Number(req.params.id)
}

});

if(!task){

return res.status(404).json({

message:"Task not found"

});

}

req.task = task;

if(

req.user.role === "ADMIN" ||

req.user.role === "MANAGER" ||

req.user.id === task.assigneeId

){

return next();

}

return res.status(403).json({

message:"Not allowed"

});

}