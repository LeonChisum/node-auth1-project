const express = require("express");
require("dotenv").config();
//Routes
const userRouter = require("./users/userRouter");

const server = express();

const session = require("express-session");

server.use(express.json());

server.use(
  session({
    name: 'userID',
    secret: 'yoda2020',//process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 //equals 1000ms * 60s * 60min * 24hr = 1 day
    }
  })
);

server.use("/api", userRouter);

module.exports = server;
