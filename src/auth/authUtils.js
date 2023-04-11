const jwt = require('jsonwebtoken');
const { AppConfig } = require('../configs');

const createTokenPair = async (payload, publicKey, privateKey) => {
	try {
		const accessToken = await jwt.sign(payload, privateKey, {
			algorithm: 'RS256',
			expiresIn: AppConfig.accessTokenExpiresIn
		});

		const refreshToken = await jwt.sign(payload, privateKey, {
			algorithm: 'RS256',
			expiresIn: AppConfig.refreshTokenExpiresIn
		});      
        const decode = await jwt.verify(accessToken, publicKey);
        console.log("decode::", decode)
		return { accessToken, refreshToken };
	} catch (error) {
		return error;
	}
};

module.exports = {
	createTokenPair
};
