var express = require('express');
var router = express.Router();
var Keyword = require('./../../../modal/keyword')
var MSG = require('./../../../common/uimsg');
var _EncDecData = require('./../../../common/encrypt')

router.get('/', async (req, res) => {
    var dataList = await Keyword.find({}).sort({ seq: 1 });
    try {
        var data = {
            code: 1,
            msg: MSG.coin[0],
            data: dataList
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});

router.post('/', async (req, res) => {
    try {
        var rSeq = parseInt(req.body.seq);
        var rKey = req.body.keyword;
        var rValue = req.body.value;
        var rDesc = req.body.desc;
        var keyword = new Keyword({
            seq: rSeq,
            keyword: rKey,
            value: rValue,
            desc: rDesc,
            update: new Date()
        });
        keyword.save();
        var data = {
            code: 1,
            msg: MSG.coin[0],
            data: keyword
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        var id = req.params.id;
        var deleteTask = await Keyword.findByIdAndDelete(id);
        var data = {
            code: 1,
            msg: MSG.coin[0],
            data: deleteTask
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});

router.put('/:id', async (req, res) => {
    try {
        var id = req.params.id;
        var rKey = req.body.keyword;
        var rValue = req.body.value;
        var rDesc = req.body.desc;
        var rSeq = req.body.seq;
        var walletUpdate = await Keyword.findByIdAndUpdate(id, {
            $set: {
                seq: parseInt(rSeq),
                keyword: rKey,
                value: rValue,
                desc: rDesc,
                update: new Date()
            }
        },
            {
                "fields": {
                    "_id": 1,
                    "keyword": 1,
                    "value": 1,
                    "desc": 1,
                    "update": 1,
                    "seq": 1
                },
                "new": true
            })
        var data = {
            code: 1,
            msg: MSG.coin[0],
            data: walletUpdate
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});

router.post('/seq', async (req, res) => {
    var rData = req.body.keywords;
    for (var i = 0; i < rData.length; i++) {
        var rId = rData[i]._id;
        var rSeq = rData[i].newseq;
        var updatedata = await Keyword.findByIdAndUpdate(rId, { $set: { seq: rSeq } });
    }
    var data = {
        code: 1,
        msg: MSG.common[0]
    }
    _EncDecData.sendFrontRes(res, data);

});


module.exports = router;