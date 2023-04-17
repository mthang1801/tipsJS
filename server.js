const app = require('./src/app');
const { AppConfig } = require('./src/configs');
const { instanceMongoDB } = require('./src/database/init.mongodb');
const http = require('http');
const socketio = require('socket.io');
const initGateways = require('./src/gateways');

const PORT = Number(AppConfig.port);

const server = http.createServer(app);

socketio(server);

initGateways(io);

server.listen(PORT, () => console.log(`server is listening on PORT ${PORT}`));

process.on('SIGINT', () => {
	server.close(() => {
		console.log(`Exited server`);
		instanceMongoDB.disconnectMongoDB();
	});
});
