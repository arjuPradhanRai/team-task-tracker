const prisma=require("../utils/prismaClient");
const transition=
require("../utils/statusTransition");

const redis =
require("../utils/redis");


exports.createTask=async(req,res,next)=>{

try{

const {

title,
description,
priority,
assigneeId,
projectId,
due_date

}=req.body;

const project=
await prisma.project.findFirst({

where:{

id:projectId,

organizationId:
req.user.organizationId

}

});

if(!project){

return res.status(404).json({

status:404,

code:"PROJECT_NOT_FOUND",

message:"Project not found"

});

}

const task=
await prisma.task.create({

data:{

title,

description,

priority,

assigneeId,

projectId,

due_date:
due_date
? new Date(due_date)
: null

}

});

const keys = await redis.keys(`tasks:${req.user.organizationId}:*`);
if (keys.length) await redis.del(keys);

res.status(201).json(task);

}catch(err){

next(err);

}

}

exports.listTasks =
async(req,res,next)=>{

try{

const page =
Number(req.query.page) || 1;

const limit =
Number(req.query.limit) || 10;

const skip =
(page - 1) * limit;

const cacheKey =

`tasks:${
req.user.organizationId
}:${
req.query.assignee || "all"
}:${
req.query.status || "all"
}:${
req.query.priority || "all"
}:${
page
}:${
limit
}`;

const cached =
await redis.get(cacheKey);

if(cached){

return res.json({

source:"cache",

data:JSON.parse(cached)

});

}

const tasks =
await prisma.task.findMany({

where: {
  project: { organizationId: req.user.organizationId },
  ...(req.query.status && { status: req.query.status }),
  ...(req.query.priority && { priority: req.query.priority }),
  ...(req.query.assignee && { assigneeId: Number(req.query.assignee) }),
},

skip,

take:limit,

include:{

assignee:true,

project:true

}

});

await redis.set(

cacheKey,

JSON.stringify(tasks),

{

EX:300

}

);

res.json({

source:"db",

data:tasks

});

}catch(err){

next(err);

}

}

exports.getTask=async(req,res,next)=>{

try{

const task=
await prisma.task.findUnique({

where:{
id:Number(req.params.id),
project:{

organizationId:
req.user.organizationId

}
},

include:{

assignee:true,

project:true

}

});

if(!task){

return res.status(404).json({

message:"Task not found"

});

}

res.json(task);

}catch(err){

next(err);

}

}

exports.updateTask=async(req,res,next)=>{

try{

const task=
await prisma.task.update({

where:{
id:Number(req.params.id),
project:{

organizationId:
req.user.organizationId

}
},

data:req.body

});

const keys = await redis.keys(`tasks:${req.user.organizationId}:*`);
if (keys.length) await redis.del(keys);

res.json(task);

}catch(err){

next(err);

}

}

exports.deleteTask=async(req,res,next)=>{

try{

await prisma.task.delete({

where:{
id:Number(req.params.id)
}

});
    const keys = await redis.keys(`tasks:${req.user.organizationId}:*`);
    if (keys.length) await redis.del(keys);

res.json({

message:"Deleted"

});

}catch(err){

next(err);

}

}


exports.changeStatus=async(req,res,next)=>{

try{

const task=
await prisma.task.findUnique({

where:{
id:Number(req.params.id)
}

});

if(!task){

return res.status(404).json({

message:"Task missing"

});

}

if(

req.user.role!=="MANAGER" &&
req.user.role !== "ADMIN" &&
req.user.id!==task.assigneeId

){

return res.status(403).json({

message:"Not allowed"

});

}

const allowed=
transition(

task.status,

req.body.status

);

if(!allowed){

return res.status(400).json({

message:
"Invalid transition"

});

}

const updated=
await prisma.task.update({

where:{
id:task.id
},

data:{

status:
req.body.status

}

});

const keys = await redis.keys(`tasks:${req.user.organizationId}:*`);
if (keys.length) await redis.del(keys);


res.json(updated);

}catch(err){

next(err);

}

}