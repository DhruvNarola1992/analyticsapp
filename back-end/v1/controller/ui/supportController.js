var express = require('express');
var router = express.Router();
var Query = require('./../../../modal/query');
var Coin = require('./../../../modal/coin');
var MSG = require('./../../../common/uimsg');
const nodemailer = require("nodemailer");
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        //Sorting
        var rSortColumn = req.body.active;
        var rSortType = req.body.direction;
        var sort = {
            [req.body.active]: rSortType
        }

        //Type
        var rType = req.body.type;

        //Search
        var rFilterMobileno = req.body.filterMobilno;

        //Pagination
        var rSkip = parseInt(req.body.pageIndex) * parseInt(req.body.pageSize);
        var rLimit = parseInt(req.body.pageSize);
        var totalCount = 0;
        var listQuery;

        if (rType == "Not") {
            if (rFilterMobileno == "") {
                totalCount = await Query.countDocuments({ answer: "" });
                listQuery = await Query.find({ answer: "" }).sort(sort).skip(rSkip).limit(rLimit).lean();
            } else {
                totalCount = await Query.countDocuments({ answer: "", mobileNo: rFilterMobileno });
                listQuery = await Query.find({ answer: "", mobileNo: rFilterMobileno }).sort(sort).skip(rSkip).limit(rLimit).lean();
            }
        } else if (rType == "Yes") {
            if (rFilterMobileno == "") {
                totalCount = await Query.find({ answer: { $ne: "" } }).count();
                listQuery = await Query.find({ answer: { $ne: "" } }).sort(sort).skip(rSkip).limit(rLimit).lean();
            } else {
                totalCount = await Query.find({ answer: { $ne: "" }, mobileNo: rFilterMobileno }).count();
                listQuery = await Query.find({ answer: { $ne: "" }, mobileNo: rFilterMobileno }).sort(sort).skip(rSkip).limit(rLimit).lean();
            }
        } else {
            totalCount = 0;
            listQuery = [];
        }

        data = {
            code: 1,
            msg: MSG.coin[0],
            data: {
                dataSource: listQuery,
                length: totalCount
            }
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
        //Every Answer 
        var rId = req.params.id;
        var rAnswer = req.body.answer.trim();
        var rReceiversemail = req.body.email;
        var rReceiverSubject = req.body.subject;
        var rRecevierText = req.body.text;

        var rConst = await Coin.find({}).select({ emailaddress: 1, emailpassword: 1, _id: 0 }).limit(1).lean();
        var senderEmail = rConst[0].emailaddress;
        var senderPassword = rConst[0].emailpassword;
        // console.log(senderEmail, senderPassword, rReceiversemail, rAnswer, rReceiverSubject, rRecevierText)

        var resData = await _EncDecData.emailService(senderEmail, senderPassword, rReceiversemail, rAnswer, rReceiverSubject, rRecevierText);
        if(resData) {
           await  Query.findByIdAndUpdate(rId, { $set: { answer: rAnswer, subject: rReceiverSubject, text: rRecevierText, updateDate: new Date() } }, { "fields": { "_id": 0 }, "new": true });
        } else {
            await Query.findByIdAndRemove(rId)
        } 
        var data = {
            code: 1,
            msg: MSG.coin[0]
        }
        _EncDecData.sendFrontRes(res, data);
    } catch (error) {
        console.log(error)
        var data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendFrontRes(res, data);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        //Every Answer 
        var rId = req.params.id;
        var deleteData = await Query.findByIdAndRemove(rId)
        var data = {
            code: 1,
            msg: MSG.coin[0],
            data: deleteData
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



        // let transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'rplinfotech00@gmail.com', // generated ethereal user
        //         pass: 'ktgxpgdvqgdlkglx' // generated ethereal password
        //     }
        // });
        // // send mail with defined transport object
        // let mailOptions = {
        //         from: 'rplinfotech00@gmail.com', // sender address
        //         to: 'rplinfotech00@gmail.com', // list of receivers
        //         subject: 'Hello', // Subject line
        //         text: 'My', // plain text body
        //         html: 'drtfertf', // html body
        // }

        // var info = await transporter.sendMail(mailOptions);

        // console.log("Message sent: %s", info.messageId);




