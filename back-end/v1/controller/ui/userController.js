var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Withdraw = require('./../../../modal/withdraw');
var User = require('./../../../modal/user');
var MSG = require('./../../../common/uimsg');
var Parser = require('json2csv')
var _EncDecData = require('./../../../common/encrypt')

//All Table Display User
router.post('/', async (req, res) => {
    try {
        //Sorting
        var rSortColumn = req.body.active;
        var rSortType = req.body.direction;
        var sort = {
            [req.body.active]: rSortType
        }

        //Pagination
        var rSkip = parseInt(req.body.pageIndex) * parseInt(req.body.pageSize);
        var rLimit = parseInt(req.body.pageSize);

        //Search
        var rIsActive = req.body.isActive;
        var rFilterMobileno = req.body.filterMobilno;

        var totalCount = 0;
        var listWithdraw;
        var data;

        if (rIsActive) {
            if (rFilterMobileno == "") {
                totalCount = await User.countDocuments({ isActive: rIsActive });
                listWithdraw = await User.find({ isActive: rIsActive }).sort(sort)
                    .select({
                        name: 1,
                        mobileNo: 1,
                        coin: 1,
                        amount: 1,
                        totalcoin: 1,
                        totalamount: 1,
                        createDate: 1,
                        convertCoin: 1, // Amount to coin
                        convertAmount: 1 // Coin to amount
                    }).skip(rSkip).limit(rLimit).lean();
            } else {

                totalCount = await User.countDocuments({ isActive: rIsActive, mobileNo: rFilterMobileno });
                listWithdraw = await User.find({ isActive: rIsActive, mobileNo: rFilterMobileno }).sort(sort).select({
                    name: 1,
                    mobileNo: 1,
                    coin: 1,
                    amount: 1,
                    totalcoin: 1,
                    totalamount: 1,
                    createDate: 1,
                    convertCoin: 1, // Amount to coin
                    convertAmount: 1 // Coin to amount
                }).skip(rSkip).limit(rLimit).lean();
            }
        } else {
            if (rFilterMobileno == "") {
                totalCount = await User.countDocuments({ isActive: rIsActive });
                listWithdraw = await User.find({ isActive: rIsActive }).sort(sort).select({
                    name: 1,
                    mobileNo: 1,
                    coin: 1,
                    amount: 1,
                    totalcoin: 1,
                    totalamount: 1,
                    createDate: 1,
                    convertCoin: 1, // Amount to coin
                    convertAmount: 1 // Coin to amount
                }).skip(rSkip).limit(rLimit).lean();
            } else {
                totalCount = await User.countDocuments({ isActive: rIsActive, mobileNo: rFilterMobileno });
                listWithdraw = await User.find({ isActive: rIsActive, mobileNo: rFilterMobileno }).sort(sort).select({
                    name: 1,
                    mobileNo: 1,
                    coin: 1,
                    amount: 1,
                    totalcoin: 1,
                    totalamount: 1,
                    createDate: 1,
                    convertCoin: 1, // Amount to coin
                    convertAmount: 1 // Coin to amount
                }).skip(rSkip).limit(rLimit).lean();
            }
        }
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: {
                dataSource: listWithdraw,
                length: totalCount
            }
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});


//Scratch Data
router.post('/:id', async (req, res) => {
    try {
        //body parameter 
        var rUserId = req.body.userId;
        //Pagination
        var rSkip = parseInt(req.body.pageIndex) * parseInt(req.body.pageSize);
        var rLimit = parseInt(req.body.pageSize);
        //total
        var totalCount = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(rUserId) } }, { $project: { _id: 0, "count": { $size: "$scratchdata" } } }]);
        //Where Cause
        var findWithdraw = await User.findById(rUserId, {
            name: 0,
            mobileNo: 0,
            referCode: 0,
            reference: 0,
            password: 0,
            deviceId: 0,
            uniqueId: 0,
            firebaseToken: 0,
            coin: 0,
            amount: 0,
            totalcoin: 0,
            totalamount: 0,
            isActive: 0,
            isFirstWithdraw: 0,
            getreferCoin: 0,
            filterTask: 0,
            filterTaskDate: 0,
            filterTaskDay: 0,
            convertCoin: 0,
            convertAmount: 0,
            bannerCoin: 0,
            clickCoin: 0,
            referCoin: 0,
            totalimpression: 0,
            totalclick: 0,
            successimpression: 0,
            failimpression: 0,
            successclick: 0,
            failclick: 0,
            scratchcount: 0,
            spincount: 0,
            gamecount: 0,
            coinimpression: 0,
            coinclick: 0,
            coinscratch: 0,
            coinspin: 0,
            coinreference: 0,
            coinplaygame: 0,
            activity: 0,
            taskdata: 0,
            wallet: 0,
            taskDate: 0,
            withdrawDate: 0,
            updateDate: 0,
            createDate: 0,
            _id: 0, scratchdata: { $slice: [rSkip, rLimit] }
        });
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: {
                dataSource: findWithdraw.scratchdata,
                length: totalCount[0].count
            }
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});

//Task Data
router.post('/:id1/:id2', async (req, res) => {
    try {
        //body parameter 
        var rUserId = req.body.userId;
        //Pagination
        var rSkip = parseInt(req.body.pageIndex) * parseInt(req.body.pageSize);
        var rLimit = parseInt(req.body.pageSize);
        //total
        var totalCount = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(rUserId) } }, { $project: { _id: 0, "count": { $size: "$taskdata" } } }]);
        //Where Cause
        var findWithdraw = await User.findById(rUserId, {
            name: 0,
            mobileNo: 0,
            referCode: 0,
            reference: 0,
            password: 0,
            deviceId: 0,
            uniqueId: 0,
            firebaseToken: 0,
            coin: 0,
            amount: 0,
            totalcoin: 0,
            totalamount: 0,
            isActive: 0,
            isFirstWithdraw: 0,
            getreferCoin: 0,
            filterTask: 0,
            filterTaskDate: 0,
            filterTaskDay: 0,
            convertCoin: 0,
            convertAmount: 0,
            bannerCoin: 0,
            clickCoin: 0,
            referCoin: 0,
            totalimpression: 0,
            totalclick: 0,
            successimpression: 0,
            failimpression: 0,
            successclick: 0,
            failclick: 0,
            scratchcount: 0,
            spincount: 0,
            gamecount: 0,
            coinimpression: 0,
            coinclick: 0,
            coinscratch: 0,
            coinspin: 0,
            coinreference: 0,
            coinplaygame: 0,
            activity: 0,
            scratchdata: 0,
            wallet: 0,
            taskDate: 0,
            withdrawDate: 0,
            updateDate: 0,
            createDate: 0,
            _id: 0, taskdata: { $slice: [rSkip, rLimit] }
        });
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: {
                dataSource: findWithdraw.taskdata,
                length: totalCount[0].count
            }
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});


//Application Wise Data Earning Data
router.put('/:id', async (req, res) => {
    try {
        //body parameter 
        var rUserId = req.body.userId;
        //Pagination
        var rSkip = parseInt(req.body.pageIndex) * parseInt(req.body.pageSize);
        var rLimit = parseInt(req.body.pageSize);
        //total
        var totalCount = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(rUserId) } }, { $project: { _id: 0, "count": { $size: "$wallet" } } }]);
        //Where Cause
        var findWithdraw = await User.findById(rUserId, {
            name: 0,
            mobileNo: 0,
            referCode: 0,
            reference: 0,
            password: 0,
            deviceId: 0,
            uniqueId: 0,
            firebaseToken: 0,
            coin: 0,
            amount: 0,
            totalcoin: 0,
            totalamount: 0,
            isActive: 0,
            isFirstWithdraw: 0,
            getreferCoin: 0,
            filterTask: 0,
            filterTaskDate: 0,
            filterTaskDay: 0,
            convertCoin: 0,
            convertAmount: 0,
            bannerCoin: 0,
            clickCoin: 0,
            referCoin: 0,
            totalimpression: 0,
            totalclick: 0,
            successimpression: 0,
            failimpression: 0,
            successclick: 0,
            failclick: 0,
            scratchcount: 0,
            spincount: 0,
            gamecount: 0,
            coinimpression: 0,
            coinclick: 0,
            coinscratch: 0,
            coinspin: 0,
            coinreference: 0,
            coinplaygame: 0,
            activity: 0,
            taskdata: 0,
            scratchdata: 0,
            taskDate: 0,
            withdrawDate: 0,
            updateDate: 0,
            createDate: 0,
            _id: 0, wallet: { $slice: [rSkip, rLimit] }
        });
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: {
                dataSource: findWithdraw.wallet,
                length: totalCount[0].count
            }
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});


//User all data select and update unique key
router.get('/:userId', async (req, res) => {
    try {
        //body parameter 
        var rUserId = req.params.userId;
        
        //Where Cause
        var findUser = await User.findById(rUserId, {
            name: 1,
            mobileNo: 1,
            referCode: 1,
            reference: 1,
            deviceId: 1,
            uniqueId: 1,
            firebaseToken: 1,
            coin: 1,
            amount: 1,
            totalcoin: 1,
            totalamount: 1,
            isActive: 1,
            isFirstWithdraw: 1,
            getreferCoin: 1,
            totalimpression: 1,
            totalclick: 1,
            successimpression: 1,
            failimpression: 1,
            successclick: 1,
            failclick: 1,
            scratchcount: 1,
            spincount: 1,
            gamecount: 1,
            coinimpression: 1,
            coinclick: 1,
            coinscratch: 1,
            coinspin: 1,
            coinreference: 1,
            coinplaygame: 1,
            taskDate: 1,
            withdrawDate: 1,
            createDate: 1,
            _id: 0
        });
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: findUser
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});


//User update unique key
router.put('/:userId/:referCode' , async(req,res)=> {
    try {
        var data;
        var rUserId = req.params.userId;
        var rRefercode = req.params.referCode;
        //User Update Refercode
        var countReferCode = await User.countDocuments({ referCode: rRefercode });
        if (countReferCode == 0) {
            await User.findByIdAndUpdate(rUserId, { $set: { referCode: rRefercode } }, { "fields": { "_id": 0 } })
            data = {
                code: 1,
                msg: MSG.common[0]
            }
        } else {
            data = {
                code: 0,
                msg: MSG.common[0]
            }
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
})


//User app wise impression,click,scratch and spin
router.put('/:id', async (req, res) => {
    try {
        //body parameter 
        var rUserId = req.body.userId;
        //Pagination
        var rSkip = parseInt(req.body.pageIndex) * parseInt(req.body.pageSize);
        var rLimit = parseInt(req.body.pageSize);
        //total
        var totalCount = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(rUserId) } }, { $project: { _id: 0, "count": { $size: "$wallet" } } }]);
        //Where Cause
        var findWithdraw = await User.findById(rUserId, {
            name: 0,
            mobileNo: 0,
            referCode: 0,
            reference: 0,
            password: 0,
            deviceId: 0,
            uniqueId: 0,
            firebaseToken: 0,
            coin: 0,
            amount: 0,
            totalcoin: 0,
            totalamount: 0,
            isActive: 0,
            isFirstWithdraw: 0,
            getreferCoin: 0,
            filterTask: 0,
            filterTaskDate: 0,
            filterTaskDay: 0,
            convertCoin: 0,
            convertAmount: 0,
            bannerCoin: 0,
            clickCoin: 0,
            referCoin: 0,
            totalimpression: 0,
            totalclick: 0,
            successimpression: 0,
            failimpression: 0,
            successclick: 0,
            failclick: 0,
            scratchcount: 0,
            spincount: 0,
            gamecount: 0,
            coinimpression: 0,
            coinclick: 0,
            coinscratch: 0,
            coinspin: 0,
            coinreference: 0,
            coinplaygame: 0,
            activity: 0,
            taskdata: 0,
            scratchdata: 0,
            taskDate: 0,
            withdrawDate: 0,
            updateDate: 0,
            createDate: 0,
            _id: 0, wallet: { $slice: [rSkip, rLimit] }
        });
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: {
                dataSource: findWithdraw.wallet,
                length: totalCount[0].count
            }
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});


//Activity Combo-Box By Group wise (i.e. Master and Child Application Wise)
router.get('/:userId/:id', async (req, res) => {
    try {
        var rUserId = req.params.userId;
        var findUserWiseActivityGroup = await User.aggregate([
            { $unwind: "$activity" },
            { $match: { _id: mongoose.Types.ObjectId(rUserId) } },
            {
                $group: {
                    _id: "$activity.uan"
                }
            }, {
                $project: {
                    _id: 1
                }
            }
        ]);
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: findUserWiseActivityGroup,

        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});


//Activity By Group wise Application (i.e. Master and Child Application Wise)
router.put('/', async (req, res) => {
    try {
        var rUserId = req.body.userId;
        var rUan = req.body.uan;
        //Pagination
        var rSkip = parseInt(req.body.pageIndex) * parseInt(req.body.pageSize);
        var rLimit = parseInt(req.body.pageSize);
        var totalCount = await User.aggregate([
            { $unwind: "$activity" },
            { $match: { _id: mongoose.Types.ObjectId(rUserId), "activity.uan": rUan } },
            { $group: { _id: null, count: { $sum: 1 } } }])
        var findUserWiseActivityGroup = await User.aggregate([
            { $unwind: "$activity" },
            { $match: { _id: mongoose.Types.ObjectId(rUserId), "activity.uan": rUan } },
            { $sort: { "activity.clientdate": -1 } },
            {
                $project: {
                    _id: 0,
                    "activity.uan": 1,
                    "activity.type": 1,
                    "activity.coin": 1,
                    "activity.flag": 1,
                    "activity.clientdate": 1
                }
            },
            {
                $skip: rSkip,

            }, {
                $limit: rLimit
            }
        ])
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: {
                dataSource: findUserWiseActivityGroup,
                length: totalCount
            }

        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});


//User Delete -- Not delete in Report and payment 
router.delete('/:id', async(req,res)=> {
    try {
        var rUserId = req.params.id;
        var deleteUser = await User.findByIdAndRemove(rUserId);
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: deleteUser
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
})

module.exports = router;