const express = require("express");

const userRouter = require('./users/userRouter')

const server = express();

server.use(express.json());

server.use("/api", userRouter )

module.exports = server;