var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var withdrawSchema = new Schema({
    coin: { type: Number , required: true},
    amount: { type: Number, required: true},
    status:{ type: String, enum : ['PENDING', 'SUCCESS', 'CANCEL'], default: 'PENDING' , index: true},
    name: { type: String, trim: true, required: true },
    mobileNo: { type: String, trim: true, required: true },
    deviceId: { type: String, trim: true, required: true },
    uniqueId: { type: String, trim: true, required: true },
    userId: {type : Schema.Types.ObjectId, require : true},
    isActive: {type: Boolean, default: true},
    updateDate: {type: Date },
    createDate : {type: Date }
}, { strict: false , versionKey : false, timestamps : false });
withdrawSchema.index({ mobileNo: 1, createDate: -1 }); 
var Withdraw = mongoose.model('WITHDRAW', withdrawSchema);
module.exports = Withdraw;