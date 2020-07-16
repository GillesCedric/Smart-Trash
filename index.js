//imports
var express = require('express');

//instantiate server
var server = express();

//configure routes
server.get('/', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.status(200).send('<div style="margin:0 auto;"><h1>Bienvenue sur le serveur de GesPoubelle</h1></div>');
});

//launch server
server.listen(8080, () => {
	console.log('serveur en écoute sur le port 8080...');
});