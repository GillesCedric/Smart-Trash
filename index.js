//imports
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;

//instantiate server
var server = express();

//body parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//configure routes
server.get('/', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.status(200).send('<div style="margin:0 auto;"><h1>Bienvenue sur le serveur de GesPoubelle</h1></div>');
});

server.use('/api/', apiRouter);

//launch server
server.listen(8080, () => {
	console.log('serveur en écoute sur le port 8080...');
});