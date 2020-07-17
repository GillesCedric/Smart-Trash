//imports
var express = require('express');
var utilisateur = require('./routes/utilisateur');

//Router
exports.router = (() => {
	var apiRouter = express.Router();

	//Routes de l'utilisateur
	apiRouter.route('/utilisateurs/register/').post(utilisateur.register);
	apiRouter.route('/utilisateurs/login/').post(utilisateur.login);
	return apiRouter;
})();