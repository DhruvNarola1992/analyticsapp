var express = require('express')
var router = express.Router()





/**
 * 
 * Master Application
 * 
 */
/*---- Add Wallet Master Master App*/
var mAddWalletRouter = require('./controller/rest/addwalletController');
router.use('/addwallet', mAddWalletRouter);

/*---- Application List Master App*/
var mApplicationRouter = require('./controller/rest/applicationController');
router.use('/application', mApplicationRouter);

/*---- Forget Password Module ----*/
var mFpRoute = require('./controller/rest/fpContoller');
router.use('/fpassword', mFpRoute);

/*---- Withdraw History Master App*/
var mHistoryRouter = require('./controller/rest/historyController');
router.use('/history', mHistoryRouter);

/*---- Keyword Master App*/
var mKeywordRouter = require('./controller/rest/keywordController');
router.use('/keyword', mKeywordRouter);

/*---- Leaderboard App*/
var mLeaderboardRouter = require('./controller/rest/lbController');
router.use('/leaderboard', mLeaderboardRouter);

/*---- Login Module ----*/
var mLoginRoute = require('./controller/rest/loginController');
router.use('/login', mLoginRoute);

/*---- Login Module ----*/
var mNotificationRoute = require('./controller/rest/nlController');
router.use('/notify', mNotificationRoute);

/*---- Query List Module ----*/
// var mQueryListRoute = require('./controller/rest/qlController');
// router.use('/lquery', mQueryListRoute);

/*---- Query Module ----*/
var mQueryRoute = require('./controller/rest/queryController');
router.use('/query', mQueryRoute);

/*---- Register Module ----*/
var mRegisterRoute = require('./controller/rest/registerController');
router.use('/register', mRegisterRoute);

/*---- Reward Spin Module ----*/
var mRewardSpinRoute = require('./controller/rest/rewardspinController');
router.use('/rewardspin', mRewardSpinRoute);

/*---- Reset Password Module ----*/
var mRpRoute = require('./controller/rest/rpController');
router.use('/rpassword', mRpRoute);

/*---- Task application wise Master App*/
var mTaskRouter = require('./controller/rest/taskController');
router.use('/task', mTaskRouter);

/*---- Withdraw Request Master App*/
var mWithdrawRouter = require('./controller/rest/withdrawController');
router.use('/withdraw', mWithdrawRouter);

/*---- Wallet application wise Master App*/
var mWalletRouter = require('./controller/rest/wlController');
router.use('/wallet', mWalletRouter);






/**
 * 
 * Single Application 
 * 
 */
/*---- Daily Bonus module ---*/
var sDailyBonusRouter = require('./controller/single/dailybonusController');
router.use('/sDailybonus', sDailyBonusRouter);

/*---- Game Play Coin per application module ---*/
var sCoinGameRouter = require('./controller/single/gcController');
router.use('/sGamecoin', sCoinGameRouter);

 /*---- Login Module ----*/
var sApplicationLoginRoute = require('./controller/single/loginController');
router.use('/slogin', sApplicationLoginRoute);

/*---- Scratch Coin per application module ---*/
var sCoinScratchRouter = require('./controller/single/sccController');
router.use('/sScratchcoin', sCoinScratchRouter);

/**--- Spin Coin per application module --*/
var sCoinSpinRouter = require('./controller/single/scController');
router.use('/sSpincoin', sCoinSpinRouter);

/*---- Scratch per application module ---*/
var sScratchRouter = require('./controller/single/scratchController');
router.use('/sScratch', sScratchRouter);

/*---- Task per application module ---*/
var sTaskRouter = require('./controller/single/taskController');
router.use('/sTask', sTaskRouter);

/*---- Get Coin Task (Click, Download, Impression, Video) ---*/
var sCoinTaskRouter = require('./controller/single/tcController');
router.use('/sTaskcoin', sCoinTaskRouter);

/*---- Verify User ---*/
var sVerifyRouter = require('./controller/single/verifyController');
router.use('/sVerify', sVerifyRouter);


// /*---- Withdraw User ---*/
// var sWithdrawRouter = require('./controller/single/withdrawController');
// router.use('/sWithdraw', sWithdrawRouter);






/**
 * 
 * UI API
 * 
 */
/*--- Application ----*/
var uApplicationRouter = require('./controller/ui/applicationController');
router.use('/uApplication', uApplicationRouter);

var uCoinRouter = require('./controller/ui/coinController');
router.use('/uCoin', uCoinRouter);

var uNotifyRouter = require('./controller/ui/notificationController');
router.use('/uNotify', uNotifyRouter);

var uReportRouter = require('./controller/ui/reportController');
router.use('/uReport', uReportRouter);

var uTaskRouter = require('./controller/ui/taskController');
router.use('/uTask', uTaskRouter);

var uUserRouter = require('./controller/ui/userController');
router.use('/uUser', uUserRouter);

var uWithdrawRouter = require('./controller/ui/withdrawController');
router.use('/uWithdraw', uWithdrawRouter);

module.exports = router;