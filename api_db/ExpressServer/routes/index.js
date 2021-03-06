
const { Router } = require('express');
const usersRouter = require('./Users');
const server = Router();
// load each router on a route
// i.e: router.use('/auth', authRouter);
// router.use('/auth', authRouter);
server.use('/users', usersRouter);


module.exports = server;