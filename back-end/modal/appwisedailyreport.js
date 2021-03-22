var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var applicationdailyreportSchema = new Schema({
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
    // coinreference: { type: Number, default: 0 }, -- Report nahi bane
    coinplaygame: { type: Number, default: 0 },

    appId: {type : Schema.Types.ObjectId },
    todayassigntask: {type : Number, default : 0},   //New Task Assign
    todayassignclick: {type : Number, default : 0},  //New Click Assign   
    uan: { type: String, trim: true },
    name: { type: String, trim: true },
},{strict : false, versionKey : false, timestamps : false});

var Applicationdailyreport = mongoose.model('APPLICATIONREPORT', applicationdailyreportSchema);
module.exports = Applicationdailyreport;