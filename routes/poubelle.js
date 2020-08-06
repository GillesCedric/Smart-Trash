//Imports
var models = require('../models');
var asyncLib = require('async');

//const
const { generateTokenForPoubelle, getEtat } = require('../utils/utils');
const IP_ADDRESS_REGEX = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1} [0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/

//Routes
module.exports = {
	update: (req, res) => {
		//params
		var token = req.body.token;
		var adresseIp = req.body.adresseIp;
		var niveau = req.body.niveau;

		if (adresseIp == null || niveau == null) {
			return res.status(400).json({ 'error': 'paramètres manquants' });
		}

		if (!IP_ADDRESS_REGEX.test(adresseIp)) {
			return res.status(400).json({ 'error': 'l\'addresse ip est invalide' });
		}

		asyncLib.waterfall([
			done => {
				models.Poubelle.findOne({
					where: { token: token }
				})
					.then(poubelleFound => {
						if (poubelleFound) {
							done(null, poubelleFound);
						} else {
							models.Poubelle.create({
								token: generateTokenForPoubelle(),
								marque: null,
								dimensions: null,
								adresseIp: adresseIp,
								etat: getEtat(parseInt(niveau)),
								niveau: parseInt(niveau),
								isActivated: true
							})
								.then(poubelle => {
									return res.status(201).json(poubelle);
								})
								.catch(err => {
									console.log(err);
									return res.status(500).json({ 'error': 'impossible d\'enregistrer la poubelle' })
								})
						}
					})
					.catch(err => {
						console.log(err);
						return res.status(500).json({ 'error': 'impossible de vérifier la poubelle' });
					})
			},
			(poubelleFound, done) => {
				if (poubelleFound) {
					models.Poubelle.update({
						adresseIp: adresseIp,
						etat: getEtat(niveau),
						niveau: niveau
					})
						.then(poubelle => {
							done(poubelle);
						})
						.catch(err => {
							console.log(err);
							return res.status(500).json({ 'error': 'impossible de mettre à jour la poubelle' });
						})
				} else {
					return res.status(404).json({ 'error': 'la poubelle n\'existe pas' });
				}
			}
		],
			poubelle => {
				if (poubelle) {
					return res.status(201).json(poubelle);
				} else {
					return res.status(500).json({ 'error': 'erreur lors de la mise à jour de la poubelle' })
				}
			})
	}
}