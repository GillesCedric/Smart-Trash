//imports
var express = require('express');
var utilisateur = require('./routes/utilisateur');
var poubelle = require('./routes/poubelle');

//Router
exports.router = (() => {
	var apiRouter = express.Router();

	//Routes de l'utilisateur
	apiRouter.route('/utilisateurs/get/').get(utilisateur.getAll);
	apiRouter.route('/utilisateurs/register/').post(utilisateur.register);
	apiRouter.route('/utilisateurs/login/').post(utilisateur.login);
	apiRouter.route('/utilisateurs/perso/').get(utilisateur.get);
	apiRouter.route('/utilisateurs/deleteutilisateur/').post(utilisateur.delete); 0
	apiRouter.route('/utilisateurs/update/').post(utilisateur.update);
	apiRouter.route('/utilisateurs/admin/').post(utilisateur.makeAdmin);
	apiRouter.route('/utilisateurs/activate/').post(utilisateur.activate);
	apiRouter.route('/utilisateurs/updateutilisateur/').post(utilisateur.updateUser);
	apiRouter.route('/utilisateurs/getutilisateur/').get(utilisateur.getUser);
	apiRouter.route('/utilisateurs/videurs/add/').post(utilisateur.addVideur);
	apiRouter.route('/utilisateurs/videurs/activate/').post(utilisateur.activateVideur);
	apiRouter.route('/utilisateurs/videurs/').get(utilisateur.getAllVideurs);
	apiRouter.route('/utilisateurs/videurs/perso').get(utilisateur.getVideur);
	apiRouter.route('/utilisateurs/poubelles/add/').post(utilisateur.addPoubelle);
	apiRouter.route('/utilisateurs/poubelles/activate/').post(utilisateur.activatePoubelle);
	apiRouter.route('/utilisateurs/poubelles/').get(utilisateur.getAllPoubelles);
	apiRouter.route('/utilisateurs/poubelles/perso').get(utilisateur.getPoubelle);
	apiRouter.route('/utilisateurs/poubelles/pwv').get(utilisateur.getAllPoubellesWithVideurs);

	//Routes de la poubelle
	apiRouter.route('/poubelles/update/').get(poubelle.update);

	return apiRouter;
})();