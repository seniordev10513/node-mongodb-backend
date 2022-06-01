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

var _onlineMsfr = _interopRequireDefault(require("../../models/onlineMsfr.model/onlineMsfr.model"));

var _orders = _interopRequireDefault(require("../../models/orders.model/orders.model"));

var _onlineCar = _interopRequireDefault(require("../../models/onlineCar.model/onlineCar.model"));

var _tplace = _interopRequireDefault(require("../../models/places.model/tplace.model"));

var _user = _interopRequireDefault(require("../../models/user.model/user.model"));

var _ApiError = _interopRequireDefault(require("../../helpers/ApiError"));

var _i18n = _interopRequireDefault(require("i18n"));

var _config = _interopRequireDefault(require("../../config"));

var _notif = _interopRequireDefault(require("../notif.controller/notif.controller"));

var _user2 = require("../user.controller/user.controller");

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

_nodeSchedule["default"].scheduleJob("*/10 * * * *", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var date, query, trips;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("MSFR_SCHEDULE");
          date = new Date();
          query = {
            deleted: false,
            canceled: false,
            ToDate: {
              $lt: date
            },
            $or: [{
              AddedTo: {
                $exists: false
              }
            }, {
              AddedTo: -1
            }]
          };
          _context.next = 5;
          return _onlineMsfr["default"].find(query, "userId");

        case 5:
          trips = _context.sent;
          _context.next = 8;
          return _user["default"].updateMany({
            _id: {
              $in: trips.map(function (it) {
                return it.userId;
              })
            }
          }, {
            haveTrip: false
          });

        case 8:
          _context.next = 10;
          return _onlineMsfr["default"].updateMany(query, {
            finished: true
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));

var isBanded = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
    var user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _user["default"].findOne({
              _id: id
            }, "banded");

          case 2:
            user = _context2.sent;
            return _context2.abrupt("return", user.banded);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function isBanded(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var findMsfrsAction = function findMsfrsAction(Q) {
  var toT = Q.toT,
      fromT = Q.fromT,
      fromC = Q.fromC,
      toC = Q.toC;
  console.log(Q);
  var query = {};

  if (toT) {
    var to = new Date(toT);
    to.setHours(23, 59, 59, 999);
    query.FromDate = {};
    query.FromDate.$lt = new Date(to);
  }

  if (fromT) {
    var from = new Date(fromT);
    from.setHours(0, 0, 0, 0);
    query.ToDate = {};
    query.ToDate.$gt = new Date(from);
  }

  if (toC) {
    query["To.city"] = toC;
  }

  if (fromC) {
    query["From.city"] = fromC;
  }

  return query;
};

var _default = {
  validateAddonlineMsfr: function validateAddonlineMsfr() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('numPers').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('withTrans').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('transFrom').optional().not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('FromDate').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('ToDate').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('From').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('To').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  addonlineMsfr: function addonlineMsfr(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var validatedBody, query, band, oMsfr, user, ID, mdr, mdn, Ruser;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = _objectSpread({}, validatedBody);
              _context3.next = 5;
              return isBanded(query.userId);

            case 5:
              band = _context3.sent;

              if (!band) {
                _context3.next = 10;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context3.next = 40;
              break;

            case 10:
              _context3.next = 12;
              return _onlineMsfr["default"].create(query);

            case 12:
              oMsfr = _context3.sent;
              _context3.next = 15;
              return _user["default"].findOne({
                _id: query.userId
              }).populate({
                path: "TripId",
                model: "onlineMsfr"
              });

            case 15:
              user = _context3.sent;
              user.haveTrip = true;
              user.isDriver = false;
              user.TripId = oMsfr.id;
              ID = oMsfr.id.toString().padStart(6, "0");

              if (!(query.To.country == "YE")) {
                _context3.next = 27;
                break;
              }

              _context3.next = 23;
              return _tplace["default"].findOne({
                _id: query.To.MP
              });

            case 23:
              mdr = _context3.sent;
              // console.log(mdr);
              ID = mdr.placeChar + '-' + ID;
              _context3.next = 31;
              break;

            case 27:
              _context3.next = 29;
              return _tplace["default"].findOne({
                _id: query.To.city
              });

            case 29:
              mdn = _context3.sent;
              ID = mdn.placeChar + '-' + ID;

            case 31:
              oMsfr.ID = ID;
              _context3.next = 34;
              return user.save();

            case 34:
              _context3.next = 36;
              return oMsfr.save();

            case 36:
              _context3.next = 38;
              return _user["default"].findOne({
                _id: query.userId
              }).populate({
                path: "TripId",
                model: "onlineMsfr"
              });

            case 38:
              Ruser = _context3.sent;
              res.status(200).send(Ruser);

            case 40:
              _context3.next = 45;
              break;

            case 42:
              _context3.prev = 42;
              _context3.t0 = _context3["catch"](0);
              next(_context3.t0);

            case 45:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 42]]);
    }))();
  },
  getUseronlineMsfr: function getUseronlineMsfr(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var query, userId, oMsfr;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              query = {
                deleted: false,
                canceled: false
              };
              userId = req.query.userId;

              if (userId) {
                query.userId = userId;
              }

              _context4.next = 6;
              return _onlineMsfr["default"].findOne(query);

            case 6:
              oMsfr = _context4.sent;
              res.status(200).send(oMsfr);
              _context4.next = 13;
              break;

            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](0);
              next(_context4.t0);

            case 13:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 10]]);
    }))();
  },
  getAllonlineMsfr: function getAllonlineMsfr(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var query, dateQ, actionQ, oMsfr;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              query = {
                deleted: false,
                canceled: false,
                ordered: false,
                finished: false
              }; // let {userId} = req.query
              // if(userId) {
              //     query.userId = userId
              // }

              dateQ = (0, _user2.dateQuery)(req.query.from, req.query.to);
              actionQ = findMsfrsAction(req.query);
              _context5.next = 6;
              return _onlineMsfr["default"].find(_objectSpread(_objectSpread(_objectSpread({}, query), dateQ), actionQ)).populate("userId");

            case 6:
              oMsfr = _context5.sent;
              res.status(200).send(oMsfr);
              _context5.next = 13;
              break;

            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5["catch"](0);
              next(_context5.t0);

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 10]]);
    }))();
  },
  getTransonlineMsfr: function getTransonlineMsfr(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var query, oMsfr;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              query = {
                deleted: false,
                canceled: false,
                AddedTo: {
                  $exists: true,
                  $ne: -1
                },
                withTrans: true
              };
              _context6.next = 4;
              return _onlineMsfr["default"].find(query).populate("userId").populate("AddedTo");

            case 4:
              oMsfr = _context6.sent;
              res.status(200).send(oMsfr);
              _context6.next = 12;
              break;

            case 8:
              _context6.prev = 8;
              _context6.t0 = _context6["catch"](0);
              console.log(_context6.t0);
              next(_context6.t0);

            case 12:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[0, 8]]);
    }))();
  },
  cancelonlineMsfr: function cancelonlineMsfr(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var query, userId, band, oMsfr, driver, oCar, notiOrders, user;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              query = {
                deleted: false,
                canceled: false
              };
              userId = req.query.userId;
              _context8.next = 5;
              return isBanded(userId);

            case 5:
              band = _context8.sent;

              if (!band) {
                _context8.next = 10;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context8.next = 47;
              break;

            case 10:
              if (userId) {
                query.userId = userId;
              }

              _context8.next = 13;
              return _onlineMsfr["default"].findOne(query).populate("userId");

            case 13:
              oMsfr = _context8.sent;

              if (oMsfr) {
                _context8.next = 16;
                break;
              }

              return _context8.abrupt("return", next(new _ApiError["default"](400, 'تم ألغاء الرحلة  مسبقاً')));

            case 16:
              oMsfr.canceled = true;
              _context8.next = 19;
              return _user["default"].findOne({
                _id: query.userId
              }).populate({
                path: "TripId",
                model: "onlineMsfr"
              });

            case 19:
              driver = _context8.sent;

              if (!(oMsfr.AddedTo > -1)) {
                _context8.next = 29;
                break;
              }

              console.log(oMsfr.AddedTo);
              _context8.next = 24;
              return _onlineCar["default"].findOne({
                deleted: false,
                canceled: false,
                _id: oMsfr.AddedTo
              }).populate("userId");

            case 24:
              oCar = _context8.sent;
              oCar.isCompleted = false;
              oCar.added -= oMsfr.numPers;
              _context8.next = 29;
              return oCar.save();

            case 29:
              console.log(oMsfr.userId, "___ID");
              _context8.next = 32;
              return _orders["default"].find({
                stat: {
                  $in: ["WAITTING", "ACCEPTED"]
                },
                deleted: false,
                userId: oMsfr.userId._id
              });

            case 32:
              notiOrders = _context8.sent;
              notiOrders.map( /*#__PURE__*/function () {
                var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(ord) {
                  var msf;
                  return _regenerator["default"].wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          _context7.next = 2;
                          return _user["default"].findOne({
                            _id: ord.carId
                          });

                        case 2:
                          msf = _context7.sent;

                          if (!(ord.stat == "ACCEPTED")) {
                            _context7.next = 8;
                            break;
                          }

                          _context7.next = 6;
                          return _notif["default"].pushNotification(msf, 'TRIP', '', "\u0642\u0627\u0645 \u0627\u0644\u0631\u0627\u0643\u0628 ".concat(driver.name, " \u0628\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0631\u062D\u0644\u0629"), 'إلغاء الرحلة');

                        case 6:
                          _context7.next = 16;
                          break;

                        case 8:
                          if (!(ord.orderOf == "DRIVER")) {
                            _context7.next = 13;
                            break;
                          }

                          _context7.next = 11;
                          return _notif["default"].pushNotification(msf, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0631\u0627\u0643\u0628 ".concat(driver.name, " \u0628\u0639\u062F\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0630\u064A \u0627\u0631\u0633\u0644\u062A\u0647 \u0627\u0644\u064A\u0647"), 'رفض طلب حجز');

                        case 11:
                          _context7.next = 16;
                          break;

                        case 13:
                          if (!(ord.orderOf == "CLIENT")) {
                            _context7.next = 16;
                            break;
                          }

                          _context7.next = 16;
                          return _notif["default"].pushNotification(msf, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0631\u0627\u0643\u0628 ".concat(driver.name, " \u0628\u0625\u0644\u063A\u0627\u0621 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0630\u064A \u0627\u0631\u0633\u0644\u0647 \u0627\u0644\u064A\u0643"), 'إلغاء طلب حجز');

                        case 16:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));

                return function (_x2) {
                  return _ref3.apply(this, arguments);
                };
              }());
              _context8.next = 36;
              return _orders["default"].updateMany({
                stat: {
                  $in: ["WAITTING", "ACCEPTED"]
                },
                deleted: false,
                userId: oMsfr.userId._id,
                orderOf: "CLIENT"
              }, {
                stat: "CANCELED"
              });

            case 36:
              _context8.next = 38;
              return _orders["default"].updateMany({
                stat: {
                  $in: ["WAITTING", "ACCEPTED"]
                },
                deleted: false,
                userId: oMsfr.userId._id,
                orderOf: "DRIVER"
              }, {
                stat: "REFUSED"
              });

            case 38:
              driver.haveTrip = false;
              _context8.next = 41;
              return driver.save();

            case 41:
              _context8.next = 43;
              return oMsfr.save();

            case 43:
              _context8.next = 45;
              return _user["default"].findOne({
                _id: query.userId
              });

            case 45:
              user = _context8.sent;
              res.status(200).send(user);

            case 47:
              _context8.next = 52;
              break;

            case 49:
              _context8.prev = 49;
              _context8.t0 = _context8["catch"](0);
              next(_context8.t0);

            case 52:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[0, 49]]);
    }))();
  },
  validateupDateonlineCardate: function validateupDateonlineCardate() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('date').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  upDateonlineCardate: function upDateonlineCardate(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var validatedBody, query, userId, oCar;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = {
                deleted: false,
                canceled: false
              };
              userId = validatedBody.userId;

              if (userId) {
                query.userId = userId;
              }

              _context9.next = 7;
              return _onlineCar["default"].findOne(query);

            case 7:
              oCar = _context9.sent;
              oCar.date = validatedBody.date;
              oCar.save();
              res.status(200).send(oCar);
              _context9.next = 16;
              break;

            case 13:
              _context9.prev = 13;
              _context9.t0 = _context9["catch"](0);
              next(_context9.t0);

            case 16:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[0, 13]]);
    }))();
  }
};
exports["default"] = _default;