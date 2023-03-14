const express = require("express");
const connectDB = require("../db/connect");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/tasks", taskRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
