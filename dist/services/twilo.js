"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.twilioVerify = exports.twilioSend = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _token = require("../utils/token");

var _ApiError = _interopRequireDefault(require("../helpers/ApiError"));

var _i18n = _interopRequireDefault(require("i18n"));

require("dotenv/config");

// import reportController from '../controllers/report.controller/report.controller'
// import config from '../config';
// import ConfirmationCode from '../models/confirmationsCodes.model/confirmationscodes.model';
// remove this after you've confirmed it working
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var verifyServiceId = process.env.TWILIO_SERVICE_SID;

var twilio = require('twilio');

var client = new twilio(accountSid, authToken);

var twilioSend = function twilioSend(number) {
  var ar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ar';
  var res = arguments.length > 2 ? arguments[2] : undefined;
  var next = arguments.length > 3 ? arguments[3] : undefined;
  console.log("TWL", number);

  try {
    client.verify.services(verifyServiceId).verifications.create({
      to: number,
      channel: 'sms',
      locale: ar
    }).then(function (verification) {
      res.status(200).send("send code successfuly");
      console.log('Twilio verification Sent');
    })["catch"](function (error) {
      console.log("TWIL", error);
      next(new _ApiError["default"](400, 'فشل إرسال الكود'));
    });
  } catch (error) {
    next(new _ApiError["default"](400, 'فشل إرسال الكود'));
    console.log('error in twilio ==> ', error);
  }
};

exports.twilioSend = twilioSend;

var twilioVerify = function twilioVerify(phone, code) {
  var user = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var res = arguments.length > 3 ? arguments[3] : undefined;
  var next = arguments.length > 4 ? arguments[4] : undefined;
  var Data = arguments.length > 5 ? arguments[5] : undefined;

  try {
    client.verify.services(verifyServiceId).verificationChecks.create({
      to: phone,
      code: code
    }).then( /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(verification_check) {
        var User;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log("tdone!");

                if (!(verification_check.valid == true)) {
                  _context.next = 12;
                  break;
                }

                if (!Object.keys(user).length) {
                  _context.next = 6;
                  break;
                }

                //     // user.phoneVerified = true;
                //     // await user.save();
                //     // console.log('llllllllllllllllllllll');
                //     // res.status(200).send({
                //     //     user: user,
                //     //     token: generateToken(user.id)
                //     // });
                res.status(200).send(user);
                _context.next = 10;
                break;

              case 6:
                _context.next = 8;
                return Data.Model.create(Data.query);

              case 8:
                User = _context.sent;
                res.status(200).send(User);

              case 10:
                _context.next = 13;
                break;

              case 12:
                next(new _ApiError["default"](400, _i18n["default"].__('invalid_code')));

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }())["catch"](function (error) {
      console.log(phone);
      console.log(error);
      next(new _ApiError["default"](400, _i18n["default"].__('expired_code')));
    });
  } catch (error) {
    next(error);
  }
};

exports.twilioVerify = twilioVerify;