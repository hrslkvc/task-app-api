const express = require("express");
const cors = require('cors');
require("./db/mongoose");

const usersRouter = require("./routers/users");
const tasksRouter = require("./routers/tasks");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(usersRouter);
app.use(tasksRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
