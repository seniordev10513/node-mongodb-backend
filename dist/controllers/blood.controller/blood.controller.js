"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _check = require("express-validator/check");

var _shared = require("../shared.controller/shared.controller");

var _blood = _interopRequireDefault(require("../../models/blood.model/blood.model"));

var _user = _interopRequireDefault(require("../../models/user.model/user.model"));

var _tplace = _interopRequireDefault(require("../../models/places.model/tplace.model"));

var _ApiError = _interopRequireDefault(require("../../helpers/ApiError"));

var _i18n = _interopRequireDefault(require("i18n"));

var _notif = _interopRequireDefault(require("../notif.controller/notif.controller"));

var _user2 = require("../user.controller/user.controller");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var isBanded = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(id) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _user["default"].findOne({
              _id: id
            }, "banded");

          case 2:
            user = _context.sent;
            return _context.abrupt("return", user.banded);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function isBanded(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = {
  validateAddBlood: function validateAddBlood() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('age').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('name').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('From').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('groub').not().isEmpty().not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('contact').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  addBlood: function addBlood(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var validatedBody, query, band, blood;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              console.log(req);
              validatedBody = (0, _shared.checkValidations)(req);
              query = _objectSpread({}, validatedBody);
              _context2.next = 6;
              return isBanded(query.userId);

            case 6:
              band = _context2.sent;

              if (!band) {
                _context2.next = 11;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context2.next = 15;
              break;

            case 11:
              _context2.next = 13;
              return _blood["default"].create(query);

            case 13:
              blood = _context2.sent;
              res.status(200).send(blood);

            case 15:
              _context2.next = 20;
              break;

            case 17:
              _context2.prev = 17;
              _context2.t0 = _context2["catch"](0);
              next(_context2.t0);

            case 20:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 17]]);
    }))();
  },
  getBloods: function getBloods(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var query, _req$query, userId, city, mdr, groub, NuserId, relative, groubs, shohnat;

      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              query = {
                deleted: false,
                canceled: false
              };
              _req$query = req.query, userId = _req$query.userId, city = _req$query.city, mdr = _req$query.mdr, groub = _req$query.groub, NuserId = _req$query.NuserId, relative = _req$query.relative;

              if (userId) {
                query.userId = userId;
              }

              if (NuserId) {
                query.userId = {
                  $ne: NuserId
                };
              }

              if (city) {
                query["From.city"] = city;
              }

              if (mdr) {
                query["From.MDR"] = mdr;
              }

              if (groub) {
                groubs = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

                if (relative) {
                  if (!groub.includes("A")) {
                    groubs = groubs.filter(function (g) {
                      return !g.includes("A");
                    });
                  }

                  if (!groub.includes("B")) {
                    groubs = groubs.filter(function (g) {
                      return !g.includes("B");
                    });
                  }

                  if (!groub.includes("+")) {
                    groubs = groubs.filter(function (g) {
                      return !g.includes("+");
                    });
                  }

                  query.groub = {
                    $in: groubs
                  };
                } else {
                  query.groub = groub;
                }
              }

              _context3.next = 10;
              return _blood["default"].find(query);

            case 10:
              shohnat = _context3.sent;
              res.status(200).send(shohnat);
              _context3.next = 17;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](0);
              next(_context3.t0);

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 14]]);
    }))();
  },
  setCancelBlood: function setCancelBlood(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var query, blood;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              // let isAdmin = req.query.type == 'admin'
              query = {
                deleted: false,
                _id: req.query.id
              };
              _context4.next = 4;
              return _blood["default"].findOne(query);

            case 4:
              blood = _context4.sent;
              // if(isAdmin){
              //     await notificationController.pushNotification(user, 'SHOHNAT', query._id.toString(), `قام المسؤل برفض الشحنة`, 'عفش شخصي');
              // }else{
              //     notifyAdmin('SHOHNAT', query._id.toString(),`قام العميل ${user.name} بإلغاء الشحنة`, 'عفش شخصي',shohnat.trnsFrom.country == "YE"?shohnat.trnsFrom.MDR:shohnat.trnsFrom.city)
              // }
              blood.canceled = true;
              _context4.next = 8;
              return blood.save();

            case 8:
              res.status(200).send(blood);
              _context4.next = 15;
              break;

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](0);
              console.log(_context4.t0);
              next(_context4.t0);

            case 15:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 11]]);
    }))();
  }
};
exports["default"] = _default;