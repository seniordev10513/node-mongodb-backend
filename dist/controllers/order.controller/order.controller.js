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

var _orders = _interopRequireDefault(require("../../models/orders.model/orders.model"));

var _user2 = _interopRequireDefault(require("../../models/user.model/user.model"));

var _tplace = _interopRequireDefault(require("../../models/places.model/tplace.model"));

var _onlineCar = _interopRequireDefault(require("../../models/onlineCar.model/onlineCar.model"));

var _onlineMsfr = _interopRequireDefault(require("../../models/onlineMsfr.model/onlineMsfr.model"));

var _ApiError = _interopRequireDefault(require("../../helpers/ApiError"));

var _i18n = _interopRequireDefault(require("i18n"));

var _notif = _interopRequireDefault(require("../notif.controller/notif.controller"));

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
            return _user2["default"].findOne({
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
  validateAddorder: function validateAddorder() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('carId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('orderOf').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  addorder: function addorder(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var validatedBody, query, oldOrder, band, msfr, car, notiOrders, ord, sender, user, _sender, _user;

      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = _objectSpread(_objectSpread({}, validatedBody), {}, {
                stat: "WAITTING"
              });
              _context3.next = 5;
              return _orders["default"].exists(_objectSpread(_objectSpread({}, validatedBody), {}, {
                stat: {
                  $in: ["ACCEPTED", "WAITTING"]
                }
              }));

            case 5:
              oldOrder = _context3.sent;

              if (!oldOrder) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", res.status(200).send(oldOrder));

            case 8:
              _context3.next = 10;
              return isBanded(query.orderOf == "CLIENT" ? query.userId : query.carId);

            case 10:
              band = _context3.sent;

              if (!band) {
                _context3.next = 15;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context3.next = 58;
              break;

            case 15:
              _context3.next = 17;
              return _onlineMsfr["default"].findOne({
                userId: validatedBody.userId,
                canceled: false,
                deleted: false
              }).populate("userId");

            case 17:
              msfr = _context3.sent;
              _context3.next = 20;
              return _onlineCar["default"].findOne({
                userId: validatedBody.carId,
                canceled: false,
                deleted: false
              });

            case 20:
              car = _context3.sent;

              if (!(!msfr || msfr.ordered)) {
                _context3.next = 23;
                break;
              }

              return _context3.abrupt("return", next(new _ApiError["default"](400, 'الراكب المراد حجزه لم يعد متاحاً')));

            case 23:
              if (car) {
                _context3.next = 25;
                break;
              }

              return _context3.abrupt("return", next(new _ApiError["default"](400, 'الرحلة المراد الحجز فيها لم تعد متاحة')));

            case 25:
              if (!(validatedBody.orderOf == "CLIENT")) {
                _context3.next = 35;
                break;
              }

              msfr.ordered = true;
              _context3.next = 29;
              return _orders["default"].find({
                stat: {
                  $in: ["WAITTING"]
                },
                deleted: false,
                userId: msfr.userId._id
              });

            case 29:
              notiOrders = _context3.sent;
              notiOrders.map( /*#__PURE__*/function () {
                var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ord) {
                  var drive;
                  return _regenerator["default"].wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return _user2["default"].findOne({
                            _id: ord.carId
                          });

                        case 2:
                          drive = _context2.sent;

                          if (!(ord.orderOf == "DRIVER")) {
                            _context2.next = 6;
                            break;
                          }

                          _context2.next = 6;
                          return _notif["default"].pushNotification(drive, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(msfr.userId.name, " \u0628\u0639\u062F\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632 \u0644\u062F\u064A\u0647"), 'رفض الطلب');

                        case 6:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              }());
              _context3.next = 33;
              return _orders["default"].updateMany({
                stat: {
                  $in: ["WAITTING"]
                },
                deleted: false,
                userId: validatedBody.userId,
                orderOf: "DRIVER"
              }, {
                stat: "REFUSED"
              });

            case 33:
              _context3.next = 35;
              return msfr.save();

            case 35:
              _context3.next = 37;
              return _orders["default"].create(query);

            case 37:
              ord = _context3.sent;

              if (!(validatedBody.orderOf == "DRIVER")) {
                _context3.next = 49;
                break;
              }

              _context3.next = 41;
              return _user2["default"].findOne({
                _id: validatedBody.carId
              }).populate([{
                path: "TripId",
                model: "onlineCar"
              }]);

            case 41:
              sender = _context3.sent;
              _context3.next = 44;
              return _user2["default"].findOne({
                _id: validatedBody.userId
              });

            case 44:
              user = _context3.sent;
              _context3.next = 47;
              return _notif["default"].pushNotification(user, 'ORDER', ord.id.toString(), "\u064A\u0631\u063A\u0628 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(sender.name, " \u0627\u0646 \u062A\u062D\u062C\u0632 \u0644\u062F\u064A\u0647 \u0641\u064A \u0631\u062D\u0644\u062A\u0647 \u060C \u0647\u0644 \u062A\u0648\u0627\u0641\u0642 \u061F"), 'رحلة');

            case 47:
              _context3.next = 57;
              break;

            case 49:
              _context3.next = 51;
              return _user2["default"].findOne({
                _id: validatedBody.userId
              }).populate([{
                path: "TripId",
                model: "onlineMsfr"
              }]);

            case 51:
              _sender = _context3.sent;
              _context3.next = 54;
              return _user2["default"].findOne({
                _id: validatedBody.carId
              });

            case 54:
              _user = _context3.sent;
              _context3.next = 57;
              return _notif["default"].pushNotification(_user, 'ORDER', ord.id.toString(), "\u064A\u0631\u063A\u0628  ".concat(_sender.TripId.numPers, " \u0631\u0643\u0627\u0628 \u0627\u0646 \u064A\u062D\u062C\u0632\u0648 \u0641\u064A \u0631\u062D\u0644\u062A\u0643 \u060C \u0647\u0644 \u062A\u0648\u0627\u0641\u0642 \u061F"), 'رحلة');

            case 57:
              // if(query.orderOf == "CLIENT"){
              // user.ordered = true;
              // }
              // await user.save();
              res.status(200).send(ord);

            case 58:
              _context3.next = 64;
              break;

            case 60:
              _context3.prev = 60;
              _context3.t0 = _context3["catch"](0);
              console.log(_context3.t0);
              next(_context3.t0);

            case 64:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 60]]);
    }))();
  },
  getUserorder: function getUserorder(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var query, _req$query, userId, carId, ordr;

      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              query = {
                deleted: false,
                stat: {
                  $in: ["WAITTING", "ACCEPTED"]
                }
              };
              _req$query = req.query, userId = _req$query.userId, carId = _req$query.carId;

              if (userId >= 0) {
                query.userId = userId;
              }

              if (carId >= 0) {
                query.carId = carId;
              }

              _context4.next = 7;
              return _orders["default"].find(query).populate([{
                path: userId ? 'carId' : 'userId',
                populate: {
                  path: "TripId",
                  model: carId ? "onlineMsfr" : "onlineCar"
                }
              }]);

            case 7:
              ordr = _context4.sent;
              res.status(200).send(ordr);
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
  },
  // async getAllonlineCar(req, res, next) {
  //     try {
  //         let query = {deleted:false,canceled:false}
  //         // let {userId} = req.query
  //         // if(userId) {
  //         //     query.userId = userId
  //         // }
  //         let oCar = await onlineCar.find(query).populate("driver").exec()
  //         res.status(200).send(oCar)
  //     } catch (err) {
  //         next(err);
  //     }
  // },
  validateCancelorder: function validateCancelorder() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('carId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('orderOf').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  cancelorder: function cancelorder(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var validatedBody, query, band, ord, msfr, driver;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = _objectSpread({
                deleted: false,
                stat: {
                  $in: ["WAITTING", "ACCEPTED", "REFUSED"]
                }
              }, validatedBody); // let user = await UserModel.findOne({id:query.userId})
              // if(query.orderOf == "CLIENT")
              // user.ordered = false

              _context5.next = 5;
              return isBanded(query.orderOf == "CLIENT" ? query.userId : query.carId);

            case 5:
              band = _context5.sent;

              if (!band) {
                _context5.next = 10;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context5.next = 37;
              break;

            case 10:
              _context5.next = 12;
              return _orders["default"].findOne(query);

            case 12:
              ord = _context5.sent;

              if (!ord) {
                next(new _ApiError["default"](400, 'تم ألغاء الطلب  مسبقاً'));
              }

              _context5.next = 16;
              return _onlineMsfr["default"].findOne({
                userId: validatedBody.userId,
                canceled: false,
                deleted: false
              }).populate("userId");

            case 16:
              msfr = _context5.sent;
              _context5.next = 19;
              return _onlineCar["default"].findOne({
                userId: validatedBody.carId,
                canceled: false,
                deleted: false
              }).populate("userId");

            case 19:
              driver = _context5.sent;

              if (ord.orderOf == "CLIENT") {
                msfr.ordered = false;
              }

              if (ord.stat == "ACCEPTED") {
                msfr.AddedTo = -1;
                msfr.ordered = false;
                driver.added = driver.added - msfr.numPers;
                driver.isCompleted = false;
              }

              if (!(validatedBody.orderOf == "DRIVER")) {
                _context5.next = 27;
                break;
              }

              _context5.next = 25;
              return _notif["default"].pushNotification(msfr.userId, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(driver.userId.name, " \u0628\u0625\u0644\u063A\u0627\u0621 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632"), 'إلغاء الطلب');

            case 25:
              _context5.next = 29;
              break;

            case 27:
              _context5.next = 29;
              return _notif["default"].pushNotification(driver.userId, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0631\u0627\u0643\u0628 ".concat(msfr.userId.name, " \u0628\u0625\u0644\u063A\u0627\u0621 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632"), 'إلغاء الطلب');

            case 29:
              ord.stat = "CANCELED"; // user.save()

              _context5.next = 32;
              return msfr.save();

            case 32:
              _context5.next = 34;
              return driver.save();

            case 34:
              _context5.next = 36;
              return ord.save();

            case 36:
              res.status(200).send(ord);

            case 37:
              _context5.next = 43;
              break;

            case 39:
              _context5.prev = 39;
              _context5.t0 = _context5["catch"](0);
              console.log(_context5.t0);
              next(_context5.t0);

            case 43:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 39]]);
    }))();
  },
  validateAcceptorder: function validateAcceptorder() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('carId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('orderOf').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  acceptorder: function acceptorder(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var validatedBody, query, band, ord, msfr, driver, notiOrders, _notiOrders;

      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = _objectSpread({
                deleted: false,
                stat: "WAITTING"
              }, validatedBody); // let user = await UserModel.findOne({id:query.userId})
              // if(query.orderOf == "CLIENT")
              // user.ordered = false

              _context8.next = 5;
              return isBanded(query.orderOf == "CLIENT" ? query.userId : query.carId);

            case 5:
              band = _context8.sent;

              if (!band) {
                _context8.next = 10;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context8.next = 56;
              break;

            case 10:
              _context8.next = 12;
              return _orders["default"].findOne(query);

            case 12:
              ord = _context8.sent;

              if (!ord) {
                next(new _ApiError["default"](400, 'تم ألغاء الطلب  مسبقاً'));
              }

              ord.stat = "ACCEPTED";
              _context8.next = 17;
              return _onlineMsfr["default"].findOne({
                userId: validatedBody.userId,
                canceled: false,
                deleted: false
              }).populate("userId");

            case 17:
              msfr = _context8.sent;
              _context8.next = 20;
              return _onlineCar["default"].findOne({
                userId: validatedBody.carId,
                canceled: false,
                deleted: false
              }).populate("userId");

            case 20:
              driver = _context8.sent;

              if (driver.added + msfr.numPers > driver.lefted) {
                next(new _ApiError["default"](400, 'أكتمل العدد'));
              }

              msfr.AddedTo = driver.id;
              msfr.ordered = true;
              driver.added = driver.added + msfr.numPers || msfr.numPers;

              if (!(driver.lefted <= driver.added)) {
                _context8.next = 35;
                break;
              }

              driver.isCompleted = true;
              _context8.next = 29;
              return _orders["default"].find({
                stat: {
                  $in: ["WAITTING"]
                },
                deleted: false,
                userId: driver.userId._id
              });

            case 29:
              notiOrders = _context8.sent;
              notiOrders.map( /*#__PURE__*/function () {
                var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(ord) {
                  var msf;
                  return _regenerator["default"].wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          _context6.next = 2;
                          return _user2["default"].findOne({
                            _id: ord.userId
                          });

                        case 2:
                          msf = _context6.sent;

                          if (!(ord.orderOf == "DRIVER")) {
                            _context6.next = 8;
                            break;
                          }

                          _context6.next = 6;
                          return _notif["default"].pushNotification(msf, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(driver.userId.name, " \u0628\u0639\u062F\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632"), 'رفض الطلب');

                        case 6:
                          _context6.next = 11;
                          break;

                        case 8:
                          if (!(ord.orderOf == "CLIENT")) {
                            _context6.next = 11;
                            break;
                          }

                          _context6.next = 11;
                          return _notif["default"].pushNotification(msf, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(driver.userId.name, " \u0628\u0625\u0644\u063A\u0627\u0621 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632"), 'إلغاء الطلب');

                        case 11:
                        case "end":
                          return _context6.stop();
                      }
                    }
                  }, _callee6);
                }));

                return function (_x3) {
                  return _ref3.apply(this, arguments);
                };
              }());
              _context8.next = 33;
              return _orders["default"].updateMany({
                stat: {
                  $in: ["WAITTING"]
                },
                deleted: false,
                carId: validatedBody.carId,
                orderOf: "DRIVER"
              }, {
                stat: "CANCELED"
              });

            case 33:
              _context8.next = 35;
              return _orders["default"].updateMany({
                stat: {
                  $in: ["WAITTING"]
                },
                deleted: false,
                carId: validatedBody.carId,
                orderOf: "CLIENT"
              }, {
                stat: "REFUSED"
              });

            case 35:
              _context8.next = 37;
              return ord.save();

            case 37:
              _context8.next = 39;
              return msfr.save();

            case 39:
              _context8.next = 41;
              return driver.save();

            case 41:
              if (!(validatedBody.orderOf == "DRIVER")) {
                _context8.next = 53;
                break;
              }

              _context8.next = 44;
              return _notif["default"].pushNotification(driver.userId, 'ORDER', ord.id.toString(), "\u0642\u0627\u0645 \u0627\u0644\u0631\u0627\u0643\u0628 ".concat(msfr.userId.name, " \u0628\u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0630\u064A \u0623\u0631\u0633\u0644\u062A\u0647"), 'رحلة');

            case 44:
              _context8.next = 46;
              return _orders["default"].find({
                stat: {
                  $in: ["WAITTING"]
                },
                deleted: false,
                userId: msfr.userId._id
              });

            case 46:
              _notiOrders = _context8.sent;

              _notiOrders.map( /*#__PURE__*/function () {
                var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(ord) {
                  var msf;
                  return _regenerator["default"].wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          _context7.next = 2;
                          return _user2["default"].findOne({
                            _id: ord.carId
                          });

                        case 2:
                          msf = _context7.sent;

                          if (!(ord.orderOf == "DRIVER")) {
                            _context7.next = 6;
                            break;
                          }

                          _context7.next = 6;
                          return _notif["default"].pushNotification(msf, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0631\u0627\u0643\u0628 ".concat(msfr.userId.name, " \u0628\u0639\u062F\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632 \u0644\u062F\u064A\u0647"), 'رفض الطلب');

                        case 6:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));

                return function (_x4) {
                  return _ref4.apply(this, arguments);
                };
              }());

              _context8.next = 50;
              return _orders["default"].updateMany({
                stat: {
                  $in: ["WAITTING"]
                },
                deleted: false,
                userId: validatedBody.userId,
                orderOf: "DRIVER"
              }, {
                stat: "REFUSED"
              });

            case 50:
              res.status(200).send(msfr);
              _context8.next = 56;
              break;

            case 53:
              _context8.next = 55;
              return _notif["default"].pushNotification(msfr.userId, 'ORDER', ord.id.toString(), "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(driver.userId.name, " \u0628\u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632 \u0627\u0644\u0630\u064A \u0623\u0631\u0633\u0644\u062A\u0647"), 'رحلة', 'رحلة');

            case 55:
              res.status(200).send(driver);

            case 56:
              _context8.next = 62;
              break;

            case 58:
              _context8.prev = 58;
              _context8.t0 = _context8["catch"](0);
              console.log(_context8.t0);
              next(_context8.t0);

            case 62:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[0, 58]]);
    }))();
  },
  validateRefuseorder: function validateRefuseorder() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('carId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('orderOf').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  refuseorder: function refuseorder(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var tripQuery, validatedBody, query, band, ord, msfr, driver;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              tripQuery = {
                canceled: false,
                deleted: false
              };
              validatedBody = (0, _shared.checkValidations)(req);
              query = _objectSpread({
                deleted: false,
                stat: {
                  $in: ["WAITTING", "ACCEPTED"]
                }
              }, validatedBody);
              _context9.next = 6;
              return isBanded(query.orderOf == "CLIENT" ? query.userId : query.carId);

            case 6:
              band = _context9.sent;

              if (!band) {
                _context9.next = 11;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context9.next = 39;
              break;

            case 11:
              _context9.next = 13;
              return _orders["default"].findOne(query);

            case 13:
              ord = _context9.sent;

              if (!ord) {
                next(new _ApiError["default"](400, 'تم إلغاء الطلب مسبقاً'));
              }

              _context9.next = 17;
              return _onlineMsfr["default"].findOne(_objectSpread({
                userId: validatedBody.userId
              }, tripQuery)).populate("userId");

            case 17:
              msfr = _context9.sent;
              _context9.next = 20;
              return _onlineCar["default"].findOne(_objectSpread({
                userId: validatedBody.carId
              }, tripQuery)).populate("userId");

            case 20:
              driver = _context9.sent;

              if (ord.orderOf == "CLIENT") {
                msfr.ordered = false;
              }

              console.log(ord.stat);

              if (ord.stat == "ACCEPTED") {
                msfr.AddedTo = -1;
                msfr.ordered = false;
                console.log(driver.added, msfr.numPers);
                driver.added = driver.added - msfr.numPers;
                console.log(driver.added, msfr.numPers);
                driver.isCompleted = false;
              }

              ord.stat = "REFUSED";
              _context9.next = 27;
              return msfr.save();

            case 27:
              _context9.next = 29;
              return driver.save();

            case 29:
              _context9.next = 31;
              return ord.save();

            case 31:
              if (!(validatedBody.orderOf == "DRIVER")) {
                _context9.next = 36;
                break;
              }

              _context9.next = 34;
              return _notif["default"].pushNotification(driver.userId, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0631\u0627\u0643\u0628 ".concat(msfr.userId.name, " \u0628\u0639\u062F\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632"), 'رفض الطلب');

            case 34:
              _context9.next = 38;
              break;

            case 36:
              _context9.next = 38;
              return _notif["default"].pushNotification(msfr.userId, 'ORDER', '', "\u0642\u0627\u0645 \u0627\u0644\u0633\u0627\u0626\u0642 ".concat(driver.userId.name, " \u0628\u0639\u062F\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u062D\u062C\u0632"), 'رفض الطلب');

            case 38:
              res.status(200).send(ord);

            case 39:
              _context9.next = 45;
              break;

            case 41:
              _context9.prev = 41;
              _context9.t0 = _context9["catch"](0);
              console.log(_context9.t0);
              next(_context9.t0);

            case 45:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[0, 41]]);
    }))();
  }
};
exports["default"] = _default;