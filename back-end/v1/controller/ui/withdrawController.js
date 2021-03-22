var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Withdraw = require('./../../../modal/withdraw');
var User = require('./../../../modal/user');
var MSG = require('./../../../common/uimsg');
const { Parser } = require('json2csv')
var _EncDecData = require('./../../../common/encrypt')

//All Table Display
router.post('/', async (req, res) => {
    try {
        // type: "pending"
        // active: "createDate"
        // direction: "desc"
        // filterMobilno: ""
        // pageIndex: 39
        // pageSize: 50

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
        var rType = req.body.type;
        var rFilterMobileno = req.body.filterMobilno;

        var totalCount = 0;
        var listWithdraw;
        var data;
        // if(rFilterMobileno.trim() != "") {
        //     rFilterMobileno = '/'+rFilterMobileno.trim()+'/';
        // }

        if (rType == "pending") {
            if (rFilterMobileno == "") {
                totalCount = await Withdraw.countDocuments({ status: "PENDING" });
                listWithdraw = await Withdraw.find({ status: "PENDING" }).sort(sort).skip(rSkip).limit(rLimit).lean();
            } else {

                totalCount = await Withdraw.countDocuments({ status: "PENDING", mobileNo: rFilterMobileno });
                listWithdraw = await Withdraw.find({ status: "PENDING", mobileNo: rFilterMobileno }).sort(sort).skip(rSkip).limit(rLimit).lean();
            }
        } else if (rType == "success") {
            if (rFilterMobileno == "") {
                totalCount = await Withdraw.countDocuments({ status: "SUCCESS" });
                listWithdraw = await Withdraw.find({ status: "SUCCESS" }).sort(sort).skip(rSkip).limit(rLimit).lean();
            } else {
                totalCount = await Withdraw.countDocuments({ status: "SUCCESS", mobileNo: rFilterMobileno });
                listWithdraw = await Withdraw.find({ status: "SUCCESS", mobileNo: rFilterMobileno }).sort(sort).skip(rSkip).limit(rLimit).lean();
            }
        } else {
            if (rFilterMobileno == "") {
                totalCount = await Withdraw.countDocuments({ status: "CANCEL" });
                listWithdraw = await Withdraw.find({ status: "CANCEL" }).sort(sort).skip(rSkip).limit(rLimit).lean();
            } else {
                totalCount = await Withdraw.countDocuments({ status: "CANCEL", mobileNo: rFilterMobileno });
                listWithdraw = await Withdraw.find({ status: "CANCEL", mobileNo: rFilterMobileno }).sort(sort).skip(rSkip).limit(rLimit).lean();
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

// Single Withdraw Deactive User-- Other Pending All Withdraw CANCEL
router.put('/', async (req, res) => {
    try {
        var rStatus = req.body.status;
        var rIsActive = req.body.isActive;
        var rMobileno = req.body.mobileNo;
        var rUserId = req.body.userId;
        if (rStatus == "PENDING") {
            await Withdraw.update({ mobileNo: rMobileno, isActive: true }, { $set: { status: "CANCEL", isActive: false, updateDate: new Date() } }, {
                "multi": true
            })
            var updateUser = await User.findByIdAndUpdate(rUserId, { $set: { isActive: rIsActive } }, {
                "fields": { "_id": 0 }, "new": true
            })
        } else {
            var updateUser = await User.findByIdAndUpdate(rUserId, { $set: { isActive: rIsActive } }, {
                "fields": { "_id": 0 }, "new": true
            })
        }
        var data = {
            code: 1,
            msg: MSG.common[0]
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

//Payment History Check....
router.post('/:id', async (req, res) => {
    try {
        //body parameter 
        var rMobileno = req.body.mobileNo;
        //Pagination
        var rSkip = parseInt(req.body.pageIndex) * parseInt(req.body.pageSize);
        var rLimit = parseInt(req.body.pageSize);
        //total
        var totalCount = await Withdraw.countDocuments({ mobileNo: rMobileno });
        //Where cause
        var findWithdraw = await Withdraw.find({ mobileNo: rMobileno }).sort({ createDate: -1 }).skip(rSkip).limit(rLimit);
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: {
                dataSource: findWithdraw,
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

//User Activity History Check....
router.post('/:id1/:id2', async (req, res) => {
    try {
        //body parameter 
        var rUserId = req.body.userId;
        //Pagination
        var rSkip = parseInt(req.body.pageIndex) * parseInt(req.body.pageSize);
        var rLimit = parseInt(req.body.pageSize);
        //total
        // aggregate([ {$match: { _id: ObjectId("5ef077a7ce7c0248c4be8504") }}, { $project : { _id: 1 ,"count": { $size:"$activity" }}}])
        var totalCount = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(rUserId) } }, { $project: { _id: 0, "count": { $size: "$activity" } } }]);
        //Where cause
        var findWithdraw = await User.aggregate([{ $match: { _id:  mongoose.Types.ObjectId(rUserId)} }, 
                        { $unwind: "$activity" },
                        { 
                            $sort: { "activity._id": -1 } 
                        }, 
                        { 
                            $project: { _id: 0, "activity": 1 } 
                        }, 
                        {
                            $skip: rSkip
                        }, 
                        {
                            $limit: rLimit
                        }]);
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: {
                dataSource: findWithdraw,
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


// Multiple Withdraw Cancle Deactive User -- Other Pending All Withdraw CANCEL
router.put('/:id', async (req, res) => {
    try {
        var rStatus = req.body.status;
        var rIsActive = req.body.isActive;
        var rMobileno = req.body.mobileNos;
        if (rStatus == "PENDING") {
            await Withdraw.update({ mobileNo: { "$in": rMobileno }, isActive: true }, { $set: { status: "CANCEL", isActive: false, updateDate: new Date() } }, {
                "multi": true
            })
            await User.update({ mobileNo: { "$in": rMobileno } }, { $set: { isActive: rIsActive } }, { "multi": true })
        } else {
            await User.update({ mobileNo: { "$in": rMobileno } }, { $set: { isActive: rIsActive } }, { "multi": true })
        }
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: "Success"
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


// Multiple Withdraw Pending to Success
router.get('/:id', async (req, res) => {
    try {
        var rStatus = req.params.id;
        if (rStatus == "pending") {
            await Withdraw.update({ status: "PENDING" }, { $set: { status: "SUCCESS", isActive: false, updateDate: new Date() } }, {
                "multi": true
            })
        }
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: "Success"
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


// Multiple Withdraw Pending to Success -- Download File after success
router.get('/', async (req, res) => {
    try {
        var findPendingwithdraw = await Withdraw.find({ status: "PENDING" }).select({
            mobileNo: 1,
            amount: 1,
            name: 1,
            status: 1,
            _id: 1
        }).lean();

        findPendingwithdraw = findPendingwithdraw.map(function (obj) {
            obj["User's Mobile Number/Email"] = obj['mobileNo'];
            obj["Amount"] = obj['amount'];
            obj["Beneficiary Name"] = obj["name"];
            obj["Comment"] = obj['status']; // Assign new key 
            obj['Merchant Order ID'] = obj['_id'];
            delete obj['status']; // Delete old key 
            delete obj['mobileNo'];
            delete obj['amount'];
            delete obj['name'];
            delete obj['_id'];
            return obj;
        });
        const json2csvParser = new Parser({ quote: '' });
        const csv = json2csvParser.parse(findPendingwithdraw);
        // const csv = Parser.parse(findPendingwithdraw);
        res.setHeader('Content-disposition', 'attachment; filename=withdraw.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).end(csv);

    } catch (error) {
        console.log(error)
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});

module.exports = router;