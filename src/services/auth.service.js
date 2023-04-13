const ShopModel = require('../models/shop.model');
const bcrypt = require('bcryptjs');
const KeyTokenService = require('./keyToken.service');
const { ConflictRequestError, HttpException, BadRequestError } = require('../core/error.response');
const ShopService = require('./shop.service');
const { ERROR_MESSAGES_CODE } = require('../constants');
const HttpStatus = require('../core/httpStatus');

class AuthService {
	static login = async ({ email, password, refreshToken = null }) => {
		const shopExist = await ShopService.findByEmail(email);
		if (!shopExist) throw new HttpException(ERROR_MESSAGES_CODE.notFound.message, HttpStatus.NOT_FOUND);
		const hashedPassword = await bcrypt.hash(password, shopExist.salt);      
		if (shopExist.password !== hashedPassword) {
			throw new BadRequestError('Tài khoản hoặc mật khẩu không đúng.');
		}
		return await this.returnAuthData(shopExist);
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
      
		return await this.returnAuthData(newShop.toJSON());
	}

	static async generateTokenByFilteredData(filteredData) {
		return await KeyTokenService.createKeyPair(filteredData);
	}

	static async returnAuthData(responseShopData) {
		const filteredData = ShopService.filteredData(responseShopData);
		const tokens = await this.generateTokenByFilteredData(filteredData);
                
		return {
			shop: filteredData,
			tokens
		};
	}
}

module.exports = AuthService;
