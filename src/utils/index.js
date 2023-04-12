const _ = require('lodash');

const getSpecificData = (object = {}, pickedFields = []) => _.pick(object, pickedFields);

const throwError = (errorMessageCode) => {
    const message = errorMessageCode.message;
    const code = errorMessageCode.code; 
    const error = new Error(message);
    error.code = code;
    throw error;
}


module.exports = {
	getSpecificData,
    throwError
};
