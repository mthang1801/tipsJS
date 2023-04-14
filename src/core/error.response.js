const { ERROR_MESSAGES_CODE } = require('../constants');

class ErrorResponse extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
	}
}

class ConflictRequestError extends ErrorResponse {
	constructor(
		message = ERROR_MESSAGES_CODE.conflictRequest.message,
		code = ERROR_MESSAGES_CODE.conflictRequest.code
	) {
		super(message, code);
	}
}

class BadRequestError extends ErrorResponse {
	constructor(message = ERROR_MESSAGES_CODE.conflictRequest.message, code = ERROR_MESSAGES_CODE.badRequest.code) {
		super(message, code);
	}
}

class NotFoundError extends ErrorResponse {
	constructor(message = ERROR_MESSAGES_CODE.notFound.message, code = ERROR_MESSAGES_CODE.notFound.code) {
		super(message, code);
	}
}
class AuthenticationFail extends ErrorResponse {
	constructor(message = ERROR_MESSAGES_CODE.authenFail.message, code = ERROR_MESSAGES_CODE.authenFail.code) {
		super(message, code);
	}
}

class HttpException extends ErrorResponse {
	constructor(message, code) {
		super(message, code);
	}
}

module.exports = {
	ConflictRequestError,
	BadRequestError,
	AuthenticationFail,
    NotFoundError,
	HttpException
};
