const shopRouter = require("./shop")
const router = require("../../helper/router");

router.use("/v1/shop", shopRouter);

module.exports = router;