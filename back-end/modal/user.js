var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    name: { type: String, trim: true , required: [true, 'User name required'] },
    mobileNo: { type: String, trim: true, unique: true, required: [true, 'Mobile number required.']},
    referCode: { type: String, trim: true, unique: true },
    reference: { type: String, trim: true },
    password: { type: String, trim: true , required: [true, 'Password required'] },
    deviceId: { type: String, trim: true, unique: true, required: [true, 'Device not fetch.'] },
    uniqueId: { type: String, trim: true, unique: true, required: [true, 'Device not fetch.'] , index : true},
    firebaseToken: { type: String, trim: true },
    coin: { type: Number, default: 0 }, // Current Coin 
    amount: { type: Number, default: 0 }, // Current amount
    totalcoin: { type: Number, default: 0 }, // Total Coin 
    totalamount: { type: Number, default: 0 }, // Total Amount
    isActive: { type: Boolean, default: true }, // Deactive user
    isFirstWithdraw: { type: Boolean, default: false }, // First user all data
    getreferCoin: { type: Number, default: 0 }, // Every Time Refer Coin --  zero karvanu
    
    filterTask : [{type: Schema.Types.ObjectId}],
    filterTaskDate : {type : Date}, // Daliy date check after 5 day update date 
    
    filterTaskDay : {type : Number}, // Every Day - 5 day Clear Task - Get on Coin Task Day
    convertCoin: {type : Number}, // Amount to coin
    convertAmount: {type : Number}, // Coin to amount
    minwithcoin: {type : Number}, // Minimum coin withdraw
    bannerCoin: {type : Number},     // banner or impression     //100
    clickCoin: {type : Number},      // click coin               //5000   
    referCoin: {type : Number},      // refer coin               //5000
    withdrawArray: {type: String},

    //impression wise coin, click wise coin, scratch wise coin, 
    totalimpression: { type: Number, default: 0 },
    totalclick: { type: Number, default: 0 },
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

    taskdata: [{
        task: String,
        currenttask: String,
        spin: Number,
        currentspin: Number,
        taskId: { type: Schema.Types.ObjectId },
        uan: String,
        appId: { type: Schema.Types.ObjectId }, 
        maxclick: {type : Number}, // 4
        maxtimeclick: {type: Number},
        mintimeclick: {type: Number}, 
        clicktimer: {type: Number},
        isClick: {type : Boolean , default : false},  // given task click max or not -- Is Click  
        isActive: {type : Boolean , default : true}  // given task complete or not
    }],

    scratchdata: [{
        selectcoin: String,
        scratchimage: String,
        totalCard: Number,
        currentCard: Number,
        taskId: { type: Schema.Types.ObjectId },
        uan: String,
        appId: { type: Schema.Types.ObjectId },
    }], 

    wallet: [{
        appId: { type: Schema.Types.ObjectId },
        uan: { type: String },
        icon: { type: String },
        coin: { type: Number },          //coin ma add karvana
        name: {type: String},
        totalcoin: { type: Number },     //total coin ma add karvana
        isActive: { type: Boolean },     //Active boolean all close
        
        totalimpression: { type: Number, default: 0 },
        totalclick: { type: Number, default: 0 },
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
        // coinreference: { type: Number, default: 0 },
        coinplaygame: { type: Number, default: 0 },

       
    }],

    //user activity
    activity : [{
        appId: { type: Schema.Types.ObjectId }, 
        type: {type : String},
        coin: {type : Number},
        flag: { type: Boolean },
        clienttime: { type: Date }
    }],

    //daily bonus
    dailybonus : [],
    dailybonusDate : {type: Date},

    taskDate: { type: Date },
    withdrawDate: { type: Date },
    updateDate: { type: Date, default: new Date() },
    createDate: { type: Date, default: new Date() }
}, { strict: false, versionKey: false, timestamps: false });
// userSchema.index({"createDate": 1, "taskdata._id": 1, "scratchdata._id" : 1, "wallet._id" : 1});
var User = mongoose.model('USER', userSchema);
module.exports = User;