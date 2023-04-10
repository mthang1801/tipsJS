const fs = require("fs");
const { join } = require("path");
const { cwd } = require("process");
const getAllKeysFromEnvFile = fs
	.readFileSync(join(cwd(), '.env'), 'utf8')
	.split('\n')
	.filter((row) => !row.startsWith('#'))
	.filter((row) => !row.startsWith('\r'))
	.filter(Boolean)
	.map((row) => row.split('=').slice(0)[0]);

const envKeys = getAllKeysFromEnvFile;
const nodeEnv = process.env.NODE_ENV === "development" ? "DEV" : "PRO";

class ConfigService {
	constructor(env) {
        this.env = env;
    }
	getValue(key, throwOnMissing = false) {
		const value = this.env[key];
		if (value === undefined && throwOnMissing) {
			throw new Error(`read config error - missing env.${key}`);
		}
		return value;
	}

	getValues(keys) {
		keys.forEach((key) => this.getValue(key, true));
		return this;
	}

	app() {
        console.log(`${nodeEnv}_APP_PORT`)
		return {
			port: this.getValue(`${nodeEnv}_APP_PORT`)
		};
	}

	db() {
		return {
			host: this.getValue(`${nodeEnv}_DB_HOST`),
			port: this.getValue(`${nodeEnv}_DB_PORT`),
			username: this.getValue(`${nodeEnv}_DB_USERNAME`),
			password: this.getValue(`${nodeEnv}_DB_PASSWORD`),
			dbName: this.getValue(`${nodeEnv}_DB_NAME`)
		};
	}
}
const configService = new ConfigService(process.env).getValues(envKeys)

module.exports = configService;
