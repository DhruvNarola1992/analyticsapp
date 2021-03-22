var express = require('express');
var router = express.Router();
var moment = require('moment');
var mongoose = require('mongoose');
var User = require('./../../../modal/user');
var Task = require('./../../../modal/task');
var Application = require('./../../../modal/application');
var Userdailyreport = require('./../../../modal/userdailyreport');
var Applicationdailyreport = require('./../../../modal/appwisedailyreport');
var Withdraw = require('./../../../modal/withdraw');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        // var rmobilenumber = req.body.mobileNo;
        // var rPassword = req.body.password;
        // var rDeviceId = req.body.deviceId;
        // var rUniqueId = req.body.uniqueId;
        // var rUan = req.body.uan;
        // console.log(req.body.final)
        var decData = _EncDecData.DEC(req.body.final)
        // console.log(req.body.final, "-----------------" ,decData)
        var rmobilenumber = decData.mobileNo;
        var rPassword = decData.password;
        var rFirebaseToken = decData.firebaseToken;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rUan = decData.uan;
        var rTime = decData.rtime;
        var findUser = await User.find({ mobileNo: rmobilenumber }, {
            deviceId: 1, uniqueId: 1, name: 1, mobileNo: 1, password: 1, wallet: 1, isActive: 1, taskdata: 1,
            dailybonus: 1, dailybonusDate: 1, "coin": 1, referCode: 1, getreferCoin: 1, minwithcoin: 1,
            withdrawArray: 1,
            "amount": 1
        });

        var currentenddate = moment(new Date()).endOf('day');
        var checkDate = moment(currentenddate).isAfter(findUser[0].dailybonusDate);
        var listDailybonus = findUser[0].dailybonus;
        var currentstartdate = moment(new Date()).add(-1, "days").endOf('day');
        var flag = false;

        if (checkDate) {
            console.log("Daily Bonus..Login")
            const usersByDailybonus = listDailybonus.map(item => {
                const container = {};
                if (item.isAdd == false && flag == false) {
                    container["day"] = parseInt(item.day);
                    container["coin"] = parseInt(item.coin);
                    container["isLock"] = false;
                    container["isAdd"] = item.isAdd;
                    flag = true;
                } else {
                    container["day"] = parseInt(item.day);
                    container["coin"] = parseInt(item.coin);
                    container["isLock"] = item.isLock;
                    container["isAdd"] = item.isAdd;
                }
                return container;
            })
            await User.findByIdAndUpdate(findUser[0]._id, { $set: { firebaseToken: rFirebaseToken, dailybonus: usersByDailybonus, dailybonusDate: new Date(currentstartdate) } }, {
                "fields": { "_id": 0 }, "new": true
            });
        }

        var allWallet = findUser[0].wallet;
        var findApp = await allWallet.filter(data => data.uan == rUan);
        var allTask = findUser[0].taskdata;
        var findTask = await allTask.filter(data => data.uan == rUan);
        var taskArray = [];
        if (findTask.length == 0) {
            var rUserId = findUser[0]._id;
            var findApplication = await Application.find({ uan: rUan }, { uan: 1, todayassigntask: 1, todayassignclick: 1, taskclickpercentage: 1 }).sort({ totalassignclick: 1 }).lean();
            if (findApplication.length > 0) {
                // var assginClick = false;
                for (let index = 0; index < findApplication.length; index++) {
                    const uan = findApplication[index].uan;
                    const appId = findApplication[index]._id;
                    var getCurrentpercentage = -1;
                    var findTask;
                    var getAppTodayassgintask = parseInt(findApplication[index].todayassigntask);
                    var getAppTodayassignclick = parseInt(findApplication[index].todayassignclick);
                    var getRequirepercentage = parseFloat(findApplication[index].taskclickpercentage);
                    if (getAppTodayassgintask > 0) {
                        getCurrentpercentage = (getAppTodayassignclick * 100) / getAppTodayassgintask;
                    }
                    console.log(getCurrentpercentage, getRequirepercentage, getAppTodayassgintask, getAppTodayassignclick, findApplication)
                    if (getCurrentpercentage >= getRequirepercentage) {
                        findTask = await Task.aggregate([{ $match: { isClick: false } }]).sample(1);
                    } else {
                        findTask = await Task.aggregate().sample(1);
                        // if(assginClick) {
                        //     findTask = await Task.aggregate([{$match: { isClick : false }}]).sample(1);
                        // } else {
                        //     findTask = await Task.aggregate().sample(1);
                        //     assginClick = true;
                        // }
                    }
                    const task = findTask[0].task;
                    const spin = findTask[0].spin;
                    const taskId = findTask[0]._id;
                    const maxclick = findTask[0].maxclick;
                    const maxtimeclick = findTask[0].maxtimeclick;
                    const mintimeclick = findTask[0].mintimeclick;
                    const clicktimer = findTask[0].clicktimer;
                    const isClickTask = findTask[0].isClick;
                    var taskObject = {
                        task: task,
                        spin: spin,
                        currentspin: 0,
                        currenttask: "",
                        taskId: taskId,
                        uan: uan,
                        appId: appId,
                        maxclick: maxclick,
                        maxtimeclick: maxtimeclick,
                        mintimeclick: mintimeclick,
                        clicktimer: clicktimer
                    }
                    taskArray.push(taskObject);
                    await User.findByIdAndUpdate(rUserId, { $push: { taskdata: taskArray }, $set: { firebaseToken: rFirebaseToken } }, { "fields": { "_id": 0 }, "new": true });
                    if (isClickTask) {
                        await Applicationdailyreport.findOneAndUpdate({ appId: appId }, {
                            $inc: {
                                todayassigntask: 1,
                                todayassignclick: 1
                            }
                        }, { new: true, sort: { '_id': -1 } });
                        await Userdailyreport.findOneAndUpdate({}, {
                            $inc: {
                                todayassigntask: 1,
                                todayassignclick: 1
                            }
                        }, { new: true, sort: { '_id': -1 } });
                        await Application.findByIdAndUpdate(appId, {
                            $inc: {
                                totalassigntask: 1, todayassigntask: 1,
                                totalassignclick: 1, todayassignclick: 1
                            }
                        }, {
                            "fields": { "_id": 0 },
                            "new": true
                        });
                    } else {
                        await Applicationdailyreport.findOneAndUpdate({ appId: appId }, {
                            $inc: {
                                todayassigntask: 1
                            }
                        }, { new: true, sort: { '_id': -1 } });
                        await Userdailyreport.findOneAndUpdate({}, {
                            $inc: {
                                todayassigntask: 1
                            }
                        }, { new: true, sort: { '_id': -1 } });
                        await Application.findByIdAndUpdate(appId, {
                            $inc: {
                                totalassigntask: 1,
                                todayassigntask: 1
                            }
                        }, {
                            "fields": { "_id": 0 },
                            "new": true
                        });
                    }
                    var findScratch = findTask[0].scratch;
                    var scratchArray = [];
                    if (findScratch.length > 0) {
                        for (let indexScratch = 0; indexScratch < findScratch.length; indexScratch++) {
                            const selectcoin = findScratch[indexScratch].selectcoin;
                            const totalCard = findScratch[indexScratch].totalCard;
                            const scratchimage = findScratch[indexScratch].scratchimage;
                            var scratchObject = {
                                selectcoin: selectcoin,
                                totalCard: totalCard,
                                currentCard: 0,
                                scratchimage: scratchimage,
                                taskId: taskId,
                                uan: uan,
                                appId: appId
                            }
                            scratchArray.push(scratchObject);
                        }
                        await User.findByIdAndUpdate(rUserId, { $push: { scratchdata: scratchArray }, $set: { firebaseToken: rFirebaseToken } }, { "fields": { "_id": 0 }, "new": true });
                    }
                }
            }
        }

        var comparePassword = findUser[0].password;

        if (findUser.length >= 1) {
            var data;
            if (comparePassword.trim() == rPassword.trim()) {
                var lastWithdraw = await Withdraw.find({ userId: mongoose.Types.ObjectId(findUser[0]._id) }).sort({ _id: -1 }).select({ status: 1, coin: 1, amount: 1 }).lean();
                if (lastWithdraw.length > 0) {
                    if (lastWithdraw[0].status != "PENDING") {
                        lastWithdraw = 0;
                    } else {
                        lastWithdraw = lastWithdraw[0].coin;
                    }
                } else {
                    lastWithdraw = 0;
                }
                // console.log(lastWithdraw);
                data = {
                    code: 1,
                    msg: MSG.login[0],
                    login: {
                        deviceId: findUser[0].deviceId,
                        uniqueId: findUser[0].uniqueId,
                        name: findUser[0].name,
                        mobileNo: findUser[0].mobileNo,
                        userId: findUser[0]._id,
                        password: findUser[0].password,
                        walletId: findApp[0]._id,
                        appId: findApp[0].appId,
                        coin: findUser[0].coin,
                        amount: findUser[0].amount,
                        walletcoin: findUser[0].coin,
                        isActive: findUser[0].isActive,  //User block           -- false -- master block
                        isApp: findApp[0].isActive,      //Application block    -- false -- 
                        referCode: findUser[0].referCode,
                        getreferCoin: findUser[0].getreferCoin,
                        minwithcoin: findUser[0].minwithcoin,
                        withdrawArray: findUser[0].withdrawArray,
                        getLastWithdraw: lastWithdraw
                        // isTask: flagTask,            //Task complete or not -- true
                        // isClick: flagClick           //Click max or not     
                    }
                }
            } else {
                data = {
                    code: 0,
                    msg: MSG.login[1]
                }
            }
            // console.log(data)
            _EncDecData.sendDataToUser(res, data)
        } else {
            var data = {
                code: 0,
                msg: MSG.login[1]
            }
            // console.log(data)
            _EncDecData.sendDataToUser(res, data);
        }
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        // console.log(error)
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;