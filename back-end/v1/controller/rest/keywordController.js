
var express = require('express');
var router = express.Router();
var Keyword = require('./../../../modal/keyword')
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')

router.post('/', async (req, res) => {
    console.log("----------KEYWORD------------")
    var decData = _EncDecData.DEC(req.body.final)
    var listKeywords = await Keyword.find({}, {keyword : 1, value : 1 ,  _id : 0}).lean();
    try {
        var data = {
            code: 1,
            msg: MSG.withdraw[2],
            gameData: listKeywords
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