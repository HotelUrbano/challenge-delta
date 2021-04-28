require('dotenv').config();
const server = require('./config/server.js');
const { APPLICATION_PORT } = process.env;

server.listen(APPLICATION_PORT, er => console.log(er || `Server on port ${APPLICATION_PORT}`));