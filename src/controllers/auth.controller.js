const SuccessResponse = require('../core/success.response');
const AuthService = require('../services/auth.service');

class AuthController {
	constructor() {
		this.service = AuthService;
	}

	login = async (req, res, next) => {
		const result = await this.service.login(req.body);
		return SuccessResponse.resOk(res, result);
	};

	signUp = async (req, res, next) => {
		const result = await this.service.signUp(req.body);
		return SuccessResponse.resCreated(res, result);
	};
}

module.exports = new AuthController();
