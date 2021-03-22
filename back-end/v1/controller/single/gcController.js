var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var Userdailyreport = require('./../../../modal/userdailyreport');
var Applicationdailyreport = require('./../../../modal/appwisedailyreport');
var MSGActivity = require('./../../../common/activity');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        // var rCoin = req.body.coin;
        // var rWalletId = req.body.walletId;
        // var rDeviceId = req.body.deviceId;
        // var rUniqueId = req.body.uniqueId;
        // console.log(req.body.final)
        console.log("Game");
        var decData = _EncDecData.DEC(req.body.final)
        // console.log(decData)
        var rUserId = decData.userId;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rCoin = decData.coin;
        var rWalletId = decData.walletId;
        var rUan = decData.uan;
        var rAppId = decData.appId;
        var rTime = decData.rtime;
        var data;
        var findGame = await User.find({ "wallet._id": rWalletId  },
            { "wallet.$": 1, "coin": 1, isActive: 1, "deviceId": 1, "uniqueId": 1 });
        var findActive = findGame[0].isActive;
        // console.log(findgame)
        if (findGame.length >= 1 && findActive) {
            var arrayActivity = [];
            var objectActivity = {};
            objectActivity['appId'] = rAppId;
            objectActivity['uan'] = rUan;
            objectActivity['type'] = "Play";
            objectActivity['coin'] = parseInt(rCoin);
            objectActivity['flag'] = true;
            objectActivity['clientdate'] = new Date();
            arrayActivity.push(objectActivity);
            await User.updateOne({ "wallet._id": rWalletId, },
                {
                    $push: { activity: arrayActivity },
                    $inc: {
                        "coin": parseInt(rCoin),
                        "totalcoin": parseInt(rCoin), "wallet.$.coin": parseInt(rCoin), "gamecount": 1, "coinplaygame": parseInt(rCoin),
                        "wallet.$.gamecount": 1, "wallet.$.coinplaygame": parseInt(rCoin), "wallet.$.totalcoin": parseInt(rCoin)
                    }
                });
            await Userdailyreport.findOneAndUpdate({}, {
                $inc: {
                    "gamecount": 1,
                    "coinplaygame": parseInt(rCoin)
                }
            }, { "sort": { "_id": -1 }, "fields": { "_id": 0 }, upsert: true });
            await Applicationdailyreport.findOneAndUpdate({ appId: rAppId }, {
                $inc: {
                    "gamecount": 1,
                    "coinplaygame": parseInt(rCoin)
                }
            }, { "sort": { "_id": -1 }, "fields": { "_id": 0 }, upsert: true });
            var coinWallet = parseInt(findGame[0].wallet[0].coin) + parseInt(rCoin);
            data = {
                code: 1,
                msg: MSG.spintaskcoin[0],
                gameplaydata: {
                    walletcoin: coinWallet,
                    isActive: findActive
                }
            }

        } else {
            data = {
                code: 0,
                msg: MSG.common[1]
            }
        }
        // console.log(data)
        _EncDecData.sendDataToUser(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0],
        }
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;