var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var decData = _EncDecData.DEC(req.body.final)
        var rmobilenumber = decData.mobileNo;
        var rPassword = decData.password;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rFirebaseToken = decData.firebaseToken;
        var rDate = new Date();
        var findUser = await User.find({ mobileNo: rmobilenumber})
                                    .select({coin : 1 ,amount : 1, referCode:1, deviceId:1 , uniqueId: 1, name: 1, mobileNo:1 }).limit(1).lean();
        if (findUser.length == 1) {
            await User.findByIdAndUpdate(findUser[0]._id, { $set: { password: rPassword, firebaseToken: rFirebaseToken, updateDate: rDate } }, {
                "fields": { "_id": 0 }, "new": true});
            var data = {
                code: 1,
                msg: MSG.rp[0],
                resetpassword: {
                    coin: findUser[0].coin,
                    amount: findUser[0].amount,
                    referCode: findUser[0].referCode,
                    deviceId: findUser[0].deviceId,
                    uniqueId: findUser[0].uniqueId,
                    name: findUser[0].name,
                    mobileNo: findUser[0].mobileNo,
                    _id: findUser[0].id
                }
            }
            _EncDecData.sendDataToUser(res, data)
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