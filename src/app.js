const dotenv = require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { checkOverLoad } = require("./helper/checkConnect");
const app = express();

// init middleware
app.use(express.json({limit : "50mb"}));
app.use(express.urlencoded({limit : "50mb",extended: true}))
app.use(helmet())
app.use(compression())
app.use(morgan("combined"))
// init db 
require("./database/init.mongodb")
checkOverLoad();
// init routers 

// init error

app.get("/", (req,res,next) => {
    const strCompress = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt qui illo eum corrupti, repudiandae tempora ullam eaque beatae ducimus dolore optio harum voluptate necessitatibus doloribus veniam dolores exercitationem minus itaque in laudantium. Voluptas aliquam earum esse at. Provident possimus amet cum esse a voluptate sequi quasi! Perferendis officia provident dicta. |"
    return res.status(200).json({
        success: true, 
        data: strCompress.repeat(10000).split("|")
    })
})


app.post("/", (req,res,next) => {   
    return res.status(500).json({
        success: true, 
        data: req.body
    })
})



module.exports = app;
