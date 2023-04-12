const dotenv = require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { checkOverLoad } = require("./helper/checkConnect");
const initRouter = require("./routes");
const { ERROR_MESSAGES_CODE } = require("./constants");
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
app.use((req, res, next) => {
    const {notFound} = ERROR_MESSAGES_CODE;
    const error = new Error(notFound.message);
    error.code = notFound.code;
    next(error);
})

app.use((error, req, res, next) => {
    const code = error.code || 500;
    return res.status(code).json({
        status: "failed",
		code,
		metadata: null,
		paging: null,
		message: error.message || "Internal Server Error."
    })
})


module.exports = app;
