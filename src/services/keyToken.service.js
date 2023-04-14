const { Types } = require('mongoose');
const jwt = require('jsonwebtoken');
const KeyTokenModel = require('../models/keyToken.model');
const crypto = require('crypto');
const { AppConfig } = require('../configs');

class KeyTokenService {
	static async saveKeyToken({ userId, publicKey, privateKey, refreshToken, usedRefreshTokens = [] }) {
		try {
			const filter = { userId };
			const update = {
				publicKey,
				refreshToken,
				privateKey,
				usedRefreshTokens
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

		const { refreshToken, accessToken } = await this.createTokenPair(data, publicKeyObj, privateKey);

		return { refreshToken, accessToken, publicKeyString, privateKey };
	};

	static createTokenPair = async (payload, publicKey, privateKey) => {
		try {
			const accessToken = await jwt.sign(payload, privateKey, {
				algorithm: 'RS256',
				expiresIn: AppConfig.accessTokenExpiresIn
			});

			const refreshToken = await jwt.sign(payload, privateKey, {
				algorithm: 'RS256',
				expiresIn: AppConfig.refreshTokenExpiresIn
			});

			return { accessToken, refreshToken };
		} catch (error) {
			return error;
		}
	};

	static findByUserId = async (userId) => await KeyTokenModel.findOne({ userId });

	static deleteById = async (_id) => await KeyTokenModel.deleteOne({ _id });

	static findUsedKeyToken = async (refreshToken) => await KeyTokenModel.findOne({ usedRefreshTokens: refreshToken });

	static deleteByUserId = async (userId) => await KeyTokenModel.findOneAndDelete({ userId });

	static findByRefreshToken = async (refreshToken) => await KeyTokenModel.findOne({ refreshToken });

	static updateRefreshToken = async (_id, { refreshToken, usedRefreshToken }) => {
		await KeyTokenModel.updateOne(
			{ _id },
			{ $set: { refreshToken }, $addToSet: { usedRefreshTokens: usedRefreshToken } }
		);
	};
}

module.exports = KeyTokenService;
