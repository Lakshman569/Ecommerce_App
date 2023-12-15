const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const productRouter = require('./routes/productRoute');
const cookieParser = require("cookie-parser");

dbConnect();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false} ));

app.use(cookieParser());




app.use('/api/user',authRouter);
app.use('/api/product',productRouter);

// middlewares we have to pass after the routes only 

app.use(notFound);

app.use(errorHandler);







app.listen(PORT,() => {
    console.log('Server is running at Port ${PORT}');

}); 