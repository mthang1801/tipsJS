const jwt = require('jsonwebtoken');
const asyncHandler = require('../helper/asyncHandler');
const { HEADER_API_KEY } = require('../constants');
const KeyTokenService = require('../services/keyToken.service');
const { AuthenticationFail, NotFoundError } = require('../core/error.response');

exports.authentication = asyncHandler(async (req, res, next) => {
	const userId = req.headers[HEADER_API_KEY.CLIENT_ID];
	if (!userId) throw new AuthenticationFail();

	const keyTokenStore = await KeyTokenService.findByUserId(userId);
	if (!keyTokenStore) throw new NotFoundError();

	const accessToken = req.headers[HEADER_API_KEY.AUTHORIZATION];
	if (!accessToken) throw new AuthenticationFail('Invalid request');

	try {
		const decode = decodeToken(accessToken, keyTokenStore.publicKey);
		if (userId !== decode._id?.toString()) throw new AuthenticationFail('Invalid request');
		req.keyStore = keyTokenStore;
		return next();
	} catch (err) {
		throw err;
	}
});

exports.authenticationV2 = asyncHandler(async (req, res, next) => {
	const userId = req.headers[HEADER_API_KEY.CLIENT_ID];
	if (!userId) throw new AuthenticationFail();

	const keyTokenStore = await KeyTokenService.findByUserId(userId);
	if (!keyTokenStore) throw new NotFoundError();

	const refreshToken = req.headers[HEADER_API_KEY.REFRESH_TOKEN];

	if (refreshToken) {
		try {
			const decode = jwt.verify(refreshToken, keyTokenStore.publicKey);
			if (userId !== decode._id?.toString()) throw new AuthenticationFail('Invalid request');
			req.keyStore = keyTokenStore;
			req.user = decode;
			req.refreshToken = refreshToken;
			return next();
		} catch (err) {
			throw err;
		}
	}

	const accessToken = req.headers[HEADER_API_KEY.AUTHORIZATION];
	if (!accessToken) throw new AuthenticationFail('Invalid request');

	try {
		const decode = jwt.verify(accessToken, keyTokenStore.publicKey);
		if (userId !== decode._id?.toString()) throw new AuthenticationFail('Invalid request');
		req.keyStore = keyTokenStore;
		return next();
	} catch (err) {
		throw err;
	}
});

