const express = require("express")
const prisma = require("./utils/prismaClient");
const router = require('./routes/auth.routes')
const swaggerUi = require("swagger-ui-express");

const specs = require("./swagger");
const cors = require("cors");

const app = express()
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use('/auth', router)
app.use('/user', require('./routes/user.routes') )
app.use('/project', require('./routes/project.routes') )
app.use("/tasks", require("./routes/task.routes"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/analytics", require("./routes/analytics.routes"));

app.use(
    require("./middleware/error.middleware")
);

module.exports = app;

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server running");
    });
}
