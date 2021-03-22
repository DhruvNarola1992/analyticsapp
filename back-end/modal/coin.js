var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var coinSchema = new Schema({
    coin: {type : Number , required: [true, 'Coin required']},  // Atla Coin 100000
    amount: {type : Number, required: [true, 'Amount required']},// Atla rupiya 10
    bcoin: {type : Number, required: [true, 'Banner Coin required']}, // banner or impression     //100
    ccoin: {type : Number, required: [true, 'Click Coin required']}, // click coin               //5000   
    rcoin: {type : Number, required: [true, 'Refer Coin required']}, // refer coin               //5000
    consttaskday: {type : Number, required: [true, 'Const day task assign required']}, //unique user - 5
    path: {type : String},  
    topicname: {type : String},  
    minwithcoin: {type: Number, required: [true, 'Minimum coin required']},   
    withdrawarray: {type: String, default: "10000,20000,30000,40000,50000,60000,70000,80000,90000,100000"},   
    emailaddress: {type: String},
    emailpassword: {type: String},                               
    updateDate: {type: Date, default: Date.now() },      
    createDate : {type: Date, default: Date.now() }
}, { strict: false , versionKey : false, timestamps : false });
var Coin = mongoose.model('COIN', coinSchema);
module.exports = Coin;