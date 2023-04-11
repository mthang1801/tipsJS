const dotenv = require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { checkOverLoad } = require("./helper/checkConnect");
const initRouter = require("./routes");
const app = express();

// init middleware
app.use(helmet())
app.use(compression())
app.use(morgan("combined"))
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }))
// init db 
require("./database/init.mongodb")
checkOverLoad();
// init routers 
initRouter(app);
// init error




module.exports = app;
