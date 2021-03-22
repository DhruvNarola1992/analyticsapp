var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var Userdailyreport = require('./../../../modal/userdailyreport');
var Applicationdailyreport = require('./../../../modal/appwisedailyreport');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var decData = _EncDecData.DEC(req.body.final)
        console.log(decData)
        var rUserId = decData.userId;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rTaskdataId = decData.taskdataId;
        var rWalletId = decData.walletId;
        var rFlagTaskComplete = decData.flagtask == true || decData.flagtask == 'true' ? true : false;
        var rTasktype = decData.tasktype;
        var rAppId = decData.appId;
        var rTime = decData.rtime;
        var flagTask = false;
        var data;
        var coinWallet = 0;
        var addCoin = 0;
        var successimpression = 0;
        var failimpression = 0;
        var successclick = 0;
        var failclick = 0;
        var coinimpression = 0;
        var coinclick = 0;
        var totalimpression = 0;
        var totalclick = 0;
        var maxclick = 0;
        var findTask = await User.find({ "taskdata._id": rTaskdataId, "deviceId": rDeviceId, "uniqueId": rUniqueId, "isActive": true }, {
            "taskdata.$": 1, "isActive": 1, "deviceId": 1, "uniqueId": 1, "coin": 1, "wallet": 1, "bannerCoin": 1, "clickCoin": 1
        });
        var compareTaskLength = findTask[0].taskdata[0].task.split(',').length;
        var compareCurrentTaskLength = findTask[0].taskdata[0].currenttask.split(',').length;
        var currentmaxclick = findTask[0].taskdata[0].maxclick;
        var nullCurrentTask = findTask[0].taskdata[0].currenttask;
        var filterWallet = findTask[0].wallet.filter(data => data._id == rWalletId);
        // console.log(rFlagTaskComplete, typeof rFlagTaskComplete, filterWallet[0].coin)
        if (rFlagTaskComplete) {
            if (rTasktype == 'D') {
                addCoin = findTask[0].bannerCoin;
                coinWallet = parseInt(filterWallet[0].coin) + parseInt(addCoin);
            } else if (rTasktype == 'C') {
                maxclick = currentmaxclick -1;
                totalclick = 1;
                successclick = 1;
                coinclick = findTask[0].clickCoin;
                addCoin = findTask[0].clickCoin;
                coinWallet = parseInt(filterWallet[0].coin) + parseInt(addCoin);
            } else if (rTasktype == 'V') {
                addCoin = findTask[0].bannerCoin;
                coinWallet = parseInt(filterWallet[0].coin) + parseInt(addCoin);
            } else {
                totalimpression = 1;
                successimpression = 1;
                coinimpression = findTask[0].bannerCoin;
                addCoin = findTask[0].bannerCoin;
                coinWallet = parseInt(filterWallet[0].coin) + parseInt(addCoin);
            }
        } else {
            coinWallet = parseInt(filterWallet[0].coin);
            if (rTasktype == 'D') {

            } else if (rTasktype == 'C') {
                maxclick = currentmaxclick - 1;
                failclick = 1;
                totalclick = 1;
            } else if (rTasktype == 'V') {

            } else {
                totalimpression = 1;
                failimpression = 1;
            }
        }
        console.log(coinWallet, addCoin)
        if (compareTaskLength >= compareCurrentTaskLength) {
            if (compareCurrentTaskLength == 1 && nullCurrentTask == "") {
                nullCurrentTask += rFlagTaskComplete;
                await User.update({ "taskdata._id": rTaskdataId }, { $set: { "taskdata.$.currenttask": rFlagTaskComplete } , $inc: { "taskdata.$.maxclick" : maxclick } });
            } else {
                nullCurrentTask += "," + rFlagTaskComplete;
                await User.update({ "taskdata._id": rTaskdataId }, { $set: { "taskdata.$.currenttask": nullCurrentTask }, $inc: { "taskdata.$.maxclick" : maxclick } });
            }
            if(maxclick > 0 || compareCurrentTaskLength == compareTaskLength) {
                await User.update({ "wallet._id": rWalletId }, {
                    $inc: {
                        "wallet.$.coin": parseInt(addCoin),
                        "wallet.$.totalcoin": parseInt(addCoin),
                        "totalcoin": parseInt(addCoin),
                        "successimpression": successimpression,
                        "failimpression": failimpression,
                        "successclick": successclick,
                        "failclick": failclick,
                        "totalclick": totalclick,
                        "totalimpression": totalimpression,
                        "coinimpression": coinimpression,
                        "coinclick":coinclick,
                        "wallet.$.successimpression": successimpression,
                        "wallet.$.failimpression": failimpression,
                        "wallet.$.successclick": successclick,
                        "wallet.$.failclick": failclick,
                        "wallet.$.coinimpression": coinimpression,
                        "wallet.$.coinclick": coinclick
                    }
                });
                await Userdailyreport.findOneAndUpdate({}, { 
                    $inc: {
                        "totalimpression": totalimpression,
                        "totalclick": totalclick,
                        "successimpression": successimpression,
                        "failimpression": failimpression,
                        "successclick": successclick,
                        "failclick": failclick,
                        "coinimpression": coinimpression,
                        "coinclick":coinclick
                    }
                }, { "sort" : { "_id" : -1 }, "fields": { "_id": 0 }, upsert: true });
                await Applicationdailyreport.findOneAndUpdate({appId: rAppId}, {
                    $inc: {
                        "totalimpression": totalimpression,
                        "totalclick": totalclick,
                        "successimpression": successimpression,
                        "failimpression": failimpression,
                        "successclick": successclick,
                        "failclick": failclick,
                        "coinimpression": coinimpression,
                        "coinclick":coinclick
                    }
                }, { "sort" : { "_id" : -1 }, "fields": { "_id": 0 }, upsert: true});
            } else {
                await User.update({ "wallet._id": rWalletId }, {
                    $inc: {
                        "successimpression": successimpression,
                        "failimpression": failimpression,
                        "successclick": successclick,
                        "failclick": failclick,
                        "totalclick": totalclick,
                        "totalimpression": totalimpression,
                        "wallet.$.successimpression": successimpression,
                        "wallet.$.failimpression": failimpression,
                        "wallet.$.successclick": successclick,
                        "wallet.$.failclick": failclick,
                    }
                });
                await Userdailyreport.findOneAndUpdate({}, { 
                    $inc: {
                        "totalimpression": totalimpression,
                        "totalclick": totalclick,
                        "successimpression": successimpression,
                        "failimpression": failimpression,
                        "successclick": successclick,
                        "failclick": failclick,
                        "coinimpression": coinimpression,
                        "coinclick":coinclick
                    }
                }, { "sort" : { "_id" : -1 }, "fields": { "_id": 0 }, upsert: true });
                await Applicationdailyreport.findOneAndUpdate({appId: rAppId}, {
                    $inc: {
                        "totalimpression": totalimpression,
                        "totalclick": totalclick,
                        "successimpression": successimpression,
                        "failimpression": failimpression,
                        "successclick": successclick,
                        "failclick": failclick,
                        "coinimpression": coinimpression,
                        "coinclick":coinclick
                    }
                }, { "sort" : { "_id" : -1 }, "fields": { "_id": 0 }, upsert: true});
            }
            if (compareTaskLength == compareCurrentTaskLength) {
                flagTask = true;
            } 
        } else {
            flagTask = true;
        }
        if (!flagTask) {
            if (rFlagTaskComplete) {
                data = {
                    code: 1,
                    msg: MSG.spintaskcoin[0],
                    taskdonedata: {
                        walletcoin: coinWallet,
                        currenttask: nullCurrentTask
                    }
                }
            } else {
                data = {
                    code: 1,
                    msg: MSG.spintaskcoin[1],
                    taskdonedata: {
                        walletcoin: coinWallet,
                        currenttask: nullCurrentTask
                    }
                }
            }
        } else {
            data = {
                code: 2,
                msg: MSG.spintaskcoin[2],
                taskdonedata: {
                    walletcoin: filterWallet[0].coin,
                    currenttask: nullCurrentTask
                }
            }
        }
        console.log(data)
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