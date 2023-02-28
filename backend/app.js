const express = require("express");
const app = express();
const errorMiddleware =require("./middleware/error")
const cookieParser=require("cookie-parser")
const bodyParser=require("body-parser");
const fileUpload =require("express-fileupload");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

//Importing Routes

const video = require("./routes/videoRoute");
const user=require("./routes/userRoute")

app.use("/api/v1", video);
app.use("/api/v1", user)

// MIDDLEWARE FOR ERROR
app.use(errorMiddleware);


module.exports = app;
