var express = require('express');
var router = express.Router();
var moment = require('moment');
var Withdraw = require('./../../../modal/withdraw');
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var decData = _EncDecData.DEC(req.body.final)
        var rUserId = decData.userId;
        var rTime = decData.rtime;
        // console.log(new Date(rTime), new Date())
        var findUser = await User.findById(rUserId).select({_id:0}).lean();
        var findWithdraw = await Withdraw.find({ userId: rUserId }, {
            "status": 1,
            "updateDate": 1,
            "coin": 1,
            "amount": 1
        }).lean();
        if (findUser != null && findWithdraw.length > 0) {
            const updateDateUser = await findWithdraw.map(fw => {
                const container = {};
                container['status'] = fw.status;
                container['updateDate'] = moment(fw.updateDate).format('MM/DD/YYYY');
                container['amount'] = fw.amount;
                container['coin'] = fw.coin;
                return container;
            })
            var data = {
                code: 1,
                msg: MSG.withdraw[2],
                historylist: updateDateUser
            }
            _EncDecData.sendDataToUser(res, data)
        } else if (findWithdraw.length == 0) {
            var data = {
                code: 0,
                msg: MSG.withdraw[1]
            }
            _EncDecData.sendDataToUser(res, data);
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