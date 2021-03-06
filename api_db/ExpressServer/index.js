
require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser'); 
const routes = require('./routes/index.js');
const server = express();

server.name = 'CursosAPI';
server.use(bodyParser.json({ limit: '50mb' })); 
  server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  server.use('/', routes);


console.log(__dirname);
server.use("/static", express.static(__dirname + "/../public"))
// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

console.log("aca está por levantar el puerto")

module.exports = server;