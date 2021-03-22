var express = require('express');
var router = express.Router();
var Query = require('./../../../modal/query');
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var decData = _EncDecData.DEC(req.body.final)
        var rUserId = decData.userId;
        var findQuery = await Query.find({ userId: rUserId }).sort({ createDate: -1 }).limit(10).lean();
        var data = {
            code: 1,
            msg: MSG.query[0],
            querylist: findQuery
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