//imports
var models = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');

const TEL_REGEX = /^(6|2)[0-9]{8}$/;

//routes
module.exports = {
	add: (req, res) => {
		//params
		var numCni = req.body.numCni;
		var nom = req.body.nom;
		var prenom = req.body.prenom;
		var tel = req.body.tel;

		//Getting auth header
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (numCni == null || nom == null || prenom == null || tel == null) {
			return res.status(400).json({ 'error': 'paramètres manquants' });
		}

		if (!TEL_REGEX.test(tel)) {
			console.log('err tel ' + tel)
			return res.status(400).json({ 'error': 'numéro de téléphone invalide : Ne mettez pas l\'indicatif' });
		}

		asyncLib.waterfall([
			done => {
				models.Utilisateur.findOne({
					where: { id: utilisateurId }
				})
					.then(userFound => {
						done(null, userFound);
					})
					.catch(err => {
						console.log('error:' + err);
						return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur' });
					});
			},
			(userFound, done) => {
				if (userFound) {
					models.Videur.findOne({
						where: { numCni: numCni }
					})
						.then(videurFound => {
							done(null, userFound, videurFound);
						})
						.catch(err => {
							console.log('error:' + err);
							return res.status(500).json({ 'error': 'impossible de vérifier le videur' });
						})
				} else {
					return res.status(409).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			},
			(userFound, videurFound, done) => {
				if (!videurFound) {
					models.Videur.create({
						numCni: numCni,
						nom: nom,
						prenom: prenom,
						tel: tel,
						isActivated: true,
						utilisateurNumCni: userFound.numCni

					})
						.then(newUser => {
							done(newUser);
						})
						.catch(err => {
							console.log('error:' + err);
							return res.status(500).json({ 'error': 'impossible d\'enregistrer le videur' });
						})
				} else {
					return res.status(409).json({ 'error': 'le videur existe déjà' });
				}

			}
		], newUser => {
			if (newUser) {
				return res.status(201).json({
					'videurId': newUser.id,
					'videurNumCni': newUser.numCni
				});
			} else {
				return res.status(500).json({ 'error': 'impossible d\'enregistrer le videur' });
			}
		});
	},
	activate: (req, res) => {
		//Getting Auth headers
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (utilisateurId < 0) {
			return res.status(400).json({ 'error': 'token invalide' });
		}

		//params
		var idVideur = req.body.idVideur;

		if (idVideur == null) {
			return res.status(400).json({ 'error': 'paramètres manquants' });
		}

		asyncLib.waterfall([
			done => {
				models.Utilisateur.findOne({
					where: { id: utilisateurId }
				})
					.then(userFound => {
						done(null, userFound);
					})
					.catch(err => {
						console.log(err);
						return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur' });
					})
			},
			(userFound, done) => {
				if (userFound) {
					models.Videur.findOne({
						where: { id: idVideur }
					})
						.then(videurFound => {
							done(null, videurFound);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de vérifier le videur sélectionner' });
						})
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			},
			(videurFound, done) => {
				if (videurFound) {
					videurFound.update({
						isActivated: !videurFound.isActivated
					})
						.then(videur => {
							done(videur);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de mettre à jour le videur' })
						})
				} else {
					return res.status(404).json({ 'error': 'le videur sélectionné n\'existe pas' });
				}
			}
		],
			user => {
				if (user) {
					return res.status(201).json(user);
				} else {
					return res.status(500).json({ 'error': 'impossible de mettre à jour le videur' });
				}
			})
	},

}