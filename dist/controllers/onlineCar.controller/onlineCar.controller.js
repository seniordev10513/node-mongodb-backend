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

var _onlineCar = _interopRequireDefault(require("../../models/onlineCar.model/onlineCar.model"));

var _onlineMsfr = _interopRequireDefault(require("../../models/onlineMsfr.model/onlineMsfr.model"));

var _tplace = _interopRequireDefault(require("../../models/places.model/tplace.model"));

var _orders = _interopRequireDefault(require("../../models/orders.model/orders.model"));

var _user = _interopRequireDefault(require("../../models/user.model/user.model"));

var _ApiError = _interopRequireDefault(require("../../helpers/ApiError"));

var _i18n = _interopRequireDefault(require("i18n"));

var _config = _interopRequireDefault(require("../../config"));

var _notif = _interopRequireDefault(require("../notif.controller/notif.controller"));

var _user2 = require("../user.controller/user.controller");

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// "0 3 * * *"
_nodeSchedule["default"].scheduleJob("*/10 * * * *", /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var date, queryC, trips, Cusers, queryM, msfrs, Musers;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("CAR_SCHEDULE");
          date = new Date();
          queryC = {
            deleted: false,
            canceled: false,
            date: {
              $lt: date
            }
          };
          _context.next = 5;
          return _onlineCar["default"].find(queryC, "userId");

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
          Cusers = _context.sent;
          queryM = {
            canceled: false,
            deleted: false,
            finished: false,
            AddedTo: {
              $in: trips.map(function (it) {
                return it._id;
              })
            }
          };
          _context.next = 12;
          return _onlineMsfr["default"].find(queryM, "userId");

        case 12:
          msfrs = _context.sent;
          _context.next = 15;
          return _user["default"].updateMany({
            _id: {
              $in: msfrs.map(function (it) {
                return it.userId;
              })
            }
          }, {
            haveTrip: false
          });

        case 15:
          Musers = _context.sent;
          _context.next = 18;
          return _onlineCar["default"].updateMany(queryC, {
            finished: true
          });

        case 18:
          _context.next = 20;
          return _onlineCar["default"].updateMany(queryM, {
            finished: true
          });

        case 20:
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

var findCarAction = function findCarAction(Q) {
  var toT = Q.toT,
      fromT = Q.fromT,
      fromC = Q.fromC,
      toC = Q.toC;
  var query = {};

  if (toT) {
    var to = new Date(toT);
    to.setHours(23, 59, 59, 999);
    query.date = {};
    query.date.$lt = new Date(to);
  }

  if (fromT) {
    var from = new Date(fromT);
    from.setHours(0, 0, 0, 0);
    query.date = {};
    query.date.$gt = new Date(from);
  }

  if (fromC) {
    query["From.city"] = fromC;
  }

  if (toC) {
    query["To.city"] = toC;
  }

  return query;
};

var _default = {
  validateAddonlineCar: function validateAddonlineCar() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('max').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('lefted').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('date').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('From').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('To').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('type').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('PassPrice').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  addonlineCar: function addonlineCar(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var validatedBody, query, band, oCar, ID, mdr, mdn, driver, user;
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
              return _onlineCar["default"].create(query);

            case 12:
              oCar = _context3.sent;
              ID = oCar.id.toString().padStart(6, "0");

              if (!(query.To.country == "YE")) {
                _context3.next = 21;
                break;
              }

              _context3.next = 17;
              return _tplace["default"].findOne({
                _id: query.To.MP
              });

            case 17:
              mdr = _context3.sent;
              ID = mdr.placeChar + '-' + ID;
              _context3.next = 25;
              break;

            case 21:
              _context3.next = 23;
              return _tplace["default"].findOne({
                _id: query.To.city
              });

            case 23:
              mdn = _context3.sent;
              ID = mdn.placeChar + '-' + ID;

            case 25:
              oCar.ID = ID;
              _context3.next = 28;
              return oCar.save();

            case 28:
              _context3.next = 30;
              return _user["default"].findOne({
                _id: query.userId
              });

            case 30:
              driver = _context3.sent;
              driver.haveTrip = true;
              driver.isDriver = true;
              driver.TripId = oCar.id;
              _context3.next = 36;
              return driver.save();

            case 36:
              _context3.next = 38;
              return _user["default"].findOne({
                _id: query.userId
              }).populate({
                path: "TripId",
                model: "onlineCar"
              });

            case 38:
              user = _context3.sent;
              res.status(200).send(user);

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
  getUseronlineCar: function getUseronlineCar(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var query, userId, dateQ, oCar;
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

              dateQ = (0, _user2.dateQuery)(req.query.from, req.query.to);
              _context4.next = 7;
              return _onlineCar["default"].findOne(_objectSpread(_objectSpread({}, query), dateQ));

            case 7:
              oCar = _context4.sent;
              res.status(200).send(oCar);
              _context4.next = 14;
              break;

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](0);
              next(_context4.t0);

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 11]]);
    }))();
  },
  getAllonlineCar: function getAllonlineCar(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var query, type, dateQ, actionQ, oCar;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              query = {
                $or: [{
                  deleted: false,
                  canceled: false,
                  isCompleted: {
                    $exists: true,
                    $in: [false]
                  }
                }, {
                  deleted: false,
                  canceled: false,
                  isCompleted: {
                    $exists: false
                  }
                }]
              }; // let {userId} = req.query
              // if(userId) {
              //     query.userId = userId
              // }

              type = req.query.type;

              if (type) {
                query.type = type;
              }

              dateQ = (0, _user2.dateQuery)(req.query.from, req.query.to);
              actionQ = findCarAction(req.query);
              _context5.next = 8;
              return _onlineCar["default"].find(_objectSpread(_objectSpread(_objectSpread({}, query), dateQ), actionQ)).populate("userId");

            case 8:
              oCar = _context5.sent;
              res.status(200).send(oCar);
              _context5.next = 16;
              break;

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5["catch"](0);
              console.log(_context5.t0);
              next(_context5.t0);

            case 16:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 12]]);
    }))();
  },
  cancelonlineCar: function cancelonlineCar(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var query, userId, band, driver, oCar, notiOrders;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              query = {
                deleted: false,
                canceled: false
              };
              userId = req.query.userId;

              if (userId) {
                query.userId = userId;
              }

              _context7.next = 6;
              return isBanded(req.query.userId);

            case 6:
              band = _context7.sent;

              if (!band) {
                _context7.next = 11;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context7.next = 36;
              break;

            case 11:
              _context7.next = 13;
              return _user["default"].findOne({
                _id: query.userId
              }).populate({
                path: "TripId",
                model: "onlineCar"
              });

            case 13:
              driver = _context7.sent;
              driver.haveTrip = false;
              _context7.next = 17;
              return _onlineCar["default"].findOne(query).populate("userId");

            case 17:
              oCar = _context7.sent;

              if (oCar) {
                _context7.next = 20;
                break;
              }

              return _context7.abrupt("return", next(new _ApiError["default"](400, 'تم ألغاء الطلب  مسبقاً')));

            case 20:
              oCar.canceled = true;
              _context7.next = 23;
              return _onlineMsfr["default"].updateMany({
                canceled: false,
                deleted: false,
                AddedTo: oCar.id
              }, {
                AddedTo: -1,
                ordered: false
              });

            case 23:
              _context7.next = 25;
              return _orders["default"].find({
                stat: {
                  $in: ["WAITTING", "ACCEPTED"]
                },
                deleted: false,
                carId: oCar.userId._id
              });

            case 25:
              notiOrders = _context7.sent;
              notiOrders.map( /*#__PURE__*/function () {
                var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(ord) {
                  var msf;
                  return _regenerator["default"].wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          _context6.next = 2;
                          return _user["default"].findOne({
                            _id: ord.userId
                          });

                        case 2:
                          msf = _context6.sent;

                          if (!(ord.stat == "ACCEPTED")) {
                            _context6.next = 8;
                            break;
                          }

                          _context6.next = 6;
                          return _notif["default"].pushNotification(msf, 'TRIP', '', "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(driver.name, " \u0628\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0631\u062D\u0644\u0629 \u0627\u0644\u062A\u064A \u062D\u062C\u0632\u062A \u0641\u064A\u0647\u0627"), 'إلغاء الرحلة');

                        case 6:
                          _context6.next = 16;
                          break;

                        case 8:
                          if (!(ord.orderOf == "DRIVER")) {
                            _context6.next = 13;
                            break;
                          }

                          _context6.next = 11;
                          return _notif["default"].pushNotification(msf, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(driver.name, " \u0628\u0625\u0644\u063A\u0627\u0621 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0645\u0631\u0633\u0644 \u0645\u0646\u0643 \u0627\u0644\u064A\u0647"), 'إلغاء طلب الحجز');

                        case 11:
                          _context6.next = 16;
                          break;

                        case 13:
                          if (!(ord.orderOf == "CLIENT")) {
                            _context6.next = 16;
                            break;
                          }

                          _context6.next = 16;
                          return _notif["default"].pushNotification(msf, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(driver.name, " \u0628\u0639\u062F\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0645\u0631\u0633\u0644 \u0645\u0646\u0643 \u0627\u0644\u064A\u0647"), 'رفض طلب الحجز');

                        case 16:
                        case "end":
                          return _context6.stop();
                      }
                    }
                  }, _callee6);
                }));

                return function (_x2) {
                  return _ref3.apply(this, arguments);
                };
              }());
              _context7.next = 29;
              return _orders["default"].updateMany({
                stat: {
                  $in: ["WAITTING", "ACCEPTED"]
                },
                deleted: false,
                carId: oCar.userId._id,
                orderOf: "DRIVER"
              }, {
                stat: "CANCELED"
              });

            case 29:
              _context7.next = 31;
              return _orders["default"].updateMany({
                stat: {
                  $in: ["WAITTING", "ACCEPTED"]
                },
                deleted: false,
                carId: oCar.userId._id,
                orderOf: "CLIENT"
              }, {
                stat: "REFUSED"
              });

            case 31:
              _context7.next = 33;
              return driver.save();

            case 33:
              _context7.next = 35;
              return oCar.save();

            case 35:
              res.status(200).send(driver);

            case 36:
              _context7.next = 41;
              break;

            case 38:
              _context7.prev = 38;
              _context7.t0 = _context7["catch"](0);
              next(_context7.t0);

            case 41:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[0, 38]]);
    }))();
  },
  closeonlineCar: function closeonlineCar(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var query, userId, band, driver, oCar, notiOrders, tDriver;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              query = {
                deleted: false,
                canceled: false
              };
              userId = req.query.userId;

              if (userId) {
                query.userId = userId;
              }

              _context9.next = 6;
              return isBanded(req.query.userId);

            case 6:
              band = _context9.sent;

              if (!band) {
                _context9.next = 11;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context9.next = 37;
              break;

            case 11:
              _context9.next = 13;
              return _user["default"].findOne({
                _id: query.userId
              });

            case 13:
              driver = _context9.sent;
              _context9.next = 16;
              return _onlineCar["default"].findOne(query).populate("userId");

            case 16:
              oCar = _context9.sent;
              oCar.isCompleted = true;
              oCar.added = oCar.lefted;

              if (oCar) {
                _context9.next = 21;
                break;
              }

              return _context9.abrupt("return", next(new _ApiError["default"](400, 'تم ألغاء الطلب  مسبقاً')));

            case 21:
              _context9.next = 23;
              return _orders["default"].find({
                stat: {
                  $in: ["WAITTING"]
                },
                deleted: false,
                carId: oCar.userId._id
              });

            case 23:
              notiOrders = _context9.sent;
              notiOrders.map( /*#__PURE__*/function () {
                var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(ord) {
                  var msf;
                  return _regenerator["default"].wrap(function _callee8$(_context8) {
                    while (1) {
                      switch (_context8.prev = _context8.next) {
                        case 0:
                          _context8.next = 2;
                          return _user["default"].findOne({
                            _id: ord.userId
                          });

                        case 2:
                          msf = _context8.sent;

                          if (!(ord.orderOf == "DRIVER")) {
                            _context8.next = 8;
                            break;
                          }

                          _context8.next = 6;
                          return _notif["default"].pushNotification(msf, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(driver.name, " \u0628\u0625\u0644\u063A\u0627\u0621 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0645\u0631\u0633\u0644 \u0645\u0646\u0643 \u0627\u0644\u064A\u0647"), 'إلغاء طلب الحجز');

                        case 6:
                          _context8.next = 11;
                          break;

                        case 8:
                          if (!(ord.orderOf == "CLIENT")) {
                            _context8.next = 11;
                            break;
                          }

                          _context8.next = 11;
                          return _notif["default"].pushNotification(msf, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(driver.name, " \u0628\u0639\u062F\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0645\u0631\u0633\u0644 \u0645\u0646\u0643 \u0627\u0644\u064A\u0647"), 'رفض طلب الحجز');

                        case 11:
                        case "end":
                          return _context8.stop();
                      }
                    }
                  }, _callee8);
                }));

                return function (_x3) {
                  return _ref4.apply(this, arguments);
                };
              }());
              _context9.next = 27;
              return _orders["default"].updateMany({
                stat: {
                  $in: ["WAITTING"]
                },
                deleted: false,
                carId: oCar.userId._id,
                orderOf: "DRIVER"
              }, {
                stat: "CANCELED"
              });

            case 27:
              _context9.next = 29;
              return _orders["default"].updateMany({
                stat: {
                  $in: ["WAITTING"]
                },
                deleted: false,
                carId: oCar.userId._id,
                orderOf: "CLIENT"
              }, {
                stat: "REFUSED"
              });

            case 29:
              _context9.next = 31;
              return driver.save();

            case 31:
              _context9.next = 33;
              return oCar.save();

            case 33:
              _context9.next = 35;
              return _user["default"].findOne({
                _id: query.userId
              }).populate({
                path: "TripId",
                model: "onlineCar"
              });

            case 35:
              tDriver = _context9.sent;
              res.status(200).send(tDriver);

            case 37:
              _context9.next = 42;
              break;

            case 39:
              _context9.prev = 39;
              _context9.t0 = _context9["catch"](0);
              next(_context9.t0);

            case 42:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[0, 39]]);
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
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      var validatedBody, query, userId, band, oCar, driver, showDate, msfrs;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = {
                deleted: false,
                canceled: false
              };
              userId = validatedBody.userId;
              _context11.next = 6;
              return isBanded(userId);

            case 6:
              band = _context11.sent;

              if (!band) {
                _context11.next = 11;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context11.next = 25;
              break;

            case 11:
              if (userId) {
                query.userId = userId;
              }

              _context11.next = 14;
              return _onlineCar["default"].findOne(query);

            case 14:
              oCar = _context11.sent;
              _context11.next = 17;
              return _user["default"].findOne({
                _id: query.userId
              });

            case 17:
              driver = _context11.sent;

              showDate = function showDate(date) {
                var ndate = new Date(date);
                var y = ndate.getFullYear();
                var m = ndate.getMonth() + 1;
                var d = ndate.getDate();
                return "".concat(y, "/").concat(m, "/").concat(d);
              };

              msfrs = _onlineMsfr["default"].find({
                canceled: false,
                deleted: false,
                AddedTo: oCar.id
              }).populate("userId");
              msfrs.map( /*#__PURE__*/function () {
                var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(msf) {
                  return _regenerator["default"].wrap(function _callee10$(_context10) {
                    while (1) {
                      switch (_context10.prev = _context10.next) {
                        case 0:
                          _context10.next = 2;
                          return _notif["default"].pushNotification(msf.userId, 'TRIP', '', "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(driver.name, " \u0628\u062A\u0639\u062F\u064A\u0644 \u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0631\u062D\u0644\u0629 \u0627\u0644\u062A\u064A \u062D\u062C\u0632\u062A \u0641\u064A\u0647\u0627 \u0625\u0627\u0644\u0649 ").concat(showDate(validatedBody.date)), 'تعديل تاريخ الرحلة');

                        case 2:
                        case "end":
                          return _context10.stop();
                      }
                    }
                  }, _callee10);
                }));

                return function (_x4) {
                  return _ref5.apply(this, arguments);
                };
              }());
              oCar.date = validatedBody.date;
              _context11.next = 24;
              return oCar.save();

            case 24:
              res.status(200).send(oCar);

            case 25:
              _context11.next = 30;
              break;

            case 27:
              _context11.prev = 27;
              _context11.t0 = _context11["catch"](0);
              next(_context11.t0);

            case 30:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, null, [[0, 27]]);
    }))();
  }
};
exports["default"] = _default;