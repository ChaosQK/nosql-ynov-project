const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const Database = require('./database/database');
const db = new Database("127.0.0.1", "project");

const services = require('./services/services')(router, path, db);

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/public'));
app.use('/', router);

app.listen(80)
/*const socketServer = require('socket.io').listen(server);

socketServer.on("connection", socket => {
    socket.on("message", data => {
		
	  });
});*/

