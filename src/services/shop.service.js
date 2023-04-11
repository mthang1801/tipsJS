const ShopModel = require('../models/shop.model');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const KeyTokenModel = require('../models/keyToken.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { default: mongoose } = require('mongoose');
const { getSpecificData } = require('../utils');
class ShopService {
	keyTokenService = KeyTokenService;

	static async signUp({ name, email, password }) {
		const holderShop = await ShopModel.findOne({ email }).lean();
		if (holderShop) {
			const error = new Error('Shop has already existed.');
			error.code = 409;
			throw error;
		}

		const salt = await bcrypt.genSalt();
		const hashedPwd = await bcrypt.hash(password, salt);

		const newShop = await ShopModel.create({
			name,
			email,
			password: hashedPwd,
			salt
		});
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

		const publicKeyString = await KeyTokenService.create({ userId: newShop._id, publicKey });
		const publicKeyObj = crypto.createPublicKey(publicKeyString);

		const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObj, privateKey);

		return {
			shop: getSpecificData(newShop, ["_id", "email", "name", "verify", "status"]) ,
			tokens
		};
	}
}

module.exports = ShopService;
