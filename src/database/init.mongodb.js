const mongoose = require('mongoose');
const { countConnect } = require('../helper/checkConnect');

const uri = 'mongodb://192.168.33.10:27017/shopDEV';

class Database {
	constructor() {
		this.connect();
	}

	connect(type = 'mongodb') {
		const connectStrategy = {
			mongodb: this.connectToMongoDB()
		};
		connectStrategy[type];
	}

	connectToMongoDB() {
		mongoose.set('debug', true);
		mongoose.set('debug', { color: true });
		mongoose
			.connect(uri, { maxPoolSize: 50 })
			.then(() => {
				console.log(`Connected to Mongodb`);
				console.log(`Number of Connections is : ${countConnect()}`);
			})
			.catch((err) => console.log(err));
	}

	static getMongoDBInstance() {
		if (!Database.mongoInstance) {
			Database.mongoInstance = new Database();
		}
		return Database.mongoInstance;
	}

	disconnectMongoDB() {
		mongoose
			.disconnect()
			.then(() => console.log(`This connected MongoDB.`))
			.catch((err) => console.log(err));
	}
}

const instanceMongoDB = Database.getMongoDBInstance();

module.exports = { instanceMongoDB };
