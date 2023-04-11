const {Schema, model} = require("mongoose");
const collections = require("../constants/collections");

const apiKeys = new Schema({
    key: {
        type: String, 
        required: true, 
        unique: true
    },
    status: {
        type: Boolean,
        default : true
    },
    permissions: {
        type: [String],
        required: true,
        enum: ["0000","1111","2222"]
    }
}, {timestamps : true});

module.exports = model(collections.API_KEYS, apiKeys);