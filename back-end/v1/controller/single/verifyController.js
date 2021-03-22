var express = require('express');
var router = express.Router();
var User = require('./../../../modal/user');
var MSG = require('./../../../common/msg');
var _EncDecData = require('./../../../common/encrypt')
router.post('/', async (req, res) => {
    try {
        console.log("Verify")
        // var rDeviceId = req.body.deviceId;     
        // var rUniqueId = req.body.uniqueId;     
        // var rUan = req.body.uan;
 
        var decData = _EncDecData.DEC(req.body.final)
        var rDeviceId = decData.deviceId;
        var rUniqueId = decData.uniqueId;
        var rUan = decData.uan;
        var rTime = decData.rtime;
        var findUser = await User.find({ uniqueId: rUniqueId }, {
            deviceId: 1, uniqueId: 1, wallet: 1, isActive: 1
        });
        var data ;
        if (findUser.length >= 1) {
            var allWallet = findUser[0].wallet;
            var findApp = await allWallet.filter(data =>  data.uan == rUan);
            if(findUser[0].isActive && findApp[0].isActive) {
                data = {
                    code: 1,
                    msg: MSG.login[0],
                    verifylogin: {
                        deviceId: findUser[0].deviceId,
                        uniqueId: findUser[0].uniqueId,
                        isActive: findUser[0].isActive, //User block  -- false -- master block
                        isApp: findApp[0].isActive      //Application block
                    }
                }
            } else {
                data = {
                    code: 2,
                    msg: MSG.login[0],
                    verifylogin: {
                        deviceId: findUser[0].deviceId,
                        uniqueId: findUser[0].uniqueId,
                        isActive: findUser[0].isActive, //User block  -- false -- master block
                        isApp: findApp[0].isActive      //Application block
                    }
                }
            }
           
            console.log(data)
            _EncDecData.sendDataToUser(res, data )
        } else {
            data = {
                code: 0,
                msg: MSG.login[1]
            }
            _EncDecData.sendDataToUser(res, data);
        }
    } catch (error) {
        console.log(error)
        data = {
            code: 0,
            msg: MSG.common[0]
        }
        _EncDecData.sendDataToUser(res, data);
    }
});
module.exports = router;