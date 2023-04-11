const initRouter = (app) => {
	app.use('/api/', require('./v1'));
};

module.exports = initRouter;
