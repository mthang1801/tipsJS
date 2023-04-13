const SuccessResponse = require('../core/success.response');
const AuthService = require('../services/auth.service');

class AuthController extends SuccessResponse {
	constructor() {
		super();
		this.service = AuthService;
	}
    login = async(req, res, next) => {
        const result = await this.service.login(req.body);
        return this.resOk(res, result)
    }

	signUp = async (req, res, next) => {
		const result = await this.service.signUp(req.body);
		return this.resCreated(res, result);
	};
}

module.exports = new AuthController();
