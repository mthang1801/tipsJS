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

	logout = async (req, res, next) => {
		await this.service.logout(req.keyStore);
		return SuccessResponse.resOk(res);
	};

	signUp = async (req, res, next) => {
		const result = await this.service.signUp(req.body);
		return SuccessResponse.resCreated(res, result);
	};

	handlerRefreshToken = async (req, res, next) => {
		const result = await this.service.handlerRefreshTokenV2({
			refreshToken: req.refreshToken,
			user: req.user,
			keyStore: req.keyStore
		});
		return SuccessResponse.resOk(res, result);
	};
}

module.exports = new AuthController();
