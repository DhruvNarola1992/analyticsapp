var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var decData = _EncDecData.DEC(req.body.final)
        var rmobilenumber = decData.mobileNo;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var findUser = await User.find({ mobileNo: rmobilenumber })
                                    .select({_id : 1}).limit(1).lean();
        if (findUser.length == 1) {
            var data = {
                code: 1,
                msg: MSG.fp[0]
            }
            _EncDecData.sendDataToUser(res, data )
        } else {
            var data = {
                code: 0,
                msg: MSG.fp[1]
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