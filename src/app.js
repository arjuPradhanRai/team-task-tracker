const express = require("express")
const prisma = require("./utils/prismaClient");
const router = require('./routes/auth.routes')

const app = express()
app.use(express.json());
app.use('/auth', router)
app.use('/user', require('./routes/user.routes') )
app.use('/project', require('./routes/project.routes') )
app.use(
"/tasks",
require("./routes/task.routes")
);

app.use(
    require("./middleware/error.middleware")
);


app.listen(3000, () => {
    console.log("Server running");
});
