var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var notificationSchema = new Schema({
   title : {type: String, trim: true}, 
   text : {type: String, trim: true},
   image : {type : String},
   updateDate: {type: Date, default: Date.now() },
   createDate : {type: Date, default: Date.now() }
},{strict : false, versionKey : false, timestamps : false});

var Notify = mongoose.model('NOTIFY', notificationSchema);
module.exports = Notify;