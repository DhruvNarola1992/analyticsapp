var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var Userdailyreport = require('./../../../modal/userdailyreport');
var Applicationdailyreport = require('./../../../modal/appwisedailyreport');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        // var rUserId = req.body.userId;
        // var rDeviceId = req.body.deviceId;
        // var rUniqueId = req.body.uniqueId;
        // var rTaskdataId = req.body.taskdataId;
        // var rWalletId = req.body.walletId;
        // var rTasktype = req.body.tasktype;
        // var rAppId = req.body.appId;
        // var rFlagTaskComplete = req.body.flagtask == true || req.body.flagtask == 'true' ? true : false;
        
        var decData = _EncDecData.DEC(req.body.final)
        
        var rUserId = decData.userId;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rTaskdataId = decData.taskdataId;
        var rWalletId = decData.walletId;
        var rTasktype = decData.tasktype;
        var rAppId = decData.appId;
        var rFlagTaskComplete = decData.flagtask == true || decData.flagtask == 'true' ? true : false;
        var rUan = decData.uan;
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
        var findTask = await User.find({ "taskdata._id": rTaskdataId }, {
            "taskdata.$": 1, "isActive": 1, "deviceId": 1, "uniqueId": 1, "coin": 1, "wallet": 1, "bannerCoin": 1, "clickCoin": 1
        });
        var compareTask = findTask[0].taskdata[0].task.trim().split(',');
        var compareTaskLength = findTask[0].taskdata[0].task.trim().split(',').length;
        var compareCurrentTask = findTask[0].taskdata[0].currenttask.trim().split(',');
        var compareCurrentTaskLength = findTask[0].taskdata[0].currenttask.trim().split(',').length;
        var currentmaxclick = findTask[0].taskdata[0].maxclick;
        var nullCurrentTask = findTask[0].taskdata[0].currenttask.trim();
        var isMaxClick = findTask[0].taskdata[0].isClick;
        var isTask = findTask[0].taskdata[0].isActive;
        var filterWallet = findTask[0].wallet.filter(data => data._id == rWalletId);
        var findActive = findTask[0].isActive;

        if (compareCurrentTask == "") {
            compareCurrentTaskLength = 0;
        }

        //Max Click Equal to zero 
        if(currentmaxclick <= 0) {
            isMaxClick = true;
        }

        if (rFlagTaskComplete) {
            if (rTasktype == compareTask[compareCurrentTaskLength]) {
                if (rTasktype == "CB" || rTasktype == "CI" || rTasktype == "CV") {
                    coinclick = findTask[0].clickCoin;
                    addCoin = findTask[0].clickCoin;
                    // coinWallet = parseInt(filterWallet[0].coin) + parseInt(addCoin); -- App wise task
                    coinWallet = parseInt(findTask[0].coin) + parseInt(addCoin);
                    successclick = 1;
                    totalclick = 1;
                    maxclick = -1;
                    currentmaxclick += - 1;
                    if (currentmaxclick <= 0) {
                        isMaxClick = true;
                    }
                } else {
                    coinimpression = findTask[0].bannerCoin;
                    addCoin = findTask[0].bannerCoin;
                    // coinWallet = parseInt(filterWallet[0].coin) + parseInt(addCoin); -- App wise task
                    coinWallet = parseInt(findTask[0].coin) + parseInt(addCoin); 
                    successimpression = 1;
                    totalimpression = 1;
                }
            } else {
                if (rTasktype == "CB" || rTasktype == "CI" || rTasktype == "CV") {
                    failclick = 1;
                    totalclick = 1;
                    maxclick = -1;
                    currentmaxclick += - 1;
                    if (currentmaxclick <= 0) {
                        isMaxClick = true;
                    }

                } else {
                    failimpression = 1;
                    totalimpression = 1;
                }
                // coinWallet = parseInt(filterWallet[0].coin); -- App wise task
                coinWallet = parseInt(findTask[0].coin)
                //Add logic CB ,CV
                rFlagTaskComplete = false; //Dhruv bhai ne puchu karyu che
            }
        } else {
            if (rTasktype == "CB" || rTasktype == "CI" || rTasktype == "CV") {
                failclick = 1;
                totalclick = 1;
                maxclick = -1;
                currentmaxclick += - 1;
                if (currentmaxclick <= 0) {
                    isMaxClick = true;
                }
            } else {
                failimpression = 1;
                totalimpression = 1;
            }
            // coinWallet = parseInt(filterWallet[0].coin); -- App wise task
            coinWallet = parseInt(findTask[0].coin)
        }

        if (compareCurrentTask == "") {
            nullCurrentTask += rFlagTaskComplete;
        } else {
            nullCurrentTask += "," + rFlagTaskComplete;
        }
        if (compareCurrentTaskLength == compareTaskLength - 1 && compareCurrentTaskLength > 1) {
            isTask = false;
        }

        if (findActive) {
            var arrayActivity = [];
            var objectActivity = {};
            objectActivity['appId'] = rAppId;
            objectActivity['uan'] = rUan;
            objectActivity['type'] = rTasktype;
            objectActivity['coin'] = parseInt(addCoin);
            objectActivity['flag'] = rFlagTaskComplete;
            objectActivity['clientdate'] = new Date();
            arrayActivity.push(objectActivity);
            if(compareTaskLength >= compareCurrentTaskLength) {
                if(compareTaskLength > compareCurrentTaskLength) {
                    await User.update({ "taskdata._id": rTaskdataId }, {
                        $set: {
                            "taskdata.$.currenttask": nullCurrentTask,
                            "taskdata.$.isActive": isTask,
                            "taskdata.$.isClick": isMaxClick
                        }, $inc: { "taskdata.$.maxclick": maxclick }
                    });
                } else {
                    await User.update({ "taskdata._id": rTaskdataId }, {
                        $set: {
                            "taskdata.$.isActive": false,
                            "taskdata.$.isClick": isMaxClick
                        }, $inc: { "taskdata.$.maxclick": maxclick }
                    });
                }
            }
            await User.update({ "wallet._id": rWalletId }, {
                $inc: {
                    "coin" : parseInt(addCoin),
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
                    "coinclick": coinclick,
                    "wallet.$.totalimpression": totalimpression,
                    "wallet.$.totalclick": totalclick,
                    "wallet.$.successimpression": successimpression,
                    "wallet.$.failimpression": failimpression,
                    "wallet.$.successclick": successclick,
                    "wallet.$.failclick": failclick,
                    "wallet.$.coinimpression": coinimpression,
                    "wallet.$.coinclick": coinclick
                },
                $push: { activity: arrayActivity }
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
                    "coinclick": coinclick
                }
            }, { "sort": { "_id": -1 }, "fields": { "_id": 0 }, upsert: true });
            await Applicationdailyreport.findOneAndUpdate({ appId: rAppId }, {
                $inc: {
                    "totalimpression": totalimpression,
                    "totalclick": totalclick,
                    "successimpression": successimpression,
                    "failimpression": failimpression,
                    "successclick": successclick,
                    "failclick": failclick,
                    "coinimpression": coinimpression,
                    "coinclick": coinclick
                }
            }, { "sort": { "_id": -1 }, "fields": { "_id": 0 }, upsert: true });
        }


        if (isTask && !isMaxClick && findActive) {
            if (rFlagTaskComplete) {
                data = {
                    code: 1,
                    msg: MSG.spintaskcoin[0],
                    taskdonedata: {
                        walletcoin: coinWallet,
                        currenttask: nullCurrentTask,
                        isClick: isMaxClick,
                        isTask: isTask,
                        isActive: findActive //Dhruv bhai ne puchu karyu che
                    }
                }
            } else {
                data = {
                    code: 1,
                    msg: MSG.spintaskcoin[1],
                    taskdonedata: {
                        walletcoin: coinWallet,
                        currenttask: nullCurrentTask,
                        isClick: isMaxClick,
                        isTask: isTask,
                        isActive: findActive //Dhruv bhai ne puchu karyu che
                    }
                }
            }
        } else {
            if(isMaxClick) {
                data = {
                    code: 3,
                    msg: MSG.spintaskcoin[2],
                    taskdonedata: {
                        // walletcoin: filterWallet[0].coin, // app wise task
                        walletcoin: findTask[0].coin,
                        currenttask: nullCurrentTask,
                        isClick: isMaxClick,
                        isTask: isTask,
                        isActive: findActive //Dhruv bhai ne puchu karyu che
                    }
                }
            } else if(!findActive) {
                data = {
                    code: 4,
                    msg: MSG.spintaskcoin[2],
                    taskdonedata: {
                        // walletcoin: filterWallet[0].coin, -- app wise task
                        walletcoin: findTask[0].coin,
                        currenttask: nullCurrentTask,
                        isClick: isMaxClick,
                        isTask: isTask,
                        isActive: findActive //Dhruv bhai ne puchu karyu che
                    }
                }
            } else {
                data = {
                    code: 2,
                    msg: MSG.spintaskcoin[2],
                    taskdonedata: {
                        // walletcoin: filterWallet[0].coin, //app wise task
                        walletcoin: findTask[0].coin,
                        currenttask: nullCurrentTask,
                        isClick: isMaxClick,
                        isTask: isTask,
                        isActive: findActive //Dhruv bhai ne puchu karyu che
                    }
                }
            }
        }
        
        // _EncDecData.sendFrontRes(res, data);
        _EncDecData.sendDataToUser(res, data);
    } catch (error) {
        console.log(error)
        var data = {
            code: 0,
            msg: MSG.common[0],
        }
        
        // _EncDecData.sendFrontRes(res, data);
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;