var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    task: {type : String, default: "B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B"}, //B,C,D,V
    spin: {type : Number, default: 20}, // 5
    maxclick: {type : Number, default: 1}, // 4
    maxtimeclick: {type: Number, default: 30},
    mintimeclick: {type: Number, default: 25}, 
    clicktimer: {type: Number, default: 21},
    scratch: [{
        scratchimage: { type : String},
        totalCard : {type : Number}, //
        selectcoin: {type : String} // 
    }],
    isClick: {type : Boolean , default : false},  // given task click or not
    isActive: {type : Boolean , default : true}, //Assign Every day active or not, Click avalible
    // appId: {type : Schema.Types.ObjectId }, // Appid reference -- application wise close task
    updateDate: {type: Date, default: Date.now() },
    createDate : {type: Date, default: Date.now() }
}, { strict: false , versionKey : false, timestamps : false });

var Task = mongoose.model('TASK', taskSchema);
module.exports = Task;