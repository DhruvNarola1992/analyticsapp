var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        // var rUserId = req.body.userId;
        var decData = _EncDecData.DEC(req.body.final);
        var rUserId = decData.userId;
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rSpin = decData.spin;
        var rTaskdataId = decData.taskdataId;
        var rTime = decData.rtime;
        console.log(new Date(rTime), new Date());
        var findTask = await User.find({ "taskdata._id": rTaskdataId }, {
            "taskdata.$": 1, "isActive": 1
        });
        if (findTask != null) {
            var compareTaskSpin = parseInt(findTask[0].taskdata[0].spin) + parseInt(rSpin);
            await User.update({ "taskdata._id": rTaskdataId }, { $inc: { "taskdata.$.spin": parseInt(rSpin) } });
            var data = {
                code: 1,
                msg: MSG.walletbyapplication[0],
                addspin: compareTaskSpin
            }
            // console.log(data)
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