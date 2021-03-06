const { Router } = require('express');

const server = Router();

const productRouter = require('./product');
const usersRouter = require("./users.js");
const ordersRouter = require('./orders');

// load each router on a route
// i.e: router.use('/auth', authRouter);
// router.use('/auth', authRouter);
server.use('/products', productRouter);
server.use('/users', usersRouter);
server.use('/orders', ordersRouter);


module.exports = server;
