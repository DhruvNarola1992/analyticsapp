var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var keywordSchema = new Schema({
    seq: {type: Number, default: 0},
    keyword : {type: String, trim: true,required: true},
    value : {type: String, trim: true, default: ""},
    desc : {type : String, trim: true, default: ""},
    update : {type : Date, default: new Date()}
},{strict : false});

var Keyword = mongoose.model('KEYWORD', keywordSchema);
module.exports = Keyword;