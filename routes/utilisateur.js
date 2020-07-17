//imports
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var models = require('../models');
var asyncLib = require('async');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,12}$/;

//routes
module.exports = {
	register: (req, res) => {
		//params
		var numCni = req.body.numCni;
		var nom = req.body.nom;
		var prenom = req.body.prenom;
		var tel = req.body.tel;
		var login = req.body.login;
		var mail = req.body.mail;
		var password = req.body.password;

		if (numCni == null || nom == null || prenom == null || tel == null || login == null || mail == null || password == null) {
			return res.status(400).json({ 'error': 'paramètres manquants' });
		}
		if (login.length > 10 || login.length < 4) {
			return res.status(400).json({ 'error': 'login incorrect (le login doit être entre 4 et 8 caractères)' });
		}

		if (!EMAIL_REGEX.test(mail)) {
			return res.status(400).json({ 'error': 'addresse mail invalide' });
		}

		if (!PASSWORD_REGEX.test(password)) {
			return res.status(400).json({ 'error': 'Mot de passe invalide (il doit être entre 4 et 12 caractères et contenir aumoins un caractère spécial)' });
		}

		models.Utilisateur.findOne({
			attributes: ['mail'],
			where: { mail: mail }
		})
			.then(userFound => {
				if (!userFound) {
					bcrypt.hash(password, 5, (err, bcryptedPassword) => {
						var newUser = models.Utilisateur.create({
							numCni: numCni,
							nom: nom,
							prenom: prenom,
							tel: tel,
							login: login,
							mail: mail,
							password: bcryptedPassword,
							isActivated: true,
							isAdmin: false

						})
							.then(newUser => {
								return res.status(201).json({
									'utilisateurId': newUser.id,
									'utilisateurNumCni': newUser.numCni
								});
							})
							.catch(err => {
								return res.status(500).json({ 'error': err });
							})
					})
				} else {
					return res.status(500).json({ 'error': 'l\'utilisateur existe déjà' });
				}
			})
			.catch(err => {
				return res.status(500).json({ 'error': err });
			});


	},
	login: (req, res) => {
		//params
		var login = req.body.login;
		var password = req.body.password;

		if (login == null || password == null) {
			return res.status(400).json({ 'error': 'paramètres manquants' });
		}
		if (login.length > 10 || login.length < 4) {
			return res.status(400).json({ 'error': 'login incorrect (le login doit être entre 4 et 8 caractères)' });
		}

		if (!PASSWORD_REGEX.test(password)) {
			return res.status(400).json({ 'error': 'Mot de passe invalide (il doit être entre 4 et 12 caractères et contenir aumoins un caractère spécial)' });
		}

		models.Utilisateur.findOne({
			where: { login: login }
		})
			.then(userFound => {
				if (userFound) {
					bcrypt.compare(password, userFound.password, (errByCrypt, resByCrypt) => {
						if (resByCrypt) {
							return res.status(200).json({
								'utilisateurId': newUser.id,
								'utilisateurNumCni': newUser.numCni,
								'token': 'token'
							});
						} else {
							return res.status(403).json({ "error": "Mot de passe incorrect" });
						}
					});
				} else {
					return res.status(500).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			})
			.catch(err => {
				return res.status(500).json({ 'error': 'login incorrect' });
			});
	}
}