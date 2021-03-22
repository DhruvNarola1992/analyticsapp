var express = require('express');
var router = express.Router();
var Task = require('./../../../modal/task');
var Coin = require('./../../../modal/coin');
var MSG = require('./../../../common/uimsg');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './public' });
var _EncDecData = require('./../../../common/encrypt')
//Add task, if previous scratch insert
router.post('/', async (req, res) => {
    try {
        var rTask = req.body.task;
        var rSpin = req.body.spin;
        var rMaxclick = req.body.maxclick;
        var rMaxtimeclick = req.body.maxtimeclick;
        var rMintimeclick = req.body.mintimeclick;
        var rClicktimer = req.body.clicktimer;
        var rIsClick = req.body.isClick;    // given task click or not
        var findtask = await Task.find({}).select({
            "scratch.scratchimage": 1,
            "scratch.totalCard": 1,
            "scratch.selectcoin": 1,
            _id: 0
        }).limit(1);
        if (findtask.length > 0) {
            var insertTask = new Task({
                task: rTask,                    //task complete
                spin: rSpin,                    //spin complete
                maxclick: rMaxclick,            //max click  
                maxtimeclick: rMaxtimeclick,    //max time click application
                mintimeclick: rMintimeclick,    //min task click application
                clicktimer: rClicktimer,        //click timer 
                isClick: rIsClick,              //given task click or not
                scratch: findtask[0].scratch
            });
            insertTask.save();
        } else {
            var insertTask = new Task({
                task: rTask,                    //task complete
                spin: rSpin,                    //spin complete
                maxclick: rMaxclick,            //max click  
                maxtimeclick: rMaxtimeclick,    //max time click application
                mintimeclick: rMintimeclick,    //min task click application
                clicktimer: rClicktimer,        //click timer 
                isClick: rIsClick,              //given task click or not
                scratch: []
            });
            insertTask.save();
        }

        var data = {
            code: 1,
            msg: MSG.task[0],
            data: "Save"
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
//Task Update
router.put('/', async (req, res) => {
    try {
        var rId = req.body.id;
        var rTask = req.body.task;
        var rSpin = parseInt(req.body.spin);
        var rMaxclick = parseInt(req.body.maxclick);
        var rMaxtimeclick = parseInt(req.body.maxtimeclick);
        var rMintimeclick = parseInt(req.body.mintimeclick);
        var rClicktimer = parseInt(req.body.clicktimer);
        var rIsClick = req.body.isClick;    // given task click or not
        var rIsActive = req.body.isActive;  //Assign Every day active or not, Click avalible
        var updateTaskData = {
            task: rTask,                    //task complete
            spin: rSpin,                    //spin complete
            maxclick: rMaxclick,            //max click  
            maxtimeclick: rMaxtimeclick,    //max time click application
            mintimeclick: rMintimeclick,    //min task click application
            clicktimer: rClicktimer,        //click timer 
            isClick: rIsClick,              //given task click or not
            isActive: rIsActive,            //Assign Every day active or not, Click avalible
        };
        var updateTask = await Task.findByIdAndUpdate(rId, { $set: updateTaskData }, {
            "fields": { "task": 1, "spin": 1, "maxclick": 1, "maxtimeclick": 1, "mintimeclick": 1, "clicktimer": 1, "isClick": 1, "isActive": 1, "_id": 0 },
            "new": true
        })
        var data = {
            code: 1,
            msg: MSG.task[0],
            data: updateTask
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
//get all task
router.get('/', async (req, res) => {
    try {
        var findTask = await Task.find({})
            .select({ task: 1, spin: 1, maxclick: 1, maxtimeclick: 1, mintimeclick: 1, clicktimer: 1, isClick: 1, isActive: 1, createDate: 1 })
            .sort({ createDate: -1 }).lean();
        var data = {
            code: 1,
            msg: MSG.task[0],
            data: findTask
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
//delete task 
router.delete('/:id', async (req, res) => {
    try {
        var rId = req.params.id;
        var deleteTask = await Task.findByIdAndDelete(rId);
        var data = {
            code: 1,
            msg: MSG.task[0],
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
})
/**
 * 
 * Scratch Api 
 * 
*/
//Add Scratch , all task
router.post('/:id', multipartMiddleware, async (req, res) => {
    if (req.files.scratchpic == undefined || req.files.scratchpic.size == 0) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    } else {
        var ConstPath = await Coin.find({}).limit(1).lean();
        var rCoin = req.body.coin;
        var rTotalcard = parseInt(req.body.totalCard);
        var rPic = req.files.scratchpic;
        var pathSplit = rPic.path;
        var imageSend = ConstPath[0].path + pathSplit.split('/')[1];
        var scratchObject = {
            selectcoin: rCoin,
            totalCard: rTotalcard,
            scratchimage: imageSend
        }
        var findTask = await Task.countDocuments();
        if (findTask == 0) {
            var arrayScratch = [];
            arrayScratch.push(scratchObject)
            var insertScratch = new Task({
                scratch: arrayScratch
            })
            insertScratch.save();
        } else {
            await Task.update({}, { $push: { scratch: scratchObject } }, { multi: true });
        }

        var data = {
            code: 1,
            msg: MSG.task[0],
            data: "Save"
        }
        _EncDecData.sendFrontRes(res, data);
    }
});
//Get all Scratch , Any one task 
router.get('/:id', async (req, res) => {
    try {
        var findTask = await Task.find({}).select({ scratch: 1, _id: 0 }).limit(1).lean();
        var data = {
            code: 1,
            msg: MSG.task[0],
            data: findTask[0].scratch
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
//Update Scratch , all task
router.put('/:id', multipartMiddleware, async (req, res) => {
    var rPre_scratchpic = req.body.pastscratchpic;
    var rPre_totalCard = parseInt(req.body.pasttotalCard);
    var rPre_selectcoin = req.body.pastcoin;
    var rCoin = req.body.coin;
    var rTotalcard = req.body.totalCard;
    var findTotalTask = await Task.find({}, { scratch: 1, _id: 0 }).limit(1);
    var totalTaskLength = findTotalTask[0].scratch.length
    // console.log(totalTaskLength[0].scratch.length)
    if (req.files.scratchpic == undefined || req.files.scratchpic.size == 0) {
        if (totalTaskLength > 0) {
            await Task.update({}, { $set: { scratch: [] } }, { multi: true });
            var arrayScratch = [];
            for (let index = 0; index < totalTaskLength; index++) {
                const preImage = findTotalTask[0].scratch[index].scratchimage;
                const preCard = findTotalTask[0].scratch[index].totalCard;
                const preCoin = findTotalTask[0].scratch[index].selectcoin;
                var objectScratch = {}
                if (preImage == rPre_scratchpic && preCard == rPre_totalCard && preCoin == rPre_selectcoin) {
                    objectScratch['selectcoin'] = rCoin;
                    objectScratch['totalCard'] = parseInt(rTotalcard);
                    objectScratch['scratchimage'] = rPre_scratchpic;
                    arrayScratch.push(objectScratch);
                } else {
                    objectScratch['selectcoin'] = preCoin;
                    objectScratch['totalCard'] = parseInt(preCard);
                    objectScratch['scratchimage'] = preImage;
                    arrayScratch.push(objectScratch);
                }
            }
            await Task.update({}, { $push: { scratch: arrayScratch } }, { multi: true });
        }
        var data = {
            code: 1,
            msg: MSG.task[0]
        }
        _EncDecData.sendFrontRes(res, data);
    } else {
        var ConstPath = await Coin.find({}).limit(1).lean();
        var rPic = req.files.scratchpic;
        var pathSplit = rPic.path;
        var imageSend = ConstPath[0].path + pathSplit.split('/')[1];
        if (totalTaskLength > 0) {
            await Task.update({}, { $set: { scratch: [] } }, { multi: true });
            var arrayScratch = [];
            for (let index = 0; index < totalTaskLength; index++) {
                const preImage = findTotalTask[0].scratch[index].scratchimage;
                const preCard = findTotalTask[0].scratch[index].totalCard;
                const preCoin = findTotalTask[0].scratch[index].selectcoin;
                var objectScratch = {}
                if (preImage == rPre_scratchpic && preCard == rPre_totalCard && preCoin == rPre_selectcoin) {
                    objectScratch['selectcoin'] = rCoin;
                    objectScratch['totalCard'] = parseInt(rTotalcard);
                    objectScratch['scratchimage'] = imageSend;
                    arrayScratch.push(objectScratch);
                } else {
                    objectScratch['selectcoin'] = preCoin;
                    objectScratch['totalCard'] = parseInt(preCard);
                    objectScratch['scratchimage'] = preImage;
                    arrayScratch.push(objectScratch);
                }
            }
            await Task.update({}, { $push: { scratch: arrayScratch } }, { multi: true });
        }
        var data = {
            code: 1,
            msg: MSG.task[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});
// Delete Scratch , all task
router.put('/:id/:id', async (req, res) => {
    var rPre_scratchpic = req.body.pre_scratchimage;
    var rPre_totalCard = parseInt(req.body.pre_totalCard);
    var rPre_selectcoin = req.body.pre_selectcoin;
    var findTotalTask = await Task.find({}, { scratch: 1, _id: 0 }).limit(1);
    var totalTaskLength = findTotalTask[0].scratch.length;
    if (totalTaskLength > 0) {
        await Task.update({}, { $set: { scratch: [] } }, { multi: true });
        var arrayScratch = [];
        for (let index = 0; index < totalTaskLength; index++) {
            const preImage = findTotalTask[0].scratch[index].scratchimage;
            const preCard = findTotalTask[0].scratch[index].totalCard;
            const preCoin = findTotalTask[0].scratch[index].selectcoin;
            var objectScratch = {}
            if (preImage != rPre_scratchpic || preCard != rPre_totalCard || preCoin != rPre_selectcoin) {
                objectScratch['selectcoin'] = preCoin;
                objectScratch['totalCard'] = parseInt(preCard);
                objectScratch['scratchimage'] = preImage;
                arrayScratch.push(objectScratch);
            }
        }
        await Task.update({}, { $push: { scratch: arrayScratch } }, { multi: true });
    }
    var data = {
        code: 1,
        msg: MSG.task[0]
    }
    _EncDecData.sendFrontRes(res, data);

});




module.exports = router;