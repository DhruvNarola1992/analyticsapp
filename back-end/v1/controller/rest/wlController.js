var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        // var rUserId = req.body.userId;
        var decData = _EncDecData.DEC(req.body.final);
        var rUserId = decData.userId;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rTime = decData.rtime;
        console.log(new Date(rTime), new Date());
        var findWallet = await User.findById(rUserId, { 
            "wallet.uan":1 , 
            "wallet.icon":1 , 
            "wallet.name" : 1,
            "wallet.isActive" : 1,
            "wallet.coin" : 1,
             _id: 0 }).lean();
        if (findWallet != null) {
            var data = {
                code: 1,
                msg: MSG.walletbyapplication[0],
                walletlist: findWallet.wallet
            }
            // console.log(data)
            _EncDecData.sendDataToUser(res, data)
        } else {
            var data = {
                code: 0,
                msg: MSG.common[1]
            }
            _EncDecData.sendDataToUser(res, data);
        }
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;