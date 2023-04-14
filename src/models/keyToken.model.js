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
    privateKey: {
        type : String, 
        requried: true,         
    },
    usedRefreshTokens : {
        type: Array,
        default: []
    },
	refreshToken: {
		type: String,		
	}
}, {timestamps : true});

//Export the model
module.exports = model(collections.KEY_TOKENS, keyTokenSchema)
