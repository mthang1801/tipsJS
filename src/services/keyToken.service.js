const { createTokenPair } = require('../auth/authUtils');
const KeyTokenModel = require('../models/keyToken.model');
const crypto = require('crypto');

class KeyTokenService {
	static async saveKeyToken({ userId, publicKey, refreshToken }) {
		try {
			const filter = { userId };
			const update = {
				publicKey,
				refreshToken,
				usedRefreshTokens: []
			};
			const options = {
				upsert: true,
				new: true
			};

			await KeyTokenModel.findOneAndUpdate(filter, update, options);
		} catch (error) {
			console.log(error.stack);
			return error;
		}
	}

	static createKeyPair = async (data) => {
		const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
			modulusLength: 4096,
			publicKeyEncoding: {
				type: 'pkcs1',
				format: 'pem'
			},
			privateKeyEncoding: {
				type: 'pkcs1',
				format: 'pem'
			}
		});

		const publicKeyString = publicKey.toString();

		const publicKeyObj = crypto.createPublicKey(publicKeyString);

		const { refreshToken, accessToken } = await createTokenPair(data, publicKeyObj, privateKey);
        
		await this.saveKeyToken({ userId: data._id, publicKey: publicKeyString, refreshToken });       

		return { refreshToken, accessToken };
	};
}

module.exports = KeyTokenService;
