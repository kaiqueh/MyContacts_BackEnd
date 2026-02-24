const cors = require("./App/middlewares/cors");
const errorHandler = require("./App/middlewares/ErroHandler");
const express = require("express");

const app = express();
const routes = require("./App/routes");

app.use(express.json());
app.use(cors);
app.use(routes);
app.use(errorHandler);

app.listen(3001, () => console.log("http://localhost:3001 is running🔥"));
