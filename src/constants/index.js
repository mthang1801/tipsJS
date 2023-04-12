exports.HEADER_API_KEY = {
	API_KEY: 'x-api-key',
	AUTHORIZATION: 'authorization'
};

exports.ERROR_MESSAGES_CODE = {
	forbiddenResources: {
		message: 'Forbidden Resource',
		code: 403
	},
	permissionDenied: {
		message: 'Permission Denied',
		code: 403
	},
	notFound: {
		message: 'Not Found',
		code: 404
	},
    conflictRequest: {
        message: "Confict Request.",
        code : 409
    },
    badRequest : {
        message: "Bad Request",
        code : 400
    }
};
