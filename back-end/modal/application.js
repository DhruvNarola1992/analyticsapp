var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = new Schema({
    uan: { type: String, trim: true, unique: true },
    name: { type: String, trim: true },
    icon: { type: String, trim: true },
    url: { type: String, trim: true},
    msg: { type: String, trim: true}, //MSG
    taskclickpercentage: {type : Number}, // Assign Click - 30
    isActive: { type: Boolean, default: false},     //Is Active for all application
    isBeta: {type: Boolean, default: true},        //Beta active is true , so comming soon on front side
    isActiveClick: { type: Boolean, default: true}, //Is Active for Click Task -- dynamic set click close -- Click close karava mate
    totalassigntask: {type : Number, default : 0}, // Assign Task for all user - 2000 
    totalassignclick: {type : Number, default : 0}, // Assign Task for all user - only click - 400 
    todayassigntask: {type : Number, default : 0},
    todayassignclick: {type : Number, default : 0},
    updateDate: {type: Date, default: Date.now() },
    createDate : {type: Date, default: Date.now() }
}, { strict: false , versionKey : false, timestamps : false });

var Application = mongoose.model('APPLICATION', applicationSchema);
module.exports = Application;