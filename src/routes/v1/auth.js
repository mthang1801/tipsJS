const authController = require('../../controllers/auth.controller');
const router = require('../../helper/router');
const { checkApiKey, checkPermission, asyncHandler } = require('../../middlewares/checkAuth');

router.use(checkApiKey);
router.use(checkPermission('0000'));
router.post('/signup', asyncHandler(authController.signUp));
router.post("/login", asyncHandler(authController.login));
module.exports = router;
