const configService = require("./configService");

const AppConfig = configService.app();
const DBConfig = configService.db();

module.exports = {
    DBConfig,
    AppConfig
}