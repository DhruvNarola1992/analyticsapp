var express = require('express');
var router = express.Router();
var moment = require('moment');
var User = require('./../../../modal/user');
var MSG = require('./../../../common/uimsg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var rLessthandate = req.body.fromdate;
        var bulkOperation = User.collection.initializeUnorderedBulkOp();
        bulkOperation.find({"activity.clientdate" : { $lte: new Date(rLessthandate) }}).update(
            {
                    $pull: 
                    { "activity" : { "clientdate": { $lte: new Date(rLessthandate)} } }
            })
        bulkOperation.execute();    
        // await User.update({
        //     "activity.clientdate" : { $lte: new Date(rLessthandate) }
        // },{
        //     $pull: 
        //     { "activity" : { "clientdate": { $lt: new Date(rLessthandate)} } }
        // }, {
        //     multi: true
        // });
        var data = {
            code: 1,
            msg: MSG.coin[0]
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
module.exports = router;

