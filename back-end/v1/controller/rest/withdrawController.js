var express = require('express');
var router = express.Router();
var Withdraw = require('./../../../modal/withdraw');
var User = require('./../../../modal/user');
var Userdailyreport = require('./../../../modal/userdailyreport');
var MSG = require('./../../../common/msg');
var moment = require('moment');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        // var rtime=req.body.rtime;
        // var rUserId=req.body.userId;
        // var rCoin =req.body.coin;
        // var rmobilenumber=req.body.mobileNo;
        // var rDeviceId=req.body.deviceId;
        // var rUniqueId=req.body.uniqueId;
        // var rName=req.body.name;
        
        var decData = _EncDecData.DEC(req.body.final)
        console.log(decData);
        var rUserId = decData.userId;
        var rCoin = decData.coin;
        var rmobilenumber = decData.mobileNo;
        var rName = decData.name;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        // var CurrentDate = moment(new Date()).startOf('day');
        var WithdrawDate = moment(new Date()).endOf('day');
        var findUser = await User.findById(rUserId).select({
            isActive: 1, mobileNo: 1, deviceId: 1, uniqueId: 1, isFirstWithdraw: 1, name: 1, minwithcoin: 1,
            coin: 1, amount: 1, convertCoin: 1, convertAmount: 1, withdrawDate: 1, referCoin: 1, reference: 1, getreferCoin: 1
        });
        var findIsFirstWithdraw = findUser.isFirstWithdraw; // Set true after one withdraw
        var checkbalance = findUser.coin - parseInt(rCoin); // balance must be grater than zero
        var rAmount = parseFloat((parseInt(rCoin) * findUser.convertAmount) / findUser.convertCoin); // Amount must be gareter than zero 
        var findWithdrawdate = moment(findUser.withdrawDate).format();
        var DiffDay = WithdrawDate.diff(findWithdrawdate, 'days');
        var getReference = findUser.reference;
        var getReferencecoin = findUser.referCoin;
        var getRefernceamount = parseFloat((parseInt(getReferencecoin) * findUser.convertAmount) / findUser.convertCoin);
        var getUserReferData = "Refer" + "," + findUser.name + "," + findUser.mobileNo;

        //User Get data
        if (findUser != null) {
            if (checkbalance >= 0) {
                if (findUser.isActive == true
                    && findUser.mobileNo == rmobilenumber
                    && findUser.minwithcoin <= findUser.coin
                    && findUser.minwithcoin <= parseInt(rCoin)
                    && DiffDay >= 1) {
                    var insertWithdraw = await new Withdraw({
                        coin: parseInt(rCoin),
                        amount: rAmount,
                        mobileNo: rmobilenumber,
                        name: rName,
                        deviceId: rDeviceId,
                        uniqueId: rUniqueId,
                        userId: rUserId,
                        updateDate: new Date(),
                        createDate : new Date()
                    });
                    var arrayActivity = [];
                    var objectActivity = {};
                    objectActivity['appId'] = null;
                    objectActivity['uan'] = "Master";
                    objectActivity['type'] = "Withdraw";
                    objectActivity['coin'] = parseInt(-rCoin); // Akshay Bapu
                    objectActivity['flag'] = true;
                    objectActivity['clientdate'] = new Date();
                    arrayActivity.push(objectActivity);
                    if (!findIsFirstWithdraw) {
                        //Withdarw amount add for refer user and activity log with Username,Mobilenumber dhruvbhai ne puchi ne karyu che
                        var referarrayActivity = [];
                        var referobjectActivity = {};
                        referobjectActivity['appId'] = null;
                        referobjectActivity['uan'] = "Master";
                        referobjectActivity['type'] = getUserReferData;
                        referobjectActivity['coin'] = parseInt(getReferencecoin);
                        referobjectActivity['flag'] = true;
                        referobjectActivity['clientdate'] = new Date();
                        referarrayActivity.push(referobjectActivity);
                        await User.update({ "referCode": getReference }, {
                            $inc: {
                                "totalcoin": parseInt(getReferencecoin),
                                "coin": parseInt(getReferencecoin),
                                "amount": getRefernceamount,
                                "getreferCoin": parseInt(getReferencecoin),
                                "coinreference": parseInt(getReferencecoin)
                            },
                            $push: { activity: referarrayActivity }
                        });

                    }
                    await Userdailyreport.findOneAndUpdate({}, {
                        $inc: {
                            "coinreference": getReferencecoin,
                            "withdrawcoin": parseInt(rCoin),
                            "withdrawamount": parseInt(rAmount)
                        }
                    }, { "sort": { "_id": -1 }, "fields": { "_id": 0 }, upsert: true });
                    var updateUser = await User.findByIdAndUpdate(rUserId, {
                        $inc:
                        {
                            coin: parseInt(-rCoin),
                            amount: -rAmount
                        },
                        $set: {
                            withdrawDate: new Date(WithdrawDate),
                            isFirstWithdraw: true
                        },
                        $push: {
                            activity: arrayActivity
                        }
                    },
                        { "fields": { "coin": 1, "amount": 1, _id: 0 }, new: true })
                    insertWithdraw.save();
                    var data = {
                        code: 1,
                        msg: MSG.withdraw[0],
                        withdraw: updateUser
                    }
                    _EncDecData.sendDataToUser(res, data)
                } else if (findUser.minwithcoin > findUser.coin || findUser.minwithcoin > parseInt(rCoin)) {
                    var data = {
                        code: 4,
                        msg: MSG.withdraw[1]
                    }
                    _EncDecData.sendDataToUser(res, data);
                } else if (DiffDay <= 1) {
                    var data = {
                        code: 3,
                        msg: MSG.withdraw[3]
                    }
                    _EncDecData.sendDataToUser(res, data);
                } else if(!(findUser.isActive)){
                    var data = {
                        code: 5,
                        msg: MSG.withdraw[4]
                    }
                    _EncDecData.sendDataToUser(res, data);
                } else {
                    var data = {
                        code: 6,
                        msg: MSG.withdraw[1]
                    }
                    _EncDecData.sendDataToUser(res, data);
                }
            } else {
                var data = {
                    code: 2,
                    msg: MSG.withdraw[1]
                }
                _EncDecData.sendDataToUser(res, data);
            }

        } else {
            var data = {
                code: 0,
                msg: MSG.common[1]
            }
            _EncDecData.sendDataToUser(res, data);
        }
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;
