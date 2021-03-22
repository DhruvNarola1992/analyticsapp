var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var moment = require('moment');
var MSG = require('./../../../common/msg');
var Withdraw = require('./../../../modal/withdraw')
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var decData = _EncDecData.DEC(req.body.final)
        console.log(decData)
        var rmobilenumber = decData.mobileNo;
        var rPassword = decData.password;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rFirebaseToken = decData.firebaseToken;
        var rDate = new Date();
        var findUser = await User.find({ mobileNo: rmobilenumber, password: rPassword })
            .select({
                coin: 1, amount: 1, referCode: 1, minwithcoin: 1, deviceId: 1, uniqueId: 1,
                dailybonus: 1, dailybonusDate: 1, name: 1,
                mobileNo: 1, password: 1,
                getreferCoin: 1, withdrawArray: 1
            }).limit(1).lean();

        var currentenddate = moment(new Date()).endOf('day');
        var checkDate = moment(currentenddate).isAfter(findUser[0].dailybonusDate);
        var listDailybonus = findUser[0].dailybonus;
        var currentstartdate = moment(new Date()).startOf('day');
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
            await User.findByIdAndUpdate(findUser[0]._id, { $set: { dailybonus: usersByDailybonus, dailybonusDate: new Date(currentstartdate) } }, {
                "fields": { "_id": 0 }, "new": true
            });
        }

        if (findUser.length >= 1) {
            await User.findByIdAndUpdate(findUser[0]._id, { $set: { firebaseToken: rFirebaseToken, updateDate: rDate, getreferCoin: 0 } }, {
                "fields": { "_id": 0 }, "new": true
            });
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

            var data = {
                code: 1,
                msg: MSG.login[0],
                login: {
                    coin: findUser[0].coin,
                    amount: findUser[0].amount,
                    referCode: findUser[0].referCode,
                    deviceId: findUser[0].deviceId,
                    uniqueId: findUser[0].uniqueId,
                    name: findUser[0].name,
                    mobileNo: findUser[0].mobileNo,
                    userId: findUser[0]._id,
                    password: findUser[0].password,
                    getreferCoin: findUser[0].getreferCoin,
                    minwithcoin: findUser[0].minwithcoin,
                    withdrawArray: findUser[0].withdrawArray,
                    getLastWithdraw: lastWithdraw
                }
            }
            _EncDecData.sendDataToUser(res, data);
        } else {
            var data = {
                code: 0,
                msg: MSG.login[1]
            }
            _EncDecData.sendDataToUser(res, data);
        }
    } catch (error) {
        console.log(error);
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;