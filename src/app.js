const express = require("express");
const cors = require('cors');
require("./db/mongoose");

const usersRouter = require("./routers/users");
const tasksRouter = require("./routers/tasks");

const app = express();

app.use(cors());
app.use(express.json());

app.use(usersRouter);
app.use(tasksRouter);

module.exports = app;