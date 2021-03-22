var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require("moment");
var Application = require('./../../../modal/application');
var ReportApplication = require('./../../../modal/appwisedailyreport');
var User = require('./../../../modal/user');
var MSG = require('./../../../common/uimsg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var rName = req.body.name;
        var rIcon = req.body.icon;
        var rUrl = req.body.url;
        var rUnAppname = req.body.unappname;
        var rMsg = req.body.msg;
        var rTaskclickpercentage = req.body.taskclickpercentage;
        var CurrentDate = moment(new Date()).startOf('day');
        var rAppDate = new Date(CurrentDate)
        var findApplication = await Application.find({ uan: rUnAppname });
        if (findApplication.length == 0) {
            var insertApplication = await new Application({
                uan: rUnAppname,
                name: rName,
                icon: rIcon,
                msg: rMsg,
                url: rUrl,
                taskclickpercentage: rTaskclickpercentage, // Assign Click - 30
            });
            insertApplication.save();
            var createApplicationdailyreport = await new ReportApplication({ _id: rAppDate, appId: insertApplication._id, uan: rUnAppname, name: rName });
            createApplicationdailyreport.save();
            var insertWallet = {
                appId: insertApplication._id,
                uan: rUnAppname,
                icon: rIcon,
                coin: 0,
                totalcoin: 0,
                name: rName,
                isActive: false
            }
            await User.update({}, { $push: { wallet: insertWallet } }, { multi: true })
            var data = {
                code: 1,
                msg: MSG.application[0],
                data: insertApplication
            }
            _EncDecData.sendFrontRes(res, data)
        } else if (findApplication.length > 0) {
            var data = {
                code: 0,
                msg: MSG.application[1]
            }
            _EncDecData.sendFrontRes(res, data);
        } else {
            var data = {
                code: 0,
                msg: MSG.common[1]
            }
            _EncDecData.sendFrontRes(res, data);
        }
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});
router.put('/', async (req, res) => {
    try {
        var rId = req.body.id;
        var rName = req.body.name;
        var rIcon = req.body.icon;
        var rUrl = req.body.url;
        var rMsg = req.body.msg;
        var rTaskclickpercentage = req.body.taskclickpercentage;
        var rIsActive = req.body.isActive;
        var rIsBeta = req.body.isBeta;
        var updateApplication = await Application.findByIdAndUpdate(rId, { $set: { 
            name: rName, 
            icon: rIcon, 
            url: rUrl, 
            isActive: rIsActive, 
            taskclickpercentage: parseInt(rTaskclickpercentage),
            isBeta: rIsBeta,
            msg: rMsg 
        } }, { new: true });
        // var bulkOperation = User.collection.initializeUnorderedBulkOp();
        // bulkOperation.find({"wallet.appId": rId , isActive : true}).update(
        //     {
        //             $set: 
        //             { "wallet" : { "name": rName , "icon": rIcon , "isActive": rIsActive }}
        //     })
        // bulkOperation.execute();
        await User.update({ "wallet.appId": rId ,isActive : true}, { $set: { "wallet.$.name": rName, "wallet.$.icon": rIcon, "wallet.$.isActive": rIsActive } }, { multi: true })
        var data = {
            code: 1,
            msg: MSG.application[2],
            data: updateApplication
        }
        _EncDecData.sendFrontRes(res, data)
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});
router.get('/', async (req, res) => {
    try {
        var findallApplication = await Application.find().sort({createDate: -1});
        var data = {
            code: 1,
            msg: MSG.application[4],
            data: findallApplication
        }
        _EncDecData.sendFrontRes(res, data)
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});
module.exports = router;