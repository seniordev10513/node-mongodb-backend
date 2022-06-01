"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _expressValidator = _interopRequireDefault(require("express-validator"));

var _helmet = _interopRequireDefault(require("helmet"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _url = _interopRequireDefault(require("url"));

var _compression = _interopRequireDefault(require("compression"));

var _routes = _interopRequireDefault(require("./routes"));

var _ApiError = _interopRequireDefault(require("./helpers/ApiError"));

var _fs = _interopRequireDefault(require("fs"));

var _config = _interopRequireDefault(require("./config"));

var _options;

var logger = require('morgan'); // console.log(process.env) // remove this after you've confirmed it working


var i18n = require("i18n");

i18n.configure({
  locales: ['ar', 'en'],
  directory: __dirname + '/locales',
  register: global,
  defaultLocale: 'ar'
});
_mongoose["default"].Promise = global.Promise; //forDJ-

var options = (_options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: false
}, (0, _defineProperty2["default"])(_options, "useNewUrlParser", true), (0, _defineProperty2["default"])(_options, "autoIndex", false), (0, _defineProperty2["default"])(_options, "ssl", true), (0, _defineProperty2["default"])(_options, "tlsAllowInvalidHostnames", true), (0, _defineProperty2["default"])(_options, "sslCA", _fs["default"].readFileSync(__dirname + '/ca.crt')), (0, _defineProperty2["default"])(_options, "user", 'doadmin'), (0, _defineProperty2["default"])(_options, "pass", '80USEJ6Y74jC35A1'), _options);

_mongoose["default"].connect(process.env.MONGO_TURL, options); //-endforDJ-
//-bfdj-
//mongoose.connect(config.mongoUrl, { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true });
//const autoIncrement = autoIncrementSQ(mongoose.connection);


_mongoose["default"].connection.on('connected', function () {
  console.log('\x1b[32m%s\x1b[0m', '[DB] Connected...');
});

_mongoose["default"].connection.on('error', function (err) {
  return console.log('\x1b[31m%s\x1b[0m', '[DB] Error : ' + err);
});

_mongoose["default"].connection.on('disconnected', function () {
  return console.log('\x1b[31m%s\x1b[0m', '[DB] Disconnected...');
}); //
// mongoose.Promise = global.Promise;
//
// //forDJ-
// const options = {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     autoIndex: false,
//     useNewUrlParser: true,
//     autoIndex: false,
//     ssl: true,
//     tlsAllowInvalidHostnames: true,
//     sslCA: fs.readFileSync(__dirname + '/ca.crt'),
//     user: 'doadmin',
//     pass: '80USEJ6Y74jC35A1'
// }
//
//
// mongoose.connect(process.env.MONGO_TURL, options )
// //-endforDJ-
// //-bfdj-
// //mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true });
//
// //const autoIncrement = autoIncrementSQ(mongoose.connection);
//
// mongoose.connection.on('connected', () =>{
//
//     console.log('\x1b[32m%s\x1b[0m', '[DB] Connected...');
// } );
// mongoose.connection.on('error', err => console.log('\x1b[31m%s\x1b[0m', '[DB] Error : ' + err));
// mongoose.connection.on('disconnected', () => console.log('\x1b[31m%s\x1b[0m', '[DB] Disconnected...'));


var app = (0, _express["default"])();
app.use((0, _compression["default"])());
app.use((0, _cors["default"])());
app.use((0, _helmet["default"])());
app.disable('x-powered-by');
app.use(logger('dev'));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
app.use('/uploads', _express["default"]["static"](_path["default"].join(__dirname, '..', 'uploads')));
app.use('/otherImage.png', _express["default"]["static"](_path["default"].join(__dirname, '..', './other.png')));
app.use(function (req, res, next) {
  i18n.setLocale(req.headers['accept-language'] || 'ar');
  return next();
}); // Ensure Content Type

app.use('/', function (req, res, next) {
  // check content type
  var contype = req.headers['content-type'];
  if (contype && !(contype.includes('application/json') || contype.includes('multipart/form-data'))) return res.status(415).send({
    error: 'Unsupported Media Type (' + contype + ')'
  }); // set current host url
  // config.appUrl = url.format({
  //     protocol: req.protocol,
  //     host: req.get('host')
  // });

  next();
});
app.use(_bodyParser["default"].json({
  limit: '1000mb'
}));
app.use(_bodyParser["default"].urlencoded({
  limit: '1000mb',
  extended: true,
  parameterLimit: 50000
})); //app.use(expressValidator());
//Routes
// app.use((req, res, next)=>{
//     console.log(req.body,"RES");
//     next()
// })

app.use('/', _routes["default"]);
app.use('/.well-known/assetlinks.json', _express["default"]["static"]('./assetlinks.json')); //Not Found Handler
// app.use((req, res, next) => {
//     next(new ApiError(404, 'Not Found...'));
// });
//ERROR Handler

app.use(function (err, req, res, next) {
  if (err instanceof _mongoose["default"].CastError) err = new _ApiError["default"].NotFound(err) || new _ApiError["default"].NotFound(err.model.modelName);
  console.log(err);
  res.status(err.status || 500).json({
    errors: err.message
  });
});
var _default = app;
exports["default"] = _default;