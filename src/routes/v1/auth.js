"use strict"

const { authentication, authenticationV2 } = require('../../auth/authUtils');
const authController = require('../../controllers/auth.controller');
const asyncHandler = require('../../helper/asyncHandler');
const router = require('../../helper/router');
const { checkApiKey, checkPermission } = require('../../middlewares/checkAuth');

router.use(checkApiKey);
router.use(checkPermission('0000'));
router.post('/signup', asyncHandler(authController.signUp));
router.post('/login', asyncHandler(authController.login));

// router.use(authentication);
router.post('/logout', authenticationV2, asyncHandler(authController.logout));
router.post('/handler-refresh-token', authenticationV2, asyncHandler(authController.handlerRefreshToken));
module.exports = router;
