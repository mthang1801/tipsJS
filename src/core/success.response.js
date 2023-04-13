const statusCode = {
	ok: {
		status: 'success',
		code: 200
	},
	created: {
		status: 'success',
		code: 201
	}
};

class SuccessResponse {
	_message = '';
	_metadata = null;
	_res;
	_paging = null;
	_code = 200;
	_status = 'success';
	static _instance = null;

	constructor() {
		if (SuccessResponse._instance) {
			return SuccessResponse._instance;
		}
		SuccessResponse._instance = this;
	}

	setCode(code) {
		this._code = code;
	}

	setStatus(status) {
		this._status = status;
	}

	dataResponse() {
		return {
			status: this._status,
			code: this._code,
			metadata: this._metadata,
			paging: this._paging,
			message: this._message
		};
	}

	setResponse(res) {
		this._res = res;
	}

	setMessage(message) {
		this._message = message;
	}

	setMetadata(data) {
		this._metadata = data;
	}

	setVariables(res, statusCode, data, message) {
		this.setCode(statusCode.code);
		this.setStatus(statusCode.status);
		this.setResponse(res);
		this.setMessage(message);
		this.setMetadata(data);
	}

	resTemplate() {
		const dataResponse = this.dataResponse();
		return this._res.status(this._code).json(dataResponse);
	}

	resOk(res, data = null, message = '') {
		this.setVariables(res, statusCode.ok, data, message);
		return this.resTemplate();
	}

	resCreated(res, data = null, message = 'Tạo thành công.') {
		this.setVariables(res, statusCode.created, data, message);
		return this.resTemplate();
	}
}

module.exports = new SuccessResponse();
