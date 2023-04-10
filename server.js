const app = require("./src/app");
const { AppConfig } = require("./src/configs");
const { instanceMongoDB } = require("./src/database/init.mongodb");

const PORT = Number(AppConfig.port);

const server = app.listen(PORT, () =>
	console.log(`Server is listening on port ${PORT}`)
);

process.on("SIGINT", () => {
	server.close(() => {
		console.log(`Exited server`);
        instanceMongoDB.disconnectMongoDB()
	});
});
