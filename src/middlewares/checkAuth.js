const { HEADER_API_KEY, ERROR_MESSAGES_CODE } = require('../constants');
const ApiKeyModel = require('../models/apiKey.model');
const ApiKeyService = require('../services/apiKey.service');
const { throwError } = require('../utils');

const checkApiKey = async (req, res, next) => {
	try {
		const key = req.headers[HEADER_API_KEY.API_KEY]?.toString();
		if (!key) {
			throwError(ERROR_MESSAGES_CODE.forbiddenResources);
		}

		// check objKey existing
		const objKey = await ApiKeyService.findBy({ key, status: true });
		if (!objKey) {
			throwError(ERROR_MESSAGES_CODE.forbiddenResources);
		}
		req.objKey = objKey;
		return next();
	} catch (error) {
		next(error);
	}
};

const checkPermission = (permission) => {
	return (req, res, next) => {
		if (!req.objKey.permissions.length) throwError(ERROR_MESSAGES_CODE.permissionDenied);

		console.log('permissions::', req.objKey.permissions);

		const validPermission = req.objKey.permissions.includes(permission);
		if (!validPermission) throwError(ERROR_MESSAGES_CODE.permissionDenied);

		return next();
	};
};



module.exports = { checkApiKey, checkPermission };
