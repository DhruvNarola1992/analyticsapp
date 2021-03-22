var mongoose = require("mongoose");
// var Coin = require('./../modal/coin');
// let data = 'a';

mongoose.connect("mongodb://localhost:27017/testdb", {
  useNewUrlParser: "true",
  useFindAndModify: false,
  useUnifiedTopology: true
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})

// module.exports.totalTask = 2;

// module.exports = {
//   MAIN : function data() {
//     return Coin
//       .find({}).limit(1)
//       .then(mix => {
//         return mix[0];
//       });
//   }
// }
// var data = async() => {
//   v1 = await Coin.find({}); 
//   return v1;
// };
// data().then(data => {
//   console.log(data)
// })

// data = Coin.find({}, {amount : 1 , coin : 1, _id : 0}).exec(function (err, user){    
//   // User result only available inside of this function!
//   // console.log(user) // => yields your user results
// })

// User result not available out here!
// console.log(data)
// var coin = async() => {
//   let v1 = await Coin.find({}, {amount : 1 , coin : 1, _id : 0});
//   // return v1.then(data => console.log(data))
//   return v1[0];
// }

// coin().then(value => 
//   data = value.coin
// );

// module.exports.MAIN = data;

// var data = Promise.all(findCoin().then(value => Promise());

// console.log(data())

// module.exports.MAIN
// var Coin = require('./../modal/coin');
// var findCoin = async() => { 
//     await Coin.find().limit(1);
// }
// findCoin().then(value => console.log(value));

// module.exports = mongoose;