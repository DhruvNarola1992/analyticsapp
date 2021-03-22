var express = require('express')
var router = express.Router()
/**
 * 
 * UI API
 * 
 */
/*--- Application ----*/
var uApplicationRouter = require('./controller/ui/applicationController');
router.use('/uApplication', uApplicationRouter);

var uBulkRouter = require('./controller/ui/bulkController');
router.use('/uBulk', uBulkRouter);

var uCoinRouter = require('./controller/ui/coinController');
router.use('/uCoin', uCoinRouter);

var uKeywordRouter = require('./controller/ui/keywordController');
router.use('/uKeyword', uKeywordRouter);

var uNotifyRouter = require('./controller/ui/notificationController');
router.use('/uNotify', uNotifyRouter);

var uReportRouter = require('./controller/ui/reportController');
router.use('/uReport', uReportRouter);

var uSupportRouter = require('./controller/ui/supportController');
router.use('/uSupport', uSupportRouter);

var uTaskRouter = require('./controller/ui/taskController');
router.use('/uTask', uTaskRouter);

var uUserRouter = require('./controller/ui/userController');
router.use('/uUser', uUserRouter);

var uWithdrawRouter = require('./controller/ui/withdrawController');
router.use('/uWithdraw', uWithdrawRouter);

module.exports = router;