_common = module.exports = require('./common/encrypt')
const express = require("express")
const bodyParser = require("body-parser")
const cronJob = require('cron').CronJob
const app = express()
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const http = require('http')
const path = require('path');
var ApiMiddle = require('./v1/controller/init/detectdeviceController');
var secureServer = http.createServer(app);

// var corsOptions = {
//   origin: 'https://wewin.gq',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); //Public folder via image etc
app.use(compression())  // compress all responses
app.use(cors())
require('./connection/mongoConn') //Connection mongodb

app.use(helmet.xssFilter())
// app.use(helmet.noCache())
app.use(helmet.noSniff())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.dnsPrefetchControl())

// app.use((req, res, next) => {
//   var rRequestheader = req.headers['user-agent'];
//   if (rRequestheader.includes('UnityPlayer')) {
//     next();
//   } else {
//     res.status(500).send('Something broke!')
//   }
// });
// ApiMiddle.checkRequest
const version = require('./v1/1')
app.use('/v1', version)

const uirest = require('./v1/2')
app.use('/ui', uirest)

app.use(express.static(path.join(__dirname, 'dist/angular-material-admin'))); // Angular DIST output folder
app.get('*', (req, res) => {   
  res.sendFile(path.join(__dirname, 'dist/angular-material-admin/index.html'));  // Send all other requests to the Angular app
});

const Userdailyreport = require('./modal/userdailyreport');
const Applicationdailyreport = require('./modal/appwisedailyreport');
const Application = require('./modal/application');
var report = new cronJob('00 00 00 * * *', async () => {
  var createUserdailyreport = await new Userdailyreport({ _id: new Date() });
  await createUserdailyreport.save();
  var findApplication = await Application.find({}).select({ uan: 1, name: 1 }).lean();
  if (findApplication.length > 0) {
    for (let index = 0; index < findApplication.length; index++) {
      const appId = findApplication[index]._id;
      const uan = findApplication[index].uan;
      const name = findApplication[index].name;
      var createApplicationdailyreport = await new Applicationdailyreport({ _id: new Date(), appId: appId, uan: uan, name: name });
      await createApplicationdailyreport.save();
    }
  }
  // var bulk = Application.initializeUnorderedBulkOp();
  // bulk.find( { isActive: true } ).update( { $set: { todayassigntask: 0, todayassignclick: 0 } } );
  // bulk.execute();
  //update all document application
  await Application.update({ isActive: true }, { $set: { todayassigntask: 0, todayassignclick: 0 } }, { multi: true })
});
report.start();
const PORT = 5010
secureServer.listen(PORT, () => {
  console.log(`app is listening to PORT ${PORT}`)
})
