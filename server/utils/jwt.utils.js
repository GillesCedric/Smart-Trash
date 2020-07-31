//Imports
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'g{pZG_UtEpmJVMbZ+4b%d*sf>z(CDtybvM0"P%iN=3ixW\]LX%qM_9>;??~xSs*xHa}]R$NxuoI6~PS[CzH\mcq.&f%:T3]*(U#%y%QwBjVkmY8of*@@id#bsgx*}{%:eJ\3U87M!wF#W+56^ZR?5B0hG(BR:R0?jL|42tGQU4bb)~B?u`?!GXpqkU%!-1,t.7~1@<\*KBS\l!`RI|NT]G1ke0}q/Mb:[oZ+yyCd0"j1i6Qt}G_\UESeM4r#QFl';

//Exported functions
module.exports = {
	generateTokenForUser: userData => jwt.sign({ userId: userData.id, isAdmin: userData.isAdmin }, JWT_SIGN_SECRET, { expiresIn: '72h' }),
	parseAuthorization: authorization => (authorization != null) ? authorization.replace('Bearer ', '') : null,
	getUtilisateurId: authorization => {
		var userId = -1;
		var token = module.exports.parseAuthorization(authorization);
		if (token != null) {
			try {
				var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
				if (jwtToken !== null) {
					userId = jwtToken.userId;
				}
			} catch (error) {
				console.log(error);
			}
		}
		return userId;
	}

}