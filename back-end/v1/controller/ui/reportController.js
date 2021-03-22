var express = require('express');
var router = express.Router();
var AppReport = require('./../../../modal/appwisedailyreport');
var UserReport = require('./../../../modal/userdailyreport');
var WithdrawReport = require('./../../../modal/withdraw');
var Application = require('./../../../modal/application');
var MSG = require('./../../../common/uimsg');
var _EncDecData = require('./../../../common/encrypt')
//Report for Dashboard, AppDashboard, ReportUser and ReportApps
router.post('/', async (req, res) => {
    try {

        //Pagination
        var rSkip = parseInt(req.body.pageIndex) * parseInt(req.body.pageSize);
        var rLimit = parseInt(req.body.pageSize);

        //Type & subtype
        var rType = req.body.type;
        var rSubtype = req.body.subtype;
        var data;
        var findQuery;
        var totalCount = -1;
        if (rType == "user") {
            if (rSubtype == "day") {
                totalCount = await UserReport.countDocuments();
                findQuery = await UserReport.find({}).sort({ _id: -1 }).skip(rSkip).limit(rLimit).lean();
            } else if (rSubtype == "week") {
                totalCount = await UserReport.aggregate([
                    {
                        $group: {
                            _id: { week: { $week: "$_id" }, "month": { "$month": "$_id" }, "year": { "$year": "$_id" } }

                        }
                    },
                    {
                        $count: "totalCount"
                    }]);
                findQuery = await UserReport.aggregate([
                    { $sort: { _id: 1 } },
                    {
                        $group: {
                            _id: { week: { $week: "$_id" }, "month": { "$month": "$_id" }, "year": { "$year": "$_id" } },
                            "first": { "$first": "$_id" },
                            "last": { "$last": "$_id" },
                            "totalimpression": { $sum: "$totalimpression" },
                            "totalclick": { $sum: "$totalclick" },
                            "successimpression": { $sum: "$successimpression" },
                            "failimpression": { $sum: "$failimpression" },
                            "successclick": { $sum: "$successclick" },
                            "failclick": { $sum: "$failclick" },
                            "scratchcount": { $sum: "$scratchcount" },
                            "spincount": { $sum: "$spincount" },
                            "gamecount": { $sum: "$gamecount" },
                            "coinimpression": { $sum: "$coinimpression" },
                            "coinclick": { $sum: "$coinclick" },
                            "coinscratch": { $sum: "$coinscratch" },
                            "coinspin": { $sum: "$coinspin" },
                            "coinreference": { $sum: "$coinreference" },
                            "coinplaygame": { $sum: "$coinplaygame" },
                            "todayassigntask": { $sum: "$todayassigntask" },
                            "todayassignclick": { $sum: "$todayassignclick" },
                            "todayregister": { $sum: "$todayregister" },
                            "todaylogin": { $sum: "$todaylogin" },
                            "withdrawcoin": { $sum: "$withdrawcoin" },
                            "withdrawamount": { $sum: "$withdrawamount" }
                        }
                    },
                    {
                        $project: {
                            _id: 0, first: 1, last: 1,
                            "totalimpression": 1,
                            "totalclick": 1,
                            "successimpression": 1,
                            "failimpression": 1,
                            "successclick": 1,
                            "failclick": 1,
                            "scratchcount": 1,
                            "spincount": 1,
                            "gamecount": 1,
                            "coinimpression": 1,
                            "coinclick": 1,
                            "coinscratch": 1,
                            "coinspin": 1,
                            "coinreference": 1,
                            "coinplaygame": 1,
                            "todayassigntask": 1,
                            "todayassignclick": 1,
                            "todayregister": 1,
                            "todaylogin": 1,
                            "withdrawcoin": 1,
                            "withdrawamount": 1,
                        }
                    },
                    { $skip: rSkip },
                    { $limit: rLimit }
                ]);
            } else if (rSubtype == "month") {
                totalCount = await UserReport.aggregate([
                    {
                        $group: {
                            _id: { "month": { "$month": "$_id" }, "year": { "$year": "$_id" } }

                        }
                    },
                    {
                        $count: "totalCount"
                    }]);
                findQuery = await UserReport.aggregate([
                    { $sort: { _id: 1 } },
                    {
                        $group: {
                            _id: { "month": { "$month": "$_id" }, "year": { "$year": "$_id" } },
                            "first": { "$first": "$_id" },
                            "last": { "$last": "$_id" },
                            "totalimpression": { $sum: "$totalimpression" },
                            "totalclick": { $sum: "$totalclick" },
                            "successimpression": { $sum: "$successimpression" },
                            "failimpression": { $sum: "$failimpression" },
                            "successclick": { $sum: "$successclick" },
                            "failclick": { $sum: "$failclick" },
                            "scratchcount": { $sum: "$scratchcount" },
                            "spincount": { $sum: "$spincount" },
                            "gamecount": { $sum: "$gamecount" },
                            "coinimpression": { $sum: "$coinimpression" },
                            "coinclick": { $sum: "$coinclick" },
                            "coinscratch": { $sum: "$coinscratch" },
                            "coinspin": { $sum: "$coinspin" },
                            "coinreference": { $sum: "$coinreference" },
                            "coinplaygame": { $sum: "$coinplaygame" },
                            "todayassigntask": { $sum: "$todayassigntask" },
                            "todayassignclick": { $sum: "$todayassignclick" },
                            "todayregister": { $sum: "$todayregister" },
                            "todaylogin": { $sum: "$todaylogin" },
                            "withdrawcoin": { $sum: "$withdrawcoin" },
                            "withdrawamount": { $sum: "$withdrawamount" }
                        }
                    },
                    {
                        $project: {
                            _id: 0, first: 1, last: 1,
                            "totalimpression": 1,
                            "totalclick": 1,
                            "successimpression": 1,
                            "failimpression": 1,
                            "successclick": 1,
                            "failclick": 1,
                            "scratchcount": 1,
                            "spincount": 1,
                            "gamecount": 1,
                            "coinimpression": 1,
                            "coinclick": 1,
                            "coinscratch": 1,
                            "coinspin": 1,
                            "coinreference": 1,
                            "coinplaygame": 1,
                            "todayassigntask": 1,
                            "todayassignclick": 1,
                            "todayregister": 1,
                            "todaylogin": 1,
                            "withdrawcoin": 1,
                            "withdrawamount": 1,
                        }
                    },
                    { $skip: rSkip },
                    { $limit: rLimit }
                ]);
            } else if(rSubtype == "betweenDate") { 
                //From date to To date
                var rFromdate = req.body.fromdate;
                var rTodate = req.body.todate;
                totalCount = await UserReport.countDocuments({ _id: {
                    $gte: new Date(rFromdate),
                    $lt: new Date(rTodate)
                }});
                findQuery = await UserReport.find({_id: {
                    $gte: new Date(rFromdate),
                    $lt: new Date(rTodate)
                }}).sort({ _id: -1 }).skip(rSkip).limit(rLimit).lean();
            } else {
                totalCount = await WithdrawReport.aggregate([
                    { $group: { _id: "$status" , "coin": {$sum: "$coin"},  "amount": {$sum: "$amount"} } },
                    { $project: { _id: 1 , coin : 1, amount: 1} }
                 ]);
                findQuery = await UserReport.aggregate([
                    {
                        $group: {
                            _id: 0,
                            "totalimpression": { $sum: "$totalimpression" },
                            "totalclick": { $sum: "$totalclick" },
                            "successimpression": { $sum: "$successimpression" },
                            "failimpression": { $sum: "$failimpression" },
                            "successclick": { $sum: "$successclick" },
                            "failclick": { $sum: "$failclick" },
                            "scratchcount": { $sum: "$scratchcount" },
                            "spincount": { $sum: "$spincount" },
                            "gamecount": { $sum: "$gamecount" },
                            "coinimpression": { $sum: "$coinimpression" },
                            "coinclick": { $sum: "$coinclick" },
                            "coinscratch": { $sum: "$coinscratch" },
                            "coinspin": { $sum: "$coinspin" },
                            "coinreference": { $sum: "$coinreference" },
                            "coinplaygame": { $sum: "$coinplaygame" },
                            "todayassigntask": { $sum: "$todayassigntask" },
                            "todayassignclick": { $sum: "$todayassignclick" },
                            "todayregister": { $sum: "$todayregister" },
                            "todaylogin": { $sum: "$todaylogin" },
                            "withdrawcoin": { $sum: "$withdrawcoin" },
                            "withdrawamount": { $sum: "$withdrawamount" }
                        }
                    },
                    {
                        $project: {
                            _id: 0, 
                            "totalimpression": 1,
                            "totalclick": 1,
                            "successimpression": 1,
                            "failimpression": 1,
                            "successclick": 1,
                            "failclick": 1,
                            "scratchcount": 1,
                            "spincount": 1,
                            "gamecount": 1,
                            "coinimpression": 1,
                            "coinclick": 1,
                            "coinscratch": 1,
                            "coinspin": 1,
                            "coinreference": 1,
                            "coinplaygame": 1,
                            "todayassigntask": 1,
                            "todayassignclick": 1,
                            "todayregister": 1,
                            "todaylogin": 1,
                            "withdrawcoin": 1,
                            "withdrawamount": 1,
                        }
                    }
                ]);
            }
        } else if (rType == "app") {
            var rUan = req.body.uan;
            if (rSubtype == "day") {
                totalCount = await AppReport.countDocuments({ uan: rUan });
                findQuery = await AppReport.find({ uan: rUan }).sort({ _id: -1 }).skip(rSkip).limit(rLimit).lean();
            } else if (rSubtype == "week") {
                totalCount = await AppReport.aggregate([
                    { $match: { uan: rUan } },
                    {
                        $group: {
                            _id: { week: { $week: "$_id" }, "month": { "$month": "$_id" }, "year": { "$year": "$_id" } }

                        }
                    },
                    {
                        $count: "totalCount"
                    }]);
                findQuery = await AppReport.aggregate([
                    { $match: { uan: rUan } },
                    { $sort: { _id: 1 } },
                    {
                        $group: {
                            _id: { week: { $week: "$_id" }, "month": { "$month": "$_id" }, "year": { "$year": "$_id" } },
                            "first": { "$first": "$_id" },
                            "last": { "$last": "$_id" },
                            "totalimpression": {$sum: "$totalimpression"},
                            "totalclick": {$sum: "$totalclick"},
                            "successimpression": {$sum: "$successimpression"},
                            "failimpression": {$sum: "$failimpression"},
                            "successclick": {$sum: "$successclick"},
                            "failclick": {$sum: "$failclick"},
                            "scratchcount": {$sum: "$scratchcount"},
                            "spincount": {$sum: "$spincount"},
                            "gamecount": {$sum: "$gamecount"},
                            "coinimpression": {$sum: "$coinimpression"},
                            "coinclick": {$sum: "$coinclick"},
                            "coinscratch": {$sum: "$coinscratch"},
                            "coinspin": {$sum: "$coinspin"},
                            "coinplaygame": {$sum: "$coinplaygame"},
                            "todayassigntask": {$sum: "$todayassigntask"},
                            "todayassignclick": {$sum: "$todayassignclick"},
                        }
                    },
                    {
                        $project: {
                            _id: 0, first: 1, last: 1,
                            "totalimpression": 1,
                            "totalclick": 1,
                            "successimpression": 1,
                            "failimpression": 1,
                            "successclick": 1,
                            "failclick": 1,
                            "scratchcount": 1,
                            "spincount": 1,
                            "gamecount": 1,
                            "coinimpression": 1,
                            "coinclick": 1,
                            "coinscratch": 1,
                            "coinspin": 1,
                            "coinplaygame": 1,
                            "todayassigntask": 1,
                            "todayassignclick": 1,
                        }
                    },
                    { $skip: rSkip },
                    { $limit: rLimit }
                ]);
            } else if (rSubtype == "month") {
                totalCount = await AppReport.aggregate([
                    { $match: { uan: rUan } },
                    {
                        $group: {
                            _id: { "month": { "$month": "$_id" }, "year": { "$year": "$_id" } }

                        }
                    },
                    {
                        $count: "totalCount"
                    }]);
                findQuery = await AppReport.aggregate([
                    { $match: { uan: rUan } },
                    { $sort: { _id: 1 } },
                    {
                        $group: {
                            _id: { "month": { "$month": "$_id" }, "year": { "$year": "$_id" } },
                            "first": { "$first": "$_id" },
                            "last": { "$last": "$_id" },
                            "totalimpression": {$sum: "$totalimpression"},
                            "totalclick": {$sum: "$totalclick"},
                            "successimpression": {$sum: "$successimpression"},
                            "failimpression": {$sum: "$failimpression"},
                            "successclick": {$sum: "$successclick"},
                            "failclick": {$sum: "$failclick"},
                            "scratchcount": {$sum: "$scratchcount"},
                            "spincount": {$sum: "$spincount"},
                            "gamecount": {$sum: "$gamecount"},
                            "coinimpression": {$sum: "$coinimpression"},
                            "coinclick": {$sum: "$coinclick"},
                            "coinscratch": {$sum: "$coinscratch"},
                            "coinspin": {$sum: "$coinspin"},
                            "coinplaygame": {$sum: "$coinplaygame"},
                            "todayassigntask": {$sum: "$todayassigntask"},
                            "todayassignclick": {$sum: "$todayassignclick"},
                        }
                    },
                    {
                        $project: {
                            _id: 0, first: 1, last: 1,
                            "totalimpression": 1,
                            "totalclick": 1,
                            "successimpression": 1,
                            "failimpression": 1,
                            "successclick": 1,
                            "failclick": 1,
                            "scratchcount": 1,
                            "spincount": 1,
                            "gamecount": 1,
                            "coinimpression": 1,
                            "coinclick": 1,
                            "coinscratch": 1,
                            "coinspin": 1,
                            "coinplaygame": 1,
                            "todayassigntask": 1,
                            "todayassignclick": 1,
                        }
                    },
                    { $skip: rSkip },
                    { $limit: rLimit }
                ]);

            } else if(rSubtype == "betweenDate") { 
                //From date to To date
                var rFromdate = req.body.fromdate;
                var rTodate = req.body.todate;
                totalCount = await AppReport.countDocuments({ uan: rUan,_id: {
                    $gte: new Date(rFromdate),
                    $lt: new Date(rTodate)
                }});
                findQuery = await AppReport.find({uan: rUan,_id: {
                    $gte: new Date(rFromdate),
                    $lt: new Date(rTodate)
                }}).sort({ _id: -1 }).skip(rSkip).limit(rLimit).lean();
            }else {
                totalCount = 1;
                findQuery = await AppReport.aggregate([
                    { $match: { uan: rUan } },
                    {
                        $group: {
                            _id: 0,
                            "totalimpression": {$sum: "$totalimpression"},
                            "totalclick": {$sum: "$totalclick"},
                            "successimpression": {$sum: "$successimpression"},
                            "failimpression": {$sum: "$failimpression"},
                            "successclick": {$sum: "$successclick"},
                            "failclick": {$sum: "$failclick"},
                            "scratchcount": {$sum: "$scratchcount"},
                            "spincount": {$sum: "$spincount"},
                            "gamecount": {$sum: "$gamecount"},
                            "coinimpression": {$sum: "$coinimpression"},
                            "coinclick": {$sum: "$coinclick"},
                            "coinscratch": {$sum: "$coinscratch"},
                            "coinspin": {$sum: "$coinspin"},
                            "coinplaygame": {$sum: "$coinplaygame"},
                            "todayassigntask": {$sum: "$todayassigntask"},
                            "todayassignclick": {$sum: "$todayassignclick"},
                        }
                    },
                    {
                        $project: {
                            _id: 0, 
                            "totalimpression": 1,
                            "totalclick": 1,
                            "successimpression": 1,
                            "failimpression": 1,
                            "successclick": 1,
                            "failclick": 1,
                            "scratchcount": 1,
                            "spincount": 1,
                            "gamecount": 1,
                            "coinimpression": 1,
                            "coinclick": 1,
                            "coinscratch": 1,
                            "coinspin": 1,
                            "coinplaygame": 1,
                            "todayassigntask": 1,
                            "todayassignclick": 1,
                        }
                    }
                ]);
            }
        } else {
            totalCount = 0;
            findQuery = [];
        }
        data = {
            code: 1,
            msg: MSG.coin[0],
            data: {
                dataSource: findQuery,
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
//Appplication List
router.get('/', async (req, res) => {
    try {
        var findApplication = await Application.find({}).select({ _id: 0, uan: 1 }).lean();
        var data = {
            code: 1,
            msg: MSG.coin[0],
            data: findApplication
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
