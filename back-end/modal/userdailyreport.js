var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userdailyreportSchema = new Schema({
    _id   : {type : Date , default: new Date()},
    totalimpression : {type : Number , default: 0},
    totalclick : {type : Number , default: 0},
    successimpression: { type: Number, default: 0 },
    failimpression: { type: Number, default: 0 },
    successclick: { type: Number, default: 0 },
    failclick:  { type: Number, default: 0 },
    scratchcount: { type: Number, default: 0 },
    spincount: { type: Number, default: 0 },
    gamecount: { type: Number, default: 0 },

    coinimpression:{ type: Number, default: 0 },
    coinclick:{ type: Number, default: 0 },
    coinscratch:{ type: Number, default: 0 },
    coinspin: { type: Number, default: 0 },
    coinreference: { type: Number, default: 0 },
    coinplaygame: { type: Number, default: 0 },

    todayassigntask: {type : Number, default : 0},   //New Task Assign
    todayassignclick: {type : Number, default : 0},  //New Click Assign 

    todayregister: {type : Number, default : 0},
    todaylogin: {type : Number, default : 0},

    withdrawcoin: { type: Number, default: 0 },
    withdrawamount: { type: Number, default: 0 }
},{strict : false, versionKey : false, timestamps : false});

var Userdailyreport = mongoose.model('USERDAILYREPORT', userdailyreportSchema);
module.exports = Userdailyreport;