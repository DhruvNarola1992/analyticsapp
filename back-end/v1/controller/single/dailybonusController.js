var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var moment = require('moment')
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        console.log("Daily Bonus");
        var decData = _EncDecData.DEC(req.body.final)
        // console.log(decData)
        var rUserId = decData.userId;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rTime = decData.rtime;
        var data;
        var findDailyBonus = await User.findById(rUserId, { "dailybonus": 1, isActive: 1 });
        var findActive = findDailyBonus.isActive;
        // console.log(findgame)
        if (findActive) {
            data = {
                code: 1,
                msg: MSG.spintaskcoin[0],
                dailybonuslist: findDailyBonus.dailybonus
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
router.post('/:id', async (req, res) => {
    try {
        console.log("Daily Bonus");
        var decData = _EncDecData.DEC(req.body.final)
        // console.log(decData)
        var rUserId = decData.userId;
        var rDay = parseInt(decData.day);
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rTime = decData.rtime;
        var rCoin = parseInt(decData.coin);
        var rWalletId = decData.walletId;
        var rUan = decData.uan;
        var rAppId = decData.appId;
        var data;
        var findDailyBonus = await User.findById(rUserId,
            { "dailybonus": 1, isActive: 1, dailybonusDate: 1, "wallet": 1, "coin" : 1 });
        var filterWallet = findDailyBonus.wallet.filter(data => data._id == rWalletId);
        // var coinWallet = parseInt(filterWallet[0].coin) + parseInt(rCoin); // App wise coin
        var coinWallet = parseInt(findDailyBonus.coin) + parseInt(rCoin); // App wise coin
        var findActive = findDailyBonus.isActive;
        var currentbegindate = moment(new Date()).startOf('day');
        var currentenddate = moment(new Date()).endOf('day');
        var checkDate = moment(currentbegindate).isAfter(findDailyBonus.dailybonusDate);
        var listDailybonus = findDailyBonus.dailybonus;
        // var findDays = listDailybonus.filter(data => data.day == day)[0];
        console.log(typeof listDailybonus);

        if (findActive && checkDate) {
            var arrayActivity = [];
            var objectActivity = {};
            objectActivity['appId'] = rAppId;
            objectActivity['uan'] = rUan;
            objectActivity['type'] = "Dailybonus";
            objectActivity['coin'] = parseInt(rCoin);
            objectActivity['flag'] = true;
            objectActivity['clientdate'] = new Date();
            arrayActivity.push(objectActivity);
            const usersByDailybonus = listDailybonus.map(item => {
                const container = {};
                if (parseInt(item.day) == rDay) {
                    container["day"] = parseInt(item.day);
                    container["coin"] = parseInt(item.coin);
                    container["isLock"] = item.isLock;
                    container["isAdd"] = true;
                } else {
                    container["day"] = parseInt(item.day);
                    container["coin"] = parseInt(item.coin);
                    container["isLock"] = item.isLock;
                    container["isAdd"] = item.isAdd;
                }
                return container;
            })
            await User.update({ "wallet._id": rWalletId }, {
                $set: {
                    dailybonus: usersByDailybonus,
                    dailybonusDate: currentenddate
                },
                $inc: {
                    "coin": parseInt(rCoin),
                    "wallet.$.coin": parseInt(rCoin),
                    "wallet.$.totalcoin": parseInt(rCoin),
                    "totalcoin": parseInt(rCoin),
                    "coindailybonus": parseInt(rCoin),
                    "wallet.$.coindailybonus": parseInt(rCoin)
                }, $push: { activity: arrayActivity }
            });
            data = {
                code: 1,
                msg: MSG.spintaskcoin[0],
                walletcoin: coinWallet,
                dailybonuslist: usersByDailybonus
            }
            // _EncDecData.sendDataToUser(res, data);
        } else {
            data = {
                code: 0,
                msg: MSG.common[1]
            }
        }
        console.log(data)
        _EncDecData.sendDataToUser(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0],
        }
        console.log(error)
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;