const shopController = require('../../controllers/shop.controller');
const router = require('../../helper/router');
const { checkApiKey, checkPermission, asyncHandler } = require('../../middlewares/checkAuth');

router.use(checkApiKey);
router.use(checkPermission('0000'));
router.post('/signup', asyncHandler(shopController.signUp));

module.exports = router;
