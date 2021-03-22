var express = require('express');
var router = express.Router();
var moment = require('moment')
var Task = require('./../../../modal/task');
var Application = require('./../../../modal/application');
var Userdailyreport = require('./../../../modal/userdailyreport');
var Applicationdailyreport = require('./../../../modal/appwisedailyreport');
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
        var CurrentDate = moment(new Date()).startOf('day');
        var findUser = await User.findById(rUserId, {
            isActive: 1,
            taskDate: 1,
            "taskdata.task": 1,
            "taskdata.spin": 1,
            "taskdata.currentspin": 1,
            "taskdata.currenttask": 1,
            "taskdata.uan": 1,
            clickCoin: 1, 
            bannerCoin: 1
        }).lean();
        var findActive = findUser.isActive; 
        var PrevTaskDate = moment(findUser.taskDate).format();
        var DiffDay = CurrentDate.diff(PrevTaskDate, 'days');
        // console.log("hello ", findUser)
        if (DiffDay == 0 && findActive) {
            var data = {
                code: 1,
                msg: MSG.mastertasklist[0],
                isActive: findActive,
                taskdata: findUser.taskdata,
                bCoin : findUser.bannerCoin,
                cCoin : findUser.clickCoin
            }
            // console.log(data)
            _EncDecData.sendDataToUser(res, data);
        } else if (DiffDay >= 1 && findActive) {
            // totalassigntask: {type : Number, default : 0}, // Assign Task for all user - 2000 
            // totalassignclick: {type : Number, default : 0}, // Assign Task for all user - only click - 400 
            // todayassigntask: {type : Number, default : 0},
            // todayassignclick: {type : Number, default : 0},
            var findApplication = await Application.find({ isActive: true }, { uan: 1, todayassigntask: 1, todayassignclick: 1, taskclickpercentage: 1 }).sort({ totalassignclick: 1 }).lean();
            //Check Ratio Task Click or not
            var taskArray = [];
            await User.findByIdAndUpdate(rUserId, { $set: { scratchdata: [] } }, { "fields": { "_id": 0 }, "new": true });
            if(findApplication.length > 0) {
                await Userdailyreport.findOneAndUpdate({}, {
                    $inc: {
                        todaylogin: 1
                    } 
                },{ new: true, sort: { '_id': -1 } })
                var assginClick = false;
                for (let index = 0; index < findApplication.length; index++) {
                    const uan = findApplication[index].uan;
                    const appId = findApplication[index]._id;
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
                        if(assginClick) {
                            findTask = await Task.aggregate([{$match: { isClick : false }}]).sample(1);
                        } else {
                            findTask = await Task.aggregate().sample(1);
                            assginClick = true;
                        }
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
                        await User.findByIdAndUpdate(rUserId, { $push: { scratchdata: scratchArray } }, { "fields": { "_id": 0 }, "new": true });
                    }
                }
            }

            var updateTaskByUser = await User.findByIdAndUpdate(rUserId, { $set: { taskdata: taskArray, taskDate: CurrentDate } }, {
                "fields": {
                    "taskdata.task": 1,
                    "taskdata.spin": 1,
                    "taskdata.currentspin": 1,
                    "taskdata.currenttask": 1,
                    "taskdata.uan": 1, "_id": 0
                },
                "new": true
            });
            var data = {
                code: 1,
                msg: MSG.mastertasklist[0],
                isActive: findActive,
                taskdata: updateTaskByUser.taskdata,
                bCoin : findUser.bannerCoin,
                cCoin : findUser.clickCoin
            }
            // console.log(data)
            _EncDecData.sendDataToUser(res, data);
        } else {
            var data = {
                code: 0,
                msg: MSG.common[1],
            }
            _EncDecData.sendDataToUser(res, data);
        }
    } catch (error) {
        console.log(error)
        var data = {
            code: 0,
            msg: MSG.common[0],
        }
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;