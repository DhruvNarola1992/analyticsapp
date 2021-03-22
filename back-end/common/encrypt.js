var moment = require('moment');
var enkey = 'daed19e749d0c068';
enkey = enkey.toUpperCase();
crypto = module.exports = require('crypto');
const algorithm = 'aes-128-cbc';
const nodemailer = require('nodemailer');
module.exports = {
    ENC: function (msg) {
        msg = JSON.stringify(msg);
        const cipher = crypto.createCipheriv(algorithm, enkey, enkey);
        let encrypted = cipher.update(msg, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        // console.log(encrypted);
        return encrypted;
    },
    DEC: function (msg) {
        const deCipher = crypto.createDecipheriv(algorithm, enkey, enkey);
        let decrypted = deCipher.update(msg, 'base64', 'utf8');
        decrypted += deCipher.final('utf8');
        var final = null;
        final = JSON.parse(decrypted);
        // var rRequesttime = final.rtime;
        // console.log(final)
        // var CurrentDateTime = moment(new Date());
        // var DiffSeconds = CurrentDateTime.diff(new Date(rRequesttime), 'seconds');
        // if(DiffSeconds <= 5) {
        return final;
        // } else {
        //     return null;
        // }
        
    },
    sendFrontRes: function (res, msg) {
        res.json(msg);
    },
    sendDataToUser: function (res, data) {
        // console.log(data);
        var final = _common.ENC(data);
        
        res.json({
            final: final
        });
        // rabbitExchange.publish(`res.${sId}`, data);
    },
    emailService: async function (senderEmail, senderPassword, receiverEmail, receiverAnswer, receiverSubject, recevierText)  {
        console.log(senderEmail, senderPassword, receiverEmail, receiverAnswer, receiverSubject, recevierText)
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: senderEmail, // generated ethereal user
                pass: senderPassword // generated ethereal password
            }            
        });
        
        // send mail with defined transport object
        let mailOptions = {
                from: senderEmail, // sender address
                to: receiverEmail, // list of receivers
                subject: receiverSubject, // Subject line
                text: recevierText, // plain text body
                html: receiverAnswer, // html body
        }
        // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        var info = await transporter.sendMail(mailOptions);

        if(info.messageId) {
            return true;
        } else {
            return false;
        }
       
    }
}