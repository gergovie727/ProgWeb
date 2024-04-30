const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');

/* Mapping url to routers */
const app = express();

/* Creating 24 hours from milliseconds */
const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: "YouMfBetterEntertainMe",
    saveUninitialized: true,
    cookie : { maxAge: oneDay },
    resave: false
})); 

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/session", router.sessionRouter);
app.use("/api/user", router.userRouter);
app.use("/api/tweet", router.tweetRouter);

/* Starting the server with my account (username : admin ; password : 66KEewfSCEzxLQsT) */

mongoose
    //connection to the database
    .connect('mongodb+srv://admin:66KEewfSCEzxLQsT@cluster0.smnkbe3.mongodb.net/?retryWrites=true&w=majority')

    //listening to the port 8000
    .then(() => app.listen(8000))
    
    .then(() => console.log("Connected to Database and Listening to localhost 8000 and no i am not a stalker bitch"))

    //error message if can't connect to database or listen to the part
    .catch((error) => console.log("You dumb shit cannot even do something correctly"+error));
