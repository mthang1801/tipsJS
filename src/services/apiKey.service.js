const crypto = require("crypto");
const ApiKeyModel = require("../models/apiKey.model");

class ApiKeyService {
    static async findBy(keys){
        return ApiKeyModel.findOne(keys).lean();
    }

    static async create(){
        return await ApiKeyModel.create({key: crypto.randomBytes(64).toString("hex"), permissions: ["0000"]})
    }
}

module.exports = ApiKeyService