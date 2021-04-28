const express = require('express');
const routes = require('../app/route');
const server = express();

server.use(express.json());

server.use(routes);

server.use((req, res) => res.status(404).json({ errorText: "Page not found." }));   // FOR ANY ROUTE, REQUESTED BY THE USER, WHICH IS OUTSIDE THE APP ROUTES

module.exports = server;