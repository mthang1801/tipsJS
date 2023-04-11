const KeyTokenService = require("../services/keyToken.service");
const ShopService = require("../services/shop.service");
const BaseController = require("./base.controller");

class ShopController extends BaseController {
    constructor() {
        super();
        this.service = ShopService                
    }
	signUp = async (req, res, next) => {
		try {
            console.log(`[P]::signUp::`, req.body)
            const result = await this.service.signUp(req.body);
            return this.resCreated(res, result)
		} catch (error) {
            next(error);
        }
	};
}

module.exports = new ShopController();
