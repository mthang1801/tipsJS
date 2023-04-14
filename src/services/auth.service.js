const ShopModel = require('../models/shop.model');
const bcrypt = require('bcryptjs');
const KeyTokenService = require('./keyToken.service');
const { ConflictRequestError, HttpException, BadRequestError, NotFoundError, AuthenticationFail } = require('../core/error.response');
const ShopService = require('./shop.service');
const { ERROR_MESSAGES_CODE } = require('../constants');
const HttpStatus = require('../core/httpStatus');
const jwt = require('jsonwebtoken');

class AuthService {
	static login = async ({ email, password }) => {
		const shopExist = await ShopService.findByEmail(email);
		if (!shopExist) throw new HttpException(ERROR_MESSAGES_CODE.notFound.message, HttpStatus.NOT_FOUND);

		const hashedPassword = await bcrypt.hash(password, shopExist.salt);
		if (shopExist.password !== hashedPassword) {
			throw new BadRequestError('Tài khoản hoặc mật khẩu không đúng.');
		}

		return await this.saveKeyTokenAndReturn(shopExist);
	};

	static logout = async (keyStore) => {
		await KeyTokenService.deleteById(keyStore._id);
	};

	static async signUp({ name, email, password }) {
		const holderShop = await ShopModel.findOne({ email }).lean();
		if (holderShop) {
			throw new ConflictRequestError();
		}

		const salt = await bcrypt.genSalt();
		const hashedPwd = await bcrypt.hash(password, salt);

		const newShop = await ShopModel.create({
			name,
			email,
			password: hashedPwd,
			salt
		});

		return await this.saveKeyTokenAndReturn(newShop.toJSON());
	}

	static async generateTokenByFilteredData(filteredData) {
		return await KeyTokenService.createKeyPair(filteredData);
	}

	static async returnAuthData(responseShopData) {
		try {
			const filteredData = ShopService.filteredData(responseShopData);
			const tokens = await this.generateTokenByFilteredData(filteredData);

			return {
				shop: filteredData,
				tokens
			};
		} catch (error) {
			console.log(error.stack);
			throw error;
		}
	}

	static saveKeyTokenAndReturn = async (currentShop, usedRefreshTokens = []) => {
		const {
			shop,
			tokens: { accessToken, refreshToken, publicKeyString, privateKey }
		} = await this.returnAuthData(currentShop);

		await KeyTokenService.saveKeyToken({
			userId: currentShop._id,
			publicKey: publicKeyString,
			privateKey,
			refreshToken: refreshToken,
			usedRefreshTokens
		});

		return {
			shop,
			tokens: {
				accessToken,
				refreshToken
			}
		};
	};

	static handlerRefreshToken = async (refreshToken) => {
		const usedRefreshTokenExist = await KeyTokenService.findUsedKeyToken(refreshToken);

		if (usedRefreshTokenExist) {
			const { userId } = usedRefreshTokenExist;
			await KeyTokenService.deleteByUserId(userId);
			throw new HttpException(
				ERROR_MESSAGES_CODE.forbiddenResources.message,
				ERROR_MESSAGES_CODE.forbiddenResources.code
			);
		}
		const holderRefreshToken = await KeyTokenService.findByRefreshToken(refreshToken);
		if (!holderRefreshToken) throw new NotFoundError();

		const shopExist = await ShopService.findById(holderRefreshToken.userId);
		if (!shopExist) throw new NotFoundError();

		const filteredData = ShopService.filteredData(shopExist);
		const tokens = await KeyTokenService.createTokenPair(
			filteredData,
			holderRefreshToken.publicKey,
			holderRefreshToken.privateKey
		);

		await KeyTokenService.updateRefreshToken(holderRefreshToken._id, {
			refreshToken: tokens.refreshToken,
			usedRefreshToken: refreshToken
		});

		return {
			shop: filteredData,
			tokens: {
				accessToken: tokens.accessToken,
				refreshToken: tokens.refreshToken
			}
		};
	};

	static handlerRefreshTokenV2 = async ({refreshToken, user, keyStore}) => {
        const {userId} = user; 
        if(keyStore.usedRefreshTokens.includes(refreshToken)){
            await KeyTokenService.deleteByUserId(userId);
            throw new HttpException(
				ERROR_MESSAGES_CODE.forbiddenResources.message,
				ERROR_MESSAGES_CODE.forbiddenResources.code
			);
        }

        if(keyStore.refreshToken !== refreshToken) throw new AuthenticationFail();

		const filteredData = ShopService.filteredData(user);
		const tokens = await KeyTokenService.createTokenPair(
			filteredData,
			keyStore.publicKey,
			keyStore.privateKey
		);

		await KeyTokenService.updateRefreshToken(keyStore._id, {
			refreshToken: tokens.refreshToken,
			usedRefreshToken: refreshToken
		});

		return {
			shop: filteredData,
			tokens: {
				accessToken: tokens.accessToken,
				refreshToken: tokens.refreshToken
			}
		};
	};
}

module.exports = AuthService;
