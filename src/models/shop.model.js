const collections = require('../constants/collections');

const { Schema, model } = require('mongoose');

const shopSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			maxLength: 150
		},
		email: {
			type: String,
			unique: true,
			trim: true,
			lower: true
		},
		password: {
			type: String,
			required: true
		},
		salt: {
			type: String,
			requried: true
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'inactive'
		},
		verify: {
			type: Schema.Types.Boolean,
			default: false
		},
		roles: {
			type: Schema.Types.Array,
			default: []
		}
	},
	{
		timestamps: true,
	}
);

module.exports = model(collections.SHOP, shopSchema);
