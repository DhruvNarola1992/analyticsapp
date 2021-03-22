var express = require('express');
var router = express.Router();
var Coin = require('./../../../modal/coin');
var User = require('./../../../modal/user');
var MSG = require('./../../../common/uimsg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        var rCoin = req.body.coin;
        var rAmount = req.body.amount;
        var rBcoin = req.body.bcoin;
        var rCcoin = req.body.ccoin;
        var rRcoin = req.body.rcoin;
        var rConsttaskday = req.body.consttaskday;       // Const task day
        var rTopicname = req.body.topicname;       //topicname
        var rPath = req.body.path; 
        var rMinimumWithdrawcoin = req.body.minwithcoin; 
        var rwithdrawarray= req.body.withdrawarray;
        var rEmailAddress = req.body.emailaddress;
        var rEmailPassword = req.body.emailpassword;
        var insertCoin = new Coin({
            coin: rCoin,
            amount: rAmount,
            bcoin: rBcoin,
            ccoin: rCcoin,
            rcoin: rRcoin,
            consttaskday: rConsttaskday,
            topicname: rTopicname,
            path: rPath,
            minwithcoin: rMinimumWithdrawcoin,
            withdrawarray: rwithdrawarray,
            emailaddress : rEmailAddress,
            emailpassword : rEmailPassword
        })
        insertCoin.save();
        var data = {
            code: 1,
            msg: MSG.coin[0],
            data: insertCoin
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
        var rId = req.params.id;
        var rCoin = req.body.coin;
        var rAmount = req.body.amount;
        var rBcoin = req.body.bcoin;
        var rCcoin = req.body.ccoin;
        var rRcoin = req.body.rcoin;
        var rPath = req.body.path;  
        var rConsttaskday = req.body.consttaskday;
        var rTopicname = req.body.topicname;
        var rMinimumWithdrawcoin = req.body.minwithcoin;
        var rwithdrawarray= req.body.withdrawarray;
        var rEmailAddress = req.body.emailaddress;
        var rEmailPassword = req.body.emailpassword;
        var countCoin = await Coin.countDocuments();
        if(countCoin > 0) {
            var updateCoin = await Coin.findByIdAndUpdate(rId, {
                $set: {
                    coin: parseInt(rCoin), 
                    amount: parseInt(rAmount), 
                    bcoin: parseInt(rBcoin),
                    ccoin: parseInt(rCcoin),
                    rcoin: parseInt(rRcoin),
                    consttaskday: parseInt(rConsttaskday),
                    topicname: rTopicname,
                    path: rPath,
                    minwithcoin: parseInt(rMinimumWithdrawcoin),
                    withdrawarray: rwithdrawarray,
                    emailaddress : rEmailAddress,
                    emailpassword : rEmailPassword
                }
            }, { new: true });
            await User.update({}, {$set: { 
                    convertCoin: parseInt(rCoin), 
                    convertAmount: parseInt(rAmount), 
                    bannerCoin: parseInt(rBcoin),
                    clickCoin: parseInt(rCcoin),
                    referCoin: parseInt(rRcoin),
                    filterTaskDay: parseInt(rConsttaskday),
                    minwithcoin: parseInt(rMinimumWithdrawcoin),
                    withdrawArray: rwithdrawarray,
            }}, {multi: true})
            var data = {
                code: 1,
                msg: MSG.coin[1],
                data: updateCoin
            }
            _EncDecData.sendFrontRes(res, data);
        } else {
            
            var insertCoin = new Coin({
                coin: rCoin,
                amount: rAmount,
                bcoin: rBcoin,
                ccoin: rCcoin,
                rcoin: rRcoin,
                consttaskday: rConsttaskday,
                topicname: rTopicname,
                path: rPath,
                minwithcoin: rMinimumWithdrawcoin,
                withdrawarray: rwithdrawarray,
                emailaddress : rEmailAddress,
                emailpassword : rEmailPassword
            })
            insertCoin.save();
            var data = {
                code: 1,
                msg: MSG.coin[0],
                data: insertCoin
            }
            _EncDecData.sendFrontRes(res, data);
        }
     
    } catch (error) {
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});
router.get('/', async (req, res) => {
    try {
        var selectCoin = await Coin.find().limit(1).lean();
        var data = {
            code: 1,
            msg: MSG.coin[1],
            data: selectCoin[0]
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