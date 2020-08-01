//imports
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;
var cors = require('cors');

//instantiate server
var server = express();

//body parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//cors configuration
server.use(cors());

//configure routes
server.get('/', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.status(200).send('<h1>Bienvenue sur le serveur de Smart-Trash</h1>');
});

server.use('/api/', apiRouter);

//launch server
server.listen(process.env.PORT || 5000, () => {
	console.log('serveur en écoute sur le port ' + process.env.PORT || 5000);
});