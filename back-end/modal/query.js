var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    email: {type : String},
    query: {type : String}, 
    answer: {type : String, default: ""},
    subject: {type : String, default: ""},
    text: {type : String, default: ""},
    userId: { type: Schema.Types.ObjectId },
    mobileNo: {type : String}, 
    deviceId: {type : String}, 
    uniqueId: {type : String},
    updateDate: {type: Date, default: Date.now() },
    createDate : {type: Date, default: Date.now() }
}, { strict: false , versionKey : false, timestamps : false });

var Query = mongoose.model('QUERY', questionSchema);
module.exports = Query;