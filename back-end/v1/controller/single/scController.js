var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var Userdailyreport = require('./../../../modal/userdailyreport');
var Applicationdailyreport = require('./../../../modal/appwisedailyreport');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        // var rTaskdataId = req.body.taskdataId;
        // var rCoin = req.body.coin;
        // var rWalletId = req.body.walletId;
        // var rDeviceId = req.body.deviceId;
        // var rUniqueId = req.body.uniqueId;
        // var rUan = req.body.uan;
        // var rAppId = req.body.appId;
        console.log("Spin");
        var decData = _EncDecData.DEC(req.body.final)

        var rUserId = decData.userId;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rTaskdataId = decData.taskdataId;
        var rCoin = decData.coin;
        var rWalletId = decData.walletId;
        var rUan = decData.uan;
        var rAppId = decData.appId;
        var rTime = decData.rtime;
        var flagTask = false;
        var data;
        var findTask = await User.find({ "taskdata._id": rTaskdataId }, {
            "taskdata.$": 1, "isActive": 1, "deviceId": 1, "uniqueId": 1, "coin": 1, "wallet": 1
        });
        var currentmaxclick = findTask[0].taskdata[0].maxclick;
        var compareTaskSpin = findTask[0].taskdata[0].spin;
        var compareCurrentSpin = findTask[0].taskdata[0].currentspin + 1;
        var filterWallet = findTask[0].wallet.filter(data => data._id == rWalletId);
        var coinWallet = parseInt(filterWallet[0].coin) + parseInt(rCoin);
        var coinMain = parseInt(findTask[0].coin) + parseInt(rCoin);
        var findActive = findTask[0].isActive;
        if (compareTaskSpin >= compareCurrentSpin && findActive == true && currentmaxclick > 0) {
            var arrayActivity = [];
            var objectActivity = {};
            objectActivity['appId'] = rAppId;
            objectActivity['uan'] = rUan;
            objectActivity['type'] = "Spin";
            objectActivity['coin'] = parseInt(rCoin);
            objectActivity['flag'] = true;
            objectActivity['clientdate'] = new Date();
            arrayActivity.push(objectActivity);
            await User.update({ "taskdata._id": rTaskdataId }, { $inc: { "taskdata.$.currentspin": 1 } });
            await User.update({ "wallet._id": rWalletId }, {
                $inc: {
                    "coin" : parseInt(rCoin),
                    "wallet.$.coin": parseInt(rCoin),
                    "wallet.$.totalcoin": parseInt(rCoin),
                    "totalcoin": parseInt(rCoin),
                    "spincount": 1,
                    "wallet.$.spincount": 1,
                    "coinspin": parseInt(rCoin),
                    "wallet.$.coinspin": parseInt(rCoin)
                }, $push: { activity: arrayActivity }
            });
            await Userdailyreport.findOneAndUpdate({}, {
                $inc: {
                    "spincount": 1,
                    "coinspin": parseInt(rCoin)
                }
            }, { "sort": { "_id": -1 }, "fields": { "_id": 0 }, upsert: true });
            await Applicationdailyreport.findOneAndUpdate({ appId: rAppId }, {
                $inc: {
                    "spincount": 1,
                    "coinspin": parseInt(rCoin)
                }
            }, { "sort": { "_id": -1 }, "fields": { "_id": 0 }, upsert: true });
            if (compareTaskSpin == compareCurrentSpin) {
                flagTask = true;
            }
        } else {
            flagTask = true;
        }
        if (!flagTask) {
            data = {
                code: 1,
                msg: MSG.spintaskcoin[0],
                spindata: {
                    walletcoin: coinMain,
                    // walletcoin: coinWallet,
                    currentspin: compareCurrentSpin,
                    isActive: findActive
                }
            }
        } else {
            data = {
                code: 2,
                msg: MSG.spintaskcoin[2],
                spindata: {
                    walletcoin: coinMain,
                    // walletcoin: filterWallet[0].coin,
                    currentspin: compareTaskSpin,
                    isActive: findActive
                }
            }
        }
        // console.log(data)
        // _EncDecData.sendFrontRes(res, data);
        _EncDecData.sendDataToUser(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0],
        }
        // _EncDecData.sendFrontRes(res, data);
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;