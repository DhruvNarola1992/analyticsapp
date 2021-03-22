var express = require('express');
var router = express.Router();
var Notify = require('./../../../modal/notification');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var decData = _EncDecData.DEC(req.body.final)
        var rUserId = decData.userId;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rTime = decData.rtime;
        var findQuery = await Notify.find({ }).sort({ _id: -1 }).limit(10).lean();
        var data = {
            code: 1,
            msg: MSG.notify[0],
            notifylist: findQuery
        }
        
        _EncDecData.sendDataToUser(res, data)
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;