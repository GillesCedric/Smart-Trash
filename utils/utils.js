module.exports = {
	generateTokenForPoubelle: () => {
		const date = new Date();
		const min = Math.ceil(1000);
		const max = Math.floor(9999);
		return ('IUC' + date.getFullYear().toString().substring(2) + "P" + Date.now() + "N" + (Math.floor(Math.random() * (max - min + 1)) + min));
	},
	getEtat: (niveau) => {
		if (niveau <= 10) {
			return 'Vide';
		}
		if (niveau > 10 && niveau < 90) {
			return 'Moitié Pleine';
		}
		return 'Pleine';
	}
}