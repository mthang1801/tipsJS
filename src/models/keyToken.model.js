const { Schema, model } = require('mongoose'); // Erase if already required
const collections = require('../constants/collections');

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: collections.SHOP
	},
	publicKey: {
		type: String,
		required: true,
        unique: true
	},
	refreshToken: {
		type: Schema.Types.Array,
		default: []
	}
}, {timestamps : true});

//Export the model
module.exports = model(collections.KEY_TOKENS, keyTokenSchema)
