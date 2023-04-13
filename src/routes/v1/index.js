const authRouter = require('./auth');
const router = require('../../helper/router');

router.use('/v1/auth', authRouter);

module.exports = router;
