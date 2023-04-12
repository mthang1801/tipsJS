const SuccessResponse = require('../core/success.response');
const KeyTokenService = require('../services/keyToken.service');
const ShopService = require('../services/shop.service');

class ShopController extends SuccessResponse {
	constructor() {
		super();
		this.service = ShopService;
	}
	signUp = async (req, res, next) => {
		const result = await this.service.signUp(req.body);
		return this.resCreated(res, result);
	};
}

module.exports = new ShopController();
