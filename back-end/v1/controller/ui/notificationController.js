var express = require('express');
var router = express.Router();
var admin = require('firebase-admin')
var FirebaseAccount = require('./../../../common/firebase.json')
var Notify = require('./../../../modal/notification');
var Coin = require('./../../../modal/coin');
var MSG = require('./../../../common/uimsg');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './public' });
var _EncDecData = require('./../../../common/encrypt')
admin.initializeApp({
    credential: admin.credential.cert(FirebaseAccount)
})
router.get('/', async (req, res) => {
    var data = await Notify.find({}).sort({createDate:-1}).lean();
    try {
        res.json({
            status: true,
            msg: 'List',
            data: data
        })
    } catch (error) {
        res.json({
            status: false,
            msg: 'Error'
        })
    }
});
router.post('/',multipartMiddleware, async (req, res) => {
    try {
        var findTopicname = await Coin.find({}).select({_id:0, path: 1, topicname: 1}).lean();
        var imagePath = findTopicname[0].path;
        var topic = findTopicname[0].topicname;
        var rTitle = req.body.title;
        var rText = req.body.text;
        
       
        if(req.files.pic == null || req.files.pic.size == 0) {
            var message = {
                notification: {
                    title: rTitle,
                    body: rText
                },
                // android: {
                //     ttl: 3600 * 1000,
                //     notification: {
                //       icon: 'stock_ticker_update',
                //       color: '#f44283',
                //     },
                //   },
                //   apns: {
                //     payload: {
                //       aps: {
                //         badge: 42,
                //       },
                //     },
                // },
                topic: topic
            };
           
            admin.messaging().send(message, false).then((response) => { }).catch((error) => {}); 
            var iNotify = new Notify({ title: rTitle, text: rText, image: null, updateDate: new Date(), createDate : new Date() });
            iNotify.save();
            var data = {
                code: 1,
                msg: MSG.common[0],
                data: iNotify
            }
            _EncDecData.sendFrontRes(res, data);
        } else {
            var rPic = req.files.pic;
            var pathSplit = rPic.path;
            var imageSend = imagePath + pathSplit.split('/')[1];
            var message = {
                notification: {
                    title: rTitle,
                    body: rText,
                    image: imageSend
                },
                topic: topic
            };
            admin.messaging().send(message).then((response) => { }).catch((error) => {});
            var iNotify = new Notify({ title: rTitle, text: rText, image: imageSend })
            iNotify.save();
            var data = {
                code: 1,
                msg: MSG.common[0],
                data: iNotify
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
router.put('/', async (req, res) => {
    try {
        var id = req.body.id;
        var rTitle = req.body.title;
        var rText = req.body.text;
        var updateNotify = await Notify.findByIdAndUpdate(id, { $set: { title: rTitle, text: rText } }, { new: true, upsert: true })
        var data = {
            code: 1,
            msg: MSG.common[0]
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
        var rId = req.params.id;
        var deleteNotify = await Notify.findByIdAndRemove(rId);
        var data = {
            code: 1,
            msg: MSG.common[0],
            data: deleteNotify
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