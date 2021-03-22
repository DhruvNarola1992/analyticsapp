var express = require('express');
var router = express.Router();
const Hashids = require('hashids/cjs')
var moment = require('moment');
var Application = require('./../../../modal/application');
var Userdailyreport = require('./../../../modal/userdailyreport');
var Applicationdailyreport = require('./../../../modal/appwisedailyreport');
var Task = require('./../../../modal/task');
var Coin = require('./../../../modal/coin');
var User = require('./../../../modal/user');
var Keyword = require('./../../../modal/keyword');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt');
// const { find } = require('./../../../modal/user');
router.post('/', async (req, res) => {
    try {
        var decData = _EncDecData.DEC(req.body.final)
        console.log(decData, req.body.final)
        var rName = decData.name;
        var rmobilenumber = decData.mobileNo;
        var rPassword = decData.password;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rFirebaseToken = decData.firebaseToken;
        var rReference = decData.reference;
        var createRefercode = rmobilenumber + rDeviceId + rUniqueId;
        var rRefercode = new Hashids(createRefercode);
        var rTaskDate = moment(new Date()).startOf('day');
        var rWithdrawDate = moment(new Date()).subtract(3, "days").format();
        
        var findKeyword = await Keyword.findOne({keyword: "DailyBonus"}, {_id:0, value: 1}).lean();
        // var findReference = await User.countDocuments({ referCode: rReference });
        var findMobilenumber = await User.countDocuments({ mobileNo: rmobilenumber });
        // var findDeviceId = await User.countDocuments({ deviceId: rDeviceId });
        // var findUniqueId = await User.countDocuments({ uniqueId: rUniqueId });
        var allApplication = await Application.find({}, { uan: 1, icon: 1, isActive: 1, name: 1 }).lean();
        var findApplication = await Application.find({ isActive: true }, { uan: 1, todayassigntask: 1, todayassignclick: 1, taskclickpercentage: 1 }).sort({ totalassignclick: 1 }).lean();
        // var findTask = await Task.aggregate().sample(findApplication.length);
        var findCoin = await Coin.find().limit(1).lean();
        // console.log(findKeyword)
        // console.log(JSON.parse(findKeyword.value))
        var dailybonusConvert = {data: 0} ; //JSON.parse(findKeyword.value);
        // console.log(dailybonusConvert)
        var walletArray = [];
        if (allApplication.length > 0) {
            for (let index = 0; index < allApplication.length; index++) {
                var uan = allApplication[index].uan;
                var icon = allApplication[index].icon;
                var appId = allApplication[index]._id;
                var isActive = allApplication[index].isActive;
                var name = allApplication[index].name;
                var walletObject = {
                    uan: uan,
                    icon: icon,
                    appId: appId,
                    isActive: isActive,
                    name: name,
                    coin: 0,
                    totalcoin: 0
                }
                walletArray.push(walletObject)
            }
        }

        if (/*findReference >= 1 &&*/ findMobilenumber == 0 /*&& findDeviceId == 0 && findUniqueId == 0*/) {
            var insertUser = new User({
                name: rName,
                mobileNo: rmobilenumber,
                referCode: rRefercode.encode(1, 2, 3),
                reference: rReference,
                password: rPassword,
                deviceId: rDeviceId,
                uniqueId: rUniqueId,
                firebaseToken: rFirebaseToken,
                taskDate: rTaskDate,
                withdrawDate: rWithdrawDate,
                filterTaskDate: rTaskDate,
                wallet: walletArray,
                dailybonus: dailybonusConvert.data,
                dailybonusDate: rWithdrawDate, 
                //Constant Data
                filterTaskDay : findCoin[0].consttaskday, 
                convertCoin: findCoin[0].coin, 
                convertAmount: findCoin[0].amount, 
                bannerCoin: findCoin[0].bcoin,     
                clickCoin: findCoin[0].ccoin,     
                referCoin: findCoin[0].rcoin,
                minwithcoin: findCoin[0].minwithcoin,
                withdrawArray: findCoin[0].withdrawarray,
                createDate: new Date()
            })
            var rReturn = await insertUser.save();
            var taskArray = [];
            var scratchArray = [];
            var rUserId = rReturn._id;
            if (findApplication.length > 0 ) {
                await Userdailyreport.findOneAndUpdate({}, {
                    $inc: {
                        todayregister: 1
                    } 
                },{ new: true, sort: { '_id': -1 } });
                var assginClick = false;
                for (let index = 0; index < findApplication.length; index++) {
                    const appId = findApplication[index]._id;
                    const uan = findApplication[index].uan;
                    var getCurrentpercentage = -1;
                    var findTask ;
                    var getAppTodayassgintask = parseInt(findApplication[index].todayassigntask);
                    var getAppTodayassignclick = parseInt(findApplication[index].todayassignclick);
                    var getRequirepercentage = parseFloat(findApplication[index].taskclickpercentage);
                    if(getAppTodayassgintask > 0) {
                        getCurrentpercentage = (getAppTodayassignclick * 100) / getAppTodayassgintask;
                    }
                    console.log(getCurrentpercentage, getRequirepercentage, getAppTodayassgintask, getAppTodayassignclick, findApplication)
                    if(getCurrentpercentage >=  getRequirepercentage) {
                        findTask = await Task.aggregate([{$match: { isClick : false }}]).sample(1);
                    } else {
                        //Prevoius task assign karvano -- //Filter vala task -- all our filter
                        if(assginClick) {
                            findTask = await Task.aggregate([{$match: { isClick : false }}]).sample(1);
                        } else {
                            findTask = await Task.aggregate().sample(1);
                            assginClick = true;
                        }
                        
                    }
                    // console.log("TASk " + findTask)
                    const task = findTask[0].task;
                    const spin = findTask[0].spin;
                    const maxclick = findTask[0].maxclick;
                    const maxtimeclick = findTask[0].maxtimeclick;
                    const mintimeclick = findTask[0].mintimeclick;
                    const clicktimer = findTask[0].clicktimer;
                    const taskId = findTask[0]._id;
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
                    if (isClickTask) {
                        await Applicationdailyreport.findOneAndUpdate({appId: appId},{
                            $inc: {
                                todayassigntask: 1,
                                todayassignclick: 1
                            }  
                        },{ new: true, sort: { '_id': -1 } });
                        await Userdailyreport.findOneAndUpdate({},{
                            $inc: {
                                todayassigntask: 1,
                                todayassignclick: 1
                            }  
                        },{ new: true, sort: { '_id': -1 } });
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
                        await Applicationdailyreport.findOneAndUpdate({appId: appId},{
                            $inc: {
                                todayassigntask: 1
                            }  
                        },{ new: true, sort: { '_id': -1 } });
                        await Userdailyreport.findOneAndUpdate({},{
                            $inc: {
                                todayassigntask: 1
                            }  
                        },{ new: true, sort: { '_id': -1 } });
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
                        await User.findByIdAndUpdate(rUserId, { $push: { scratchdata: scratchArray } }, { "fields": { "_id": 0 }, "new": true });
                    }
                    scratchArray = [];
                }
            }
            await User.findByIdAndUpdate(rReturn._id, { $set: { taskdata: taskArray } }, {
                "fields": { "_id": 0 },
                "new": true
            });
            var data = {
                code: 1,
                msg: MSG.register[0],
                register: {
                    coin: rReturn.coin,
                    amount: rReturn.amount,
                    referCode: rReturn.referCode,
                    deviceId: rReturn.deviceId,
                    uniqueId: rReturn.uniqueId,
                    name: rReturn.name,
                    mobileNo: rReturn.mobileNo,
                    userId: rReturn._id,
                    password: rReturn.password,
                    minwithcoin: rReturn.minwithcoin,
                    withdrawArray: rReturn.withdrawArray,
                    appId: rReturn.wallet[0].appId,
                    walletId: rReturn.wallet[0]._id,
                    isApp:  rReturn.wallet[0].isActive, 
                }
            }
            // console.log(data)
            _EncDecData.sendDataToUser(res, data)
        } else {
            if (findMobilenumber > 0) {
                var data = {
                    code: 0,
                    msg: MSG.register[1]
                }
                _EncDecData.sendDataToUser(res, data);
            } /*else if (findDeviceId > 0) {
                var data = {
                    code: 0,
                    msg: MSG.register[2]
                }
                _EncDecData.sendDataToUser(res, data);
            } else if (findUniqueId > 0) {
                var data = {
                    code: 0,
                    msg: MSG.register[3]
                }
                _EncDecData.sendDataToUser(res, data);
            } */
            else {
                var data = {
                    code: 0,
                    msg: MSG.common[1]
                }
                _EncDecData.sendDataToUser(res, data);
            }
        }
    } catch (error) {
        console.log(error)
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;