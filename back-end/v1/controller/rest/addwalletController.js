var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        // var rUserId = req.body.userId;
        var decData = _EncDecData.DEC(req.body.final)
        var rUserId = decData.userId;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var findUser = await User.findById(rUserId).select({ isActive: 1, wallet: 1, convertCoin: 1, convertAmount: 1, coin: 1, amount: 1 });
        if (findUser != null && findUser.isActive) {
            let walletTotalcoin = 0;
            var walletList = findUser.wallet;
            var data ;
            for (let index = 0; index < walletList.length; index++) {
                const flagWallet = walletList[index].isActive;

                if (flagWallet) {
                    const idWallet = walletList[index]._id;
                    walletTotalcoin += walletList[index].coin;
                    await User.update({ "wallet._id": idWallet }, { $set: { "wallet.$.coin": 0 } })
                }
            }
            if(parseInt(walletTotalcoin) > 0) {
                var walletTotalamount = parseFloat((walletTotalcoin * findUser.convertAmount) / findUser.convertCoin)
                var walletUpdate = await User.findByIdAndUpdate(rUserId, { $inc: { coin: walletTotalcoin, amount: walletTotalamount } },
                    {
                        "fields": {
                            "_id": 0,
                            "wallet.uan": 1,
                            "wallet.icon": 1,
                            "wallet.name": 1,
                            "wallet.isActive": 1,
                            "wallet.coin": 1, "coin": 1, "amount": 1
                        },
                        "new": true
                    })
                data = {
                    code: 1,
                    msg: MSG.masterwalletupdate[0],
                    addwithdraw: walletUpdate
                }
            } else {
                data = {
                    code: 0,
                    msg: MSG.withdraw[1]
                }
                _EncDecData.sendDataToUser(res, data);
            }
            
            // console.log(data, walletUpdate.wallet)
            _EncDecData.sendDataToUser(res, data)
        } else if (checkbalance < 0 && findUser != null) {
            var data = {
                code: 0,
                msg: MSG.withdraw[1]
            }
            _EncDecData.sendDataToUser(res, data);
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