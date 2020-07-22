//imports
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,12}$/;
const TEL_REGEX = /^(6|2)[0-9]{8}$/;
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

		if (!TEL_REGEX.test(tel)) {
			console.log('err tel ' + tel)
			return res.status(400).json({ 'error': 'numéro de téléphone invalide : Ne mettez pas l\'indicatif' });
		}

		if (!EMAIL_REGEX.test(mail)) {
			return res.status(400).json({ 'error': 'addresse mail invalide' });
		}

		if (!PASSWORD_REGEX.test(password)) {
			return res.status(400).json({ 'error': 'Mot de passe invalide (il doit être entre 4 et 12 caractères et contenir aumoins un caractère spécial)' });
		}

		asyncLib.waterfall([
			done => {
				models.Utilisateur.findOne({
					attributes: ['mail'],
					where: { mail: mail }
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
				if (!userFound) {
					bcrypt.hash(password, 5, (err, bcryptedPassword) => {
						done(null, userFound, bcryptedPassword);
					});
				} else {
					return res.status(409).json({ 'error': 'l\'utilisateur existe déjà' });
				}
			},
			(userFound, bcryptedPassword, done) => {
				models.Utilisateur.create({
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
						done(newUser);
					})
					.catch(err => {
						console.log('error:' + err);
						return res.status(500).json({ 'error': 'impossible d\'enregistrer l\'utilisateur' });
					})
			}
		], newUser => {
			if (newUser) {
				return res.status(201).json({
					'utilisateurId': newUser.id,
					'utilisateurNumCni': newUser.numCni
				});
			} else {
				return res.status(500).json({ 'error': 'impossible d\'enregistrer l\'utilisateur' });
			}
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

		asyncLib.waterfall([
			done => {
				models.Utilisateur.findOne({
					where: { login: login }
				})
					.then(userFound => {
						done(null, userFound);
					})
					.catch(err => {
						console.log('error:' + err);
						return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur' });
					});
			}, (userFound, done) => {
				if (userFound) {
					bcrypt.compare(password, userFound.password, (errByCrypt, resByCrypt) => {
						done(null, userFound, resByCrypt);
					});
				} else {
					return res.status(500).json({ 'error': 'login incorrect' });
				}
			}, (userFound, resByCrypt, done) => {
				if (resByCrypt) {
					done(userFound);
				} else {
					return res.status(403).json({ "error": "Mot de passe incorrect" });
				}
			}
		], userFound => {
			if (userFound) {
				return res.status(200).json({
					'utilisateurId': userFound.id,
					'utilisateurNumCni': userFound.numCni,
					'token': jwtUtils.generateTokenForUser(userFound)
				})
			} else {
				return res.status(500).json({ 'error': 'impossible de connecter l\'utilisateur' });
			}
		});
	},
	get: (req, res) => {
		//Getting auth header
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (utilisateurId < 0) {
			return res.status(400).json({ 'error': 'token invalide' });
		}

		models.Utilisateur.findOne({
			attributes: ['id', 'numCni', 'nom', 'prenom', 'tel', 'login', 'mail', 'isActivated', 'isAdmin', 'createdAt', 'updatedAt'],
			where: { id: utilisateurId }
		})
			.then(user => {
				if (user) {
					return res.status(201).json(user);
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' })
				}
			})
			.catch(err => {
				return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur' })
			})
	},
	getAll: (req, res) => {
		//Getting Auth headers
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (utilisateurId < 0) {
			return res.status(400).json({ 'error': 'token invalide' });
		}

		asyncLib.waterfall([
			done => {
				models.Utilisateur.findOne({
					attributes: ['id', 'isAdmin'],
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
					if (userFound.isAdmin) {
						models.Utilisateur.findAll(
							{ attributes: ['id', 'numCni', 'nom', 'prenom', 'tel', 'login', 'mail', 'isActivated', 'isAdmin', 'createdAt', 'updatedAt'] }
						)
							.then(users => {
								done(users);
							})
							.catch(err => {
								console.log(err);
								return res.status(500).json({ 'error': 'impossible de récuperer les utilisateurs' });
							})
					} else {
						return res.status(404).json({ 'error': 'Vous n\'êtes pas un administrateur' });
					}
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			}
		],
			(users) => {
				if (users) {
					return res.status(201).json(users);
				} else {
					return res.status(500).json({ 'error': 'ereur lors de la récupération des utilisateurs' })
				}
			});

	},
	delete: (req, res) => {
		//Getting Auth headers
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (utilisateurId < 0) {
			return res.status(400).json({ 'error': 'token invalide' });
		}

		//params
		var idUser = req.body.idUser;

		if (idUser == null) {
			return res.status(400).json({ 'error': 'paramètres manquants' });
		}

		asyncLib.waterfall([
			done => {
				models.Utilisateur.findOne({
					attributes: ['id', 'isAdmin'],
					where: { id: utilisateurId }
				})
					.then(userFound => {
						done(null, userFound)
					})
					.catch(err => {
						console.log(err);
						return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur' });
					})
			},
			(userFound, done) => {
				if (userFound) {
					if (userFound.isAdmin) {
						models.Utilisateur.findOne({
							where: { id: idUser }
						})
							.then(user => {
								done(null, user);
							})
							.catch(err => {
								console.log(err);
								return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur sélectionner' });
							})
					} else {
						return res.status(404).json({ 'error': 'Vous n\'êtes pas un administrateur' });
					}
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			},
			(user, done) => {
				if (user) {
					user.update({
						isActivated: !user.isActivated
					})
						.then(() => {
							done(user);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de mettre à jour l\'utilisateur' })
						})
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur sélectionné n\'existe pas' });
				}
			}
		],
			user => {
				if (user) {
					return res.status(201).json(user);
				} else {
					return res.status(500).json({ 'error': 'impossible de mettre à jour l\'utilisateur' });
				}
			});
	},
	update: (req, res) => {
		//Getting Auth headers
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (utilisateurId < 0) {
			return res.status(400).json({ 'error': 'token invalide' });
		}

		//params
		var numCni = req.body.numCni;
		var nom = req.body.nom;
		var prenom = req.body.prenom;
		var tel = req.body.tel;
		var login = req.body.login;
		var mail = req.body.mail;
		var password = req.body.password;

		if (numCni == null && nom == null && prenom == null && tel == null && login == null && mail == null && password == null) {
			return res.status(400).json({ 'error': 'paramètres manquants' });
		}

		if (login && (login.length > 10 || login.length < 4)) {
			return res.status(400).json({ 'error': 'login incorrect (le login doit être entre 4 et 8 caractères)' });
		}

		if (tel && !TEL_REGEX.test(tel)) {
			console.log(tel)
			return res.status(400).json({ 'error': 'numéro de téléphone invalide : Ne mettez pas l\'indicatif' });
		}

		if (mail && !EMAIL_REGEX.test(mail)) {
			return res.status(400).json({ 'error': 'addresse mail invalide' });
		}

		if (password && !PASSWORD_REGEX.test(password)) {
			return res.status(400).json({ 'error': 'Mot de passe invalide (il doit être entre 4 et 12 caractères et contenir aumoins un caractère spécial)' });
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
					});
			},
			(userFound, done) => {
				if (userFound) {
					bcrypt.hash(password, 5, (errByCrypt, bcryptedPassword) => {
						done(null, userFound, bcryptedPassword);
					});
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			},
			(userFound, bcryptedPassword, done) => {
				userFound.update({
					numCni: (numCni ? numCni : userFound.numCni),
					nom: (nom ? nom : userFound.nom),
					prenom: (prenom ? prenom : userFound.prenom),
					tel: (tel ? tel : userFound.tel),
					login: (login ? login : userFound.login),
					mail: (mail ? mail : userFound.mail),
					password: (password ? bcryptedPassword : userFound.password)
				})
					.then(() => {
						done(userFound);
					})
					.catch(err => {
						console.log(err);
						return res.status(500).json({ 'error': 'impossible de mettre à jour l\'utilisateur' })
					});
			}
		],
			userFound => {
				if (userFound) {
					return res.status(201).json(userFound);
				} else {
					return res.status(500).json({ 'error': 'impossible de mettre à jour l\'utilisateur' });
				}
			});
	},
	makeAdmin: (req, res) => {
		//Getting Auth headers
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (utilisateurId < 0) {
			return res.status(400).json({ 'error': 'token invalide' });
		}

		//params
		var idUser = req.body.idUser;

		if (idUser == null) {
			return res.status(400).json({ 'error': 'paramètres manquants' });
		}

		asyncLib.waterfall([
			done => {
				models.Utilisateur.findOne({
					attributes: ['id', 'isAdmin'],
					where: { id: utilisateurId }
				})
					.then(userFound => {
						done(null, userFound)
					})
					.catch(err => {
						console.log(err);
						return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur' });
					})
			},
			(userFound, done) => {
				if (userFound) {
					if (userFound.isAdmin) {
						models.Utilisateur.findOne({
							where: { id: idUser }
						})
							.then(user => {
								done(null, user);
							})
							.catch(err => {
								console.log(err);
								return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur sélectionner' });
							})
					} else {
						return res.status(404).json({ 'error': 'Vous n\'êtes pas un administrateur' });
					}
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			},
			(user, done) => {
				if (user) {
					user.update({
						isAdmin: !user.isAdmin
					})
						.then(() => {
							done(user);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de mettre à jour l\'utilisateur' })
						})
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur sélectionné n\'existe pas' });
				}
			}
		],
			user => {
				if (user) {
					return res.status(201).json(user);
				} else {
					return res.status(500).json({ 'error': 'impossible de mettre à jour l\'utilisateur' });
				}
			});
	},
	updateUser: (req, res) => {

	},
	getUser: (req, res) => {
		//Getting Auth headers
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (utilisateurId < 0) {
			return res.status(400).json({ 'error': 'token invalide' });
		}

		//params
		var idUser = req.body.idUser;

		if (idUser == null) {
			return res.status(400).json({ 'error': 'paramètres manquants' });
		}

		asyncLib.waterfall([
			done => {
				models.Utilisateur.findOne({
					attributes: ['id', 'isAdmin'],
					where: { id: utilisateurId }
				})
					.then(userFound => {
						done(null, userFound)
					})
					.catch(err => {
						console.log(err);
						return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur' });
					})
			},
			(userFound, done) => {
				if (userFound) {
					if (userFound.isAdmin) {
						models.Utilisateur.findOne({
							where: { id: idUser }
						})
							.then(user => {
								done(user);
							})
							.catch(err => {
								console.log(err);
								return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur sélectionner' });
							})
					} else {
						return res.status(404).json({ 'error': 'Vous n\'êtes pas un administrateur' });
					}
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			}
		],
			user => {
				if (user) {
					return res.status(201).json(user);
				} else {
					return res.status(500).json({ 'error': 'impossible de mettre à jour l\'utilisateur' });
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
		var idUser = req.body.idUser;

		if (idUser == null) {
			return res.status(400).json({ 'error': 'paramètres manquants' });
		}

		asyncLib.waterfall([
			done => {
				models.Utilisateur.findOne({
					attributes: ['id', 'isAdmin'],
					where: { id: utilisateurId }
				})
					.then(userFound => {
						done(null, userFound)
					})
					.catch(err => {
						console.log(err);
						return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur' });
					})
			},
			(userFound, done) => {
				if (userFound) {
					if (userFound.isAdmin) {
						models.Utilisateur.findOne({
							where: { id: idUser }
						})
							.then(user => {
								done(null, user);
							})
							.catch(err => {
								console.log(err);
								return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur sélectionner' });
							})
					} else {
						return res.status(404).json({ 'error': 'Vous n\'êtes pas un administrateur' });
					}
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			},
			(user, done) => {
				if (user) {
					user.update({
						isActivated: !user.isActivated
					})
						.then(() => {
							done(user);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de mettre à jour l\'utilisateur' })
						})
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur sélectionné n\'existe pas' });
				}
			}
		],
			user => {
				if (user) {
					return res.status(201).json(user);
				} else {
					return res.status(500).json({ 'error': 'impossible de mettre à jour l\'utilisateur' });
				}
			});
	},
	addVideur: (req, res) => {
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
	activateVideur: (req, res) => {
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
	getAllVideurs: (req, res) => {
		//Getting Auth headers
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (utilisateurId < 0) {
			return res.status(400).json({ 'error': 'token invalide' });
		}

		asyncLib.waterfall([
			done => {
				models.Utilisateur.findOne({
					attributes: ['id', 'isAdmin'],
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
					models.Videur.findAll(
						{ attributes: ['id', 'numCni', 'nom', 'prenom', 'tel', 'isActivated', 'utilisateurNumCni', 'createdAt', 'updatedAt'] }
					)
						.then(videurs => {
							done(videurs);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de récuperer les videurs' });
						})
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			}
		],
			(videurs) => {
				if (videurs) {
					return res.status(201).json(videurs);
				} else {
					return res.status(500).json({ 'error': 'ereur lors de la récupération des utilisateurs' })
				}
			});

	},
	getVideur: (req, res) => {
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
						done(null, userFound)
					})
					.catch(err => {
						console.log(err);
						return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur' });
					})
			},
			(userFound, done) => {
				if (userFound) {
					models.Utilisateur.findOne({
						where: { id: idUser }
					})
						.then(user => {
							done(user);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur sélectionner' });
						})
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			}
		],
			user => {
				if (user) {
					return res.status(201).json(user);
				} else {
					return res.status(500).json({ 'error': 'impossible de récupérer les videurs' });
				}
			});
	},
	addPoubelle: (req, res) => {

	},
	activatePoubelle: (req, res) => {
		//Getting Auth headers
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (utilisateurId < 0) {
			return res.status(400).json({ 'error': 'token invalide' });
		}

		//params
		var idPoubelle = req.body.idPoubelle;

		if (idPoubelle == null) {
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
					models.Poubelle.findOne({
						where: { id: idPoubelle }
					})
						.then(poubelleFound => {
							done(null, poubelleFound);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de vérifier la poubelle sélectionner' });
						})
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			},
			(poubelleFound, done) => {
				if (poubelleFound) {
					poubelleFound.update({
						isActivated: !poubelleFound.isActivated
					})
						.then(poubelle => {
							done(poubelle);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de mettre à jour le la poubelle' })
						})
				} else {
					return res.status(404).json({ 'error': 'le videur sélectionné n\'existe pas' });
				}
			}
		],
			poubelle => {
				if (poubelle) {
					return res.status(201).json(poubelle);
				} else {
					return res.status(500).json({ 'error': 'impossible de mettre à jour la poubelle' });
				}
			})
	},
	getAllPoubelles: (req, res) => {
		//Getting Auth headers
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (utilisateurId < 0) {
			return res.status(400).json({ 'error': 'token invalide' });
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
					models.Poubelle.findAll(
						{ attributes: ['id', 'token', 'marque', 'dimensions', 'adresseIp', 'etat', 'niveau', 'isActivated', 'utilisateurNumCni', 'videurNumCni', 'createdAt', 'updatedAt'] }
					)
						.then(poubelles => {
							done(poubelles);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de récuperer les poubelles' });
						})
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			}
		],
			(poubelles) => {
				if (poubelles) {
					return res.status(201).json(poubelles);
				} else {
					return res.status(500).json({ 'error': 'ereur lors de la récupération des poubelles' })
				}
			});

	},
	getPoubelle: (req, res) => {
		//Getting Auth headers
		var headerAuth = req.headers['authorization'];
		var utilisateurId = jwtUtils.getUtilisateurId(headerAuth);

		if (utilisateurId < 0) {
			return res.status(400).json({ 'error': 'token invalide' });
		}

		//params
		var idPoubelle = req.body.idPoubelle;

		if (idPoubelle == null) {
			return res.status(400).json({ 'error': 'paramètres manquants' });
		}

		asyncLib.waterfall([
			done => {
				models.Utilisateur.findOne({
					where: { id: utilisateurId }
				})
					.then(userFound => {
						done(null, userFound)
					})
					.catch(err => {
						console.log(err);
						return res.status(500).json({ 'error': 'impossible de vérifier l\'utilisateur' });
					})
			},
			(userFound, done) => {
				if (userFound) {
					models.Poubelle.findOne({
						where: { id: idPoubelle }
					})
						.then(poubelle => {
							done(poubelle);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de vérifier la poubelle sélectionner' });
						})
				} else {
					return res.status(404).json({ 'error': 'l\'utilisateur n\'existe pas' });
				}
			}
		],
			poubelle => {
				if (poubelle) {
					return res.status(201).json(poubelle);
				} else {
					return res.status(500).json({ 'error': 'impossible de récupérer la poubelle' });
				}
			});
	},


}