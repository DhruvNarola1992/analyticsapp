
var Coin = require('./../modal/coin');
var findCoin = async() => { 
    await Coin.find().limit(1);
}
findCoin().then(value => console.log(value));