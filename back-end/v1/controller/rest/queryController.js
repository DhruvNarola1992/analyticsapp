var express = require('express');
var router = express.Router();
var Query = require('./../../../modal/query');
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var decData = _EncDecData.DEC(req.body.final);
        var rEmail = decData.email; 
        var rUserId = decData.userId;
        var rQuestion = decData.query;
        var rmobilenumber = decData.mobileNo;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var findUser = await User.findById(rUserId).select({_id : 1}).lean();
        var insertQuery = new Query({
            query: rQuestion, 
            answer: "",
            userId: rUserId,
            mobileNo: rmobilenumber,
            deviceId: rDeviceId,
            uniqueId: rUniqueId,
            email: rEmail,
            updateDate: new Date(),
            createDate: new Date()
        })
        if (findUser != null) {
            insertQuery.save();
            var data = {
                code: 1,
                msg: MSG.query[0]
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