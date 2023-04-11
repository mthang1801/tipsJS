const KeyTokenModel = require("../models/keyToken.model");

class KeyTokenService { 
    static async create({userId, publicKey}) {
        try {
            const publicKeyString = publicKey.toString();
            await KeyTokenModel.create({userId, publicKey: publicKeyString});
            return publicKeyString
        } catch (error) {
            console.log(error.stack)
            return error;
        }
    }
}

module.exports = KeyTokenService