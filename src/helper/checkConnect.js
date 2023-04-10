const { default: mongoose } = require("mongoose");
const os = require("os");
const _SECONDS = 60 * 1000;
// count Connection
const countConnect = () => {
	const numOfConnect = mongoose.connections.length;
	return numOfConnect;
};

// Check Over load connection
const checkOverLoad = () => {
	setInterval(() => {
		const numConnection = countConnect();
		const numCores = os.cpus().length;
		const memoryUsage = process.memoryUsage().rss;
		console.log(`Active connections:: ${numConnection.toFixed(2)}`);
		console.log(`Memory usage:: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Number of cores:: ${numCores}`);
		// Assumed that maximum number of connections base on number of cores
		const maxConnections = numCores * 5;
		if (numConnection > maxConnections) {
			console.log(`Connection overload detected`);
		}
	}, _SECONDS); // monitor every {seconds}
};

module.exports = { countConnect, checkOverLoad };
