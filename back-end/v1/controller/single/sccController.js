var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var Userdailyreport = require('./../../../modal/userdailyreport');
var Applicationdailyreport = require('./../../../modal/appwisedailyreport');
var _EncDecData = require('./../../../common/encrypt')

router.post('/', async (req, res) => {
    try {
        console.log("Scratch");
        var decData = _EncDecData.DEC(req.body.final)
        var rUserId = decData.userId;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rScratchdataId = decData.scratchdataId;
        var rCoin = decData.coin;
        var rWalletId = decData.walletId;
        var rAppId = decData.appId;
        var rTime = decData.rtime;
        var rUan = decData.uan;
        var flagTask = false;
        var data;
        var findScratch = await User.find({ "scratchdata._id": rScratchdataId }, {
            "scratchdata.$": 1, "isActive": 1, "deviceId": 1, "uniqueId": 1, "coin": 1, "wallet": 1
        });
        var compareScratchCard = findScratch[0].scratchdata[0].totalCard;
        var compareCurrentScratchCard = findScratch[0].scratchdata[0].currentCard + 1;
        var filterWallet = findScratch[0].wallet.filter(data => String(data._id) == String(rWalletId));
        var coinWallet = parseInt(filterWallet[0].coin) + parseInt(rCoin);
        var coinMain = parseInt(findScratch[0].coin) + parseInt(rCoin);
        var findActive = findScratch[0].isActive;
        if (compareScratchCard >= compareCurrentScratchCard && findActive) {
            var arrayActivity = [];
            var objectActivity = {};
            objectActivity['appId'] = rAppId;
            objectActivity['uan'] = rUan;
            objectActivity['type'] = "Scratch";
            objectActivity['coin'] = parseInt(rCoin);
            objectActivity['flag'] = true;
            objectActivity['clientdate'] = new Date();
            arrayActivity.push(objectActivity);
            await User.update({ "scratchdata._id": rScratchdataId }, { $inc: { "scratchdata.$.currentCard": 1 } });
            await User.update({ "wallet._id": rWalletId }, {
                $inc: {
                    "coin": parseInt(rCoin),
                    "wallet.$.coin": parseInt(rCoin),
                    "wallet.$.totalcoin": parseInt(rCoin),
                    "totalcoin": parseInt(rCoin),
                    "scratchcount": 1,
                    "wallet.$.scratchcount": 1,
                    "coinscratch": parseInt(rCoin),
                    "wallet.$.coinscratch": parseInt(rCoin)
                }, $push: { activity: arrayActivity }
            });
            await Userdailyreport.findOneAndUpdate({}, {
                $inc: {
                    "scratchcount": 1,
                    "coinscratch": parseInt(rCoin)
                }
            }, { "sort": { "_id": -1 }, "fields": { "_id": 0 }, upsert: true });
            await Applicationdailyreport.findOneAndUpdate({ appId: rAppId }, {
                $inc: {
                    "scratchcount": 1,
                    "coinscratch": parseInt(rCoin)
                }
            }, { "sort": { "_id": -1 }, "fields": { "_id": 0 }, upsert: true });
            if (compareScratchCard == compareCurrentScratchCard) {
                flagTask = true;
            }
        } else {
            flagTask = true;
        }
        if (!flagTask) {
            data = {
                code: 1,
                msg: MSG.spintaskcoin[0],
                scratchdonedata: {
                    walletcoin: coinMain,
                    // walletcoin: coinWallet, -- App Wise Che
                    currentCard: compareCurrentScratchCard,
                    isActive: findActive
                }
            }
        } else {
            data = {
                code: 2,
                msg: MSG.spintaskcoin[2],
                scratchdonedata: {
                    walletcoin: coinMain,
                    // walletcoin: coinWallet, -- App Wise Che 
                    currentCard: compareScratchCard,
                    isActive: findActive
                }
            }
        }
        // console.log(data)
        _EncDecData.sendDataToUser(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0],
        }
        // console.log(error)
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;