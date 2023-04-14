const ShopModel = require('../models/shop.model');
const bcrypt = require('bcryptjs');
const { createTokenPair } = require('../auth/authUtils');
const { getSpecificData } = require('../utils');
class ShopService {
	static async findByEmail(
		email,
		select = { email: 1, password: 1, roles: 1, status: 1, name: 1, salt: 1, verify: 1 }
	) {
		return await ShopModel.findOne({ email }).select(select).lean();
	}
    
	static async findById(
		_id,
		select = { email: 1, password: 1, roles: 1, status: 1, name: 1, salt: 1, verify: 1 }
	) {
		return await ShopModel.findOne({ _id }).select(select).lean();
	}

	static filteredData(shop) {
		return getSpecificData(shop, ['_id', 'email', 'name', 'verify', 'status']);
	}
}

module.exports = ShopService;
