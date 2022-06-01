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

var _ApiError = _interopRequireDefault(require("../../helpers/ApiError"));

var _i18n = _interopRequireDefault(require("i18n"));

var _notif = _interopRequireDefault(require("../notif.controller/notif.controller"));

var _tplace = _interopRequireDefault(require("../../models/places.model/tplace.model"));

var _saOrder = _interopRequireDefault(require("../../models/saOrder.model/saOrder.model"));

var _user = _interopRequireDefault(require("../../models/user.model/user.model"));

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
  validateAddsaOrder: function validateAddsaOrder() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('link').optional().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('image').optional().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('description').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  addsaOrder: function addsaOrder(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var validatedBody, query, band, ord, user, ID, mdr;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = _objectSpread({}, validatedBody);
              _context2.next = 5;
              return isBanded(query.userId);

            case 5:
              band = _context2.sent;

              if (!band) {
                _context2.next = 10;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context2.next = 26;
              break;

            case 10:
              _context2.next = 12;
              return _saOrder["default"].create(query);

            case 12:
              ord = _context2.sent;
              _context2.next = 15;
              return _user["default"].findOne({
                deleted: false,
                _id: ord.userId
              });

            case 15:
              user = _context2.sent;
              ID = ord.id.toString().padStart(6, "0");
              _context2.next = 19;
              return _tplace["default"].findOne({
                _id: user.city
              });

            case 19:
              mdr = _context2.sent;
              ID = mdr.placeChar + '-' + ID;
              ord.ID = ID;
              _context2.next = 24;
              return ord.save();

            case 24:
              (0, _user2.notifyAdmin)('SAORDER', ord.id.toString(), "تم اضافة  طلب شراء جديد", 'طلب شراء');
              res.status(200).send(ord);

            case 26:
              _context2.next = 32;
              break;

            case 28:
              _context2.prev = 28;
              _context2.t0 = _context2["catch"](0);
              console.log(_context2.t0);
              next(_context2.t0);

            case 32:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 28]]);
    }))();
  },
  findAll: function findAll(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var query, dateQ, saord;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              query = {
                deleted: false
              };

              if (req.query.userId) {
                query.userId = req.query.userId;
                query.latest = false;
              }

              if (req.query.admin) {
                query.canceled = false;
                query.$or = [{
                  booked: false
                }, {
                  booked: true,
                  admin: req.query.admin
                }];
              }

              dateQ = (0, _user2.dateQuery)(req.query.from, req.query.to);
              _context3.next = 7;
              return _saOrder["default"].find(_objectSpread(_objectSpread({}, query), dateQ)).populate("userId");

            case 7:
              saord = _context3.sent;
              res.status(200).send(saord);
              _context3.next = 15;
              break;

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](0);
              console.log(_context3.t0);
              next(_context3.t0);

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 11]]);
    }))();
  },
  latestSaOrders: function latestSaOrders(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var query;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              query = {
                deleted: false,
                canceled: false
              };

              if (req.query.userId) {
                query.userId = req.query.userId;
                query.latest = false;
              }

              _context4.next = 5;
              return _saOrder["default"].updateMany(query, {
                latest: true
              });

            case 5:
              res.status(200).send();
              _context4.next = 12;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);
              console.log(_context4.t0);
              next(_context4.t0);

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 8]]);
    }))();
  },
  deletesaOrder: function deletesaOrder(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var query, saord;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              query = {};

              if (req.query.id) {
                query._id = req.query.id;
              }

              _context5.next = 5;
              return _saOrder["default"].findOneAndUpdate(query, {
                deleted: true
              });

            case 5:
              saord = _context5.sent;
              res.status(200).send(saord);
              _context5.next = 13;
              break;

            case 9:
              _context5.prev = 9;
              _context5.t0 = _context5["catch"](0);
              console.log(_context5.t0);
              next(_context5.t0);

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 9]]);
    }))();
  },
  validateUpdateStateOrderSA: function validateUpdateStateOrderSA() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('status').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  setStatusOrderSA: function setStatusOrderSA(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var validatedBody, query, saorder, user;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = {
                deleted: false,
                _id: validatedBody.id,
                canceled: false
              };
              _context6.next = 5;
              return _saOrder["default"].findOne(query);

            case 5:
              saorder = _context6.sent;

              if (saorder) {
                _context6.next = 8;
                break;
              }

              return _context6.abrupt("return", next(new _ApiError["default"](400, 'تم ألغاء الطلب  مسبقاً')));

            case 8:
              _context6.next = 10;
              return _user["default"].findOne({
                deleted: false,
                _id: saorder.userId
              });

            case 10:
              user = _context6.sent;
              saorder.status = validatedBody.status;
              saorder.latest = false;
              _context6.next = 15;
              return saorder.save();

            case 15:
              if (!user.token) {
                _context6.next = 44;
                break;
              }

              if (!(saorder.status == "ORD")) {
                _context6.next = 21;
                break;
              }

              _context6.next = 19;
              return _notif["default"].pushNotification(user, 'SAORDER', validatedBody.id.toString(), "حالة طلبك : في الإنتظار", 'طلب شراء');

            case 19:
              _context6.next = 44;
              break;

            case 21:
              if (!(saorder.status == "ACPT")) {
                _context6.next = 26;
                break;
              }

              _context6.next = 24;
              return _notif["default"].pushNotification(user, 'SAORDER', validatedBody.id.toString(), "اصبحت شحنتك في يد المندوب", 'طلب شراء');

            case 24:
              _context6.next = 44;
              break;

            case 26:
              if (!(saorder.status == "BUY")) {
                _context6.next = 31;
                break;
              }

              _context6.next = 29;
              return _notif["default"].pushNotification(user, 'SAORDER', validatedBody.id.toString(), "تم استلام شحنتك الى الحوش", 'طلب شراء');

            case 29:
              _context6.next = 44;
              break;

            case 31:
              if (!(saorder.status == "LOAD")) {
                _context6.next = 36;
                break;
              }

              _context6.next = 34;
              return _notif["default"].pushNotification(user, 'SAORDER', validatedBody.id.toString(), "اصبحت شحنتك في الطريق", 'طلب شراء');

            case 34:
              _context6.next = 44;
              break;

            case 36:
              if (!(saorder.status == "WSL")) {
                _context6.next = 41;
                break;
              }

              _context6.next = 39;
              return _notif["default"].pushNotification(user, 'SAORDER', validatedBody.id.toString(), "لقد وصلت طلبك الرجاء مراجعة مكان التسليم", 'طلب شراء');

            case 39:
              _context6.next = 44;
              break;

            case 41:
              if (!(saorder.status == "SOLM")) {
                _context6.next = 44;
                break;
              }

              _context6.next = 44;
              return _notif["default"].pushNotification(user, 'SAORDER', validatedBody.id.toString(), "تم تسليم طلب شراء ، سعدنا بخدمتك", 'طلب شراء');

            case 44:
              res.status(200).send(saorder);
              _context6.next = 51;
              break;

            case 47:
              _context6.prev = 47;
              _context6.t0 = _context6["catch"](0);
              console.log(_context6.t0);
              next(_context6.t0);

            case 51:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[0, 47]]);
    }))();
  },
  validateUpdatePriceOrderSA: function validateUpdatePriceOrderSA() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('cost').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  setPriceOrderSA: function setPriceOrderSA(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var validatedBody, query, saorder, user;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = {
                deleted: false,
                _id: validatedBody.id
              };
              _context7.next = 5;
              return _saOrder["default"].findOne(query);

            case 5:
              saorder = _context7.sent;
              _context7.next = 8;
              return _user["default"].findOne({
                deleted: false,
                _id: saorder.userId
              });

            case 8:
              user = _context7.sent;
              _context7.next = 11;
              return _notif["default"].pushNotification(user, 'SAORDER-PRICE', validatedBody.id.toString(), "\u0644\u0642\u062F \u062A\u0645 \u062A\u0633\u0639\u064A\u0631 \u0637\u0644\u0628\u0643 \u060C \u0627\u062F\u062E\u0644 \u0639\u0644\u0649 \u0627\u0644\u0637\u0644\u0628 \u0644\u0627\u0639\u0637\u0627\u0621 \u0645\u0648\u0627\u0641\u0642\u062A\u0643", 'طلب شراء');

            case 11:
              saorder.price = validatedBody.cost;
              saorder.priceStatus = "WAITTING";
              saorder.latest = false;
              _context7.next = 16;
              return saorder.save();

            case 16:
              res.status(200).send(saorder);
              _context7.next = 23;
              break;

            case 19:
              _context7.prev = 19;
              _context7.t0 = _context7["catch"](0);
              console.log(_context7.t0);
              next(_context7.t0);

            case 23:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[0, 19]]);
    }))();
  },
  validateAcceptPriceOrderSA: function validateAcceptPriceOrderSA() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  acceptPriceOrderSA: function acceptPriceOrderSA(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var validatedBody, query, saorder, user;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = {
                deleted: false,
                _id: validatedBody.id
              };
              _context8.next = 5;
              return _saOrder["default"].findOne(query);

            case 5:
              saorder = _context8.sent;
              _context8.next = 8;
              return _user["default"].findOne({
                deleted: false,
                _id: saorder.userId
              });

            case 8:
              user = _context8.sent;
              (0, _user2.notifyAdmin)('SAORDER', validatedBody.id.toString(), "\u0642\u0627\u0645 ".concat(user.name, " \u0628\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0633\u0639\u0631 \u0637\u0644\u0628 \u0634\u0631\u0627\u0621"), 'طلب شراء', saorder.admin);
              saorder.priceStatus = "ACCEPTED";
              saorder.latest = false;
              _context8.next = 14;
              return saorder.save();

            case 14:
              res.status(200).send(saorder);
              _context8.next = 21;
              break;

            case 17:
              _context8.prev = 17;
              _context8.t0 = _context8["catch"](0);
              console.log(_context8.t0);
              next(_context8.t0);

            case 21:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[0, 17]]);
    }))();
  },
  validateBookOrderSA: function validateBookOrderSA() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('admin').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  BookOrderSA: function BookOrderSA(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var validatedBody, query, saorder;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = {
                deleted: false,
                _id: validatedBody.id
              };
              _context9.next = 5;
              return _saOrder["default"].findOne(query);

            case 5:
              saorder = _context9.sent;
              saorder.booked = true;
              saorder.admin = validatedBody.admin;
              _context9.next = 10;
              return saorder.save();

            case 10:
              res.status(200).send(saorder);
              _context9.next = 17;
              break;

            case 13:
              _context9.prev = 13;
              _context9.t0 = _context9["catch"](0);
              console.log(_context9.t0);
              next(_context9.t0);

            case 17:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[0, 13]]);
    }))();
  },
  validateunBookOrderSA: function validateunBookOrderSA() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('admin').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  unBookOrderSA: function unBookOrderSA(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
      var validatedBody, query, saorder;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = {
                deleted: false,
                _id: validatedBody.id
              };
              _context10.next = 5;
              return _saOrder["default"].findOne(query);

            case 5:
              saorder = _context10.sent;
              saorder.booked = false;
              _context10.next = 9;
              return saorder.save();

            case 9:
              res.status(200).send(saorder);
              _context10.next = 16;
              break;

            case 12:
              _context10.prev = 12;
              _context10.t0 = _context10["catch"](0);
              console.log(_context10.t0);
              next(_context10.t0);

            case 16:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, null, [[0, 12]]);
    }))();
  },
  validateRefusePriceOrderSA: function validateRefusePriceOrderSA() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  refusePriceOrderSA: function refusePriceOrderSA(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      var validatedBody, query, saorder, user;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = {
                deleted: false,
                _id: validatedBody.id
              };
              _context11.next = 5;
              return _saOrder["default"].findOne(query);

            case 5:
              saorder = _context11.sent;
              _context11.next = 8;
              return _user["default"].findOne({
                deleted: false,
                _id: saorder.userId
              });

            case 8:
              user = _context11.sent;
              (0, _user2.notifyAdmin)('SAORDER', validatedBody.id.toString(), "\u0642\u0627\u0645 ".concat(user.name, " \u0628\u0631\u0641\u0636 \u0633\u0639\u0631 \u0637\u0644\u0628 \u0634\u0631\u0627\u0621"), 'طلب شراء', saorder.admin);
              saorder.oldPrice = saorder.price;
              saorder.price = 0;
              saorder.priceStatus = "NONE";
              saorder.latest = false;
              _context11.next = 16;
              return saorder.save();

            case 16:
              res.status(200).send(saorder);
              _context11.next = 23;
              break;

            case 19:
              _context11.prev = 19;
              _context11.t0 = _context11["catch"](0);
              console.log(_context11.t0);
              next(_context11.t0);

            case 23:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, null, [[0, 19]]);
    }))();
  },
  setCancelOrderSA: function setCancelOrderSA(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      var isAdmin, query, saorder, user;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.prev = 0;
              isAdmin = req.query.type == 'admin';
              query = {
                deleted: false,
                _id: req.query.id
              };
              _context12.next = 5;
              return _saOrder["default"].findOne(query);

            case 5:
              saorder = _context12.sent;
              _context12.next = 8;
              return _user["default"].findOne({
                deleted: false,
                _id: saorder.userId
              });

            case 8:
              user = _context12.sent;

              if (!isAdmin) {
                _context12.next = 14;
                break;
              }

              _context12.next = 12;
              return _notif["default"].pushNotification(user, 'SAORDER', query._id.toString(), "\u0642\u0627\u0645 \u0627\u0644\u0645\u0633\u0624\u0644 \u0628\u0631\u0641\u0636 \u0637\u0644\u0628 \u0634\u0631\u0627\u0621", 'طلب شراء');

            case 12:
              _context12.next = 15;
              break;

            case 14:
              (0, _user2.notifyAdmin)('SAORDER', query._id.toString(), "\u0642\u0627\u0645 \u0627\u0644\u0639\u0645\u064A\u0644 ".concat(user.name, " \u0628\u0625\u0644\u063A\u0627\u0621 \u0637\u0644\u0628 \u0627\u0644\u0634\u0631\u0627\u0621"), 'طلب شراء', saorder.booked ? saorder.admin : false);

            case 15:
              saorder.latest = false;
              saorder.canceled = true;
              _context12.next = 19;
              return saorder.save();

            case 19:
              res.status(200).send(saorder);
              _context12.next = 26;
              break;

            case 22:
              _context12.prev = 22;
              _context12.t0 = _context12["catch"](0);
              console.log(_context12.t0);
              next(_context12.t0);

            case 26:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, null, [[0, 22]]);
    }))();
  }
};
exports["default"] = _default;