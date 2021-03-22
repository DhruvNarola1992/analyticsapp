var express = require('express');
var router = express.Router();
var Application = require('./../../../modal/application');
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var decData = _EncDecData.DEC(req.body.final)
        var rUserId = decData.userId;
        var findUser = await User.findById(rUserId).select({_id:1}).lean();
        var findApplication = await Application.find({ isActive: true } , {uan: 1, name: 1, icon: 1, url: 1,msg: 1, isBeta: 1}).lean();
        if (findApplication.length > 0 && findUser != null) {
            var data = {
                code: 1,
                msg: MSG.application[0],
                applicationlist: findApplication
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