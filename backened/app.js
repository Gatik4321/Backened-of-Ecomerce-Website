const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
const errorMiddleware = require('./middleware/error')
//Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoutes");
const order = require('./routes/orderRoute');
app.use(cookieParser());
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use(cookieParser());
//Middle wae for error
app.use(errorMiddleware);
module.exports = app;
