"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _check = require("express-validator/check");

var _shared = require("../shared.controller/shared.controller");

var _shohnat = _interopRequireDefault(require("../../models/shohnat.model/shohnat.model"));

var _user = _interopRequireDefault(require("../../models/user.model/user.model"));

var _tplace = _interopRequireDefault(require("../../models/places.model/tplace.model"));

var _ApiError = _interopRequireDefault(require("../../helpers/ApiError"));

var _i18n = _interopRequireDefault(require("i18n"));

var _notif = _interopRequireDefault(require("../notif.controller/notif.controller"));

var _user2 = require("../user.controller/user.controller");

var _excluded = ["id"];

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
  validateAddShohnat: function validateAddShohnat() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('count').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('images').optional().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('withTrans').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('trnsFrom').optional().not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('tasleemAdress').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('toperson').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('isMostajal').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  addShohnat: function addShohnat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var validatedBody, query, band, shohnat, code, ID, mdr, mdn;
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
              _context2.next = 33;
              break;

            case 11:
              _context2.next = 13;
              return _shohnat["default"].create(query);

            case 13:
              shohnat = _context2.sent;
              code = Math.floor(Math.random() * 100000000).toString().padStart(8, "0");
              ID = shohnat.id.toString().padStart(6, "0");

              if (!(query.tasleemAdress.country == "YE")) {
                _context2.next = 23;
                break;
              }

              _context2.next = 19;
              return _tplace["default"].findOne({
                _id: query.tasleemAdress.MDR
              });

            case 19:
              mdr = _context2.sent;
              ID = mdr.placeChar + '-' + ID;
              _context2.next = 27;
              break;

            case 23:
              _context2.next = 25;
              return _tplace["default"].findOne({
                _id: query.tasleemAdress.city
              });

            case 25:
              mdn = _context2.sent;
              ID = mdn.placeChar + '-' + ID;

            case 27:
              (0, _user2.notifyAdmin)('SHOHNAT', ID.toString(), "تم اضافة  عفش جديد", 'عفش شخصي', query.trnsFrom.country == "YE" ? query.trnsFrom.MDR : query.trnsFrom.city);
              shohnat.ID = ID;
              shohnat.code = code;
              _context2.next = 32;
              return shohnat.save();

            case 32:
              res.status(200).send(shohnat);

            case 33:
              _context2.next = 38;
              break;

            case 35:
              _context2.prev = 35;
              _context2.t0 = _context2["catch"](0);
              next(_context2.t0);

            case 38:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 35]]);
    }))();
  },
  validateUpdateShohnat: function validateUpdateShohnat() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('count').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('images').optional().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('withTrans').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('trnsFrom').optional().not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('tasleemAdress').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('toperson').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('isMostajal').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  UpdateShohnat: function UpdateShohnat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var validatedBody, id, query, user, shohnat;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              id = validatedBody.id, query = (0, _objectWithoutProperties2["default"])(validatedBody, _excluded);
              _context3.next = 5;
              return _user["default"].findOne({
                _id: query.userId
              });

            case 5:
              user = _context3.sent;
              _context3.next = 8;
              return _shohnat["default"].findOneAndUpdate({
                _id: id
              }, _objectSpread(_objectSpread({}, query), {}, {
                latest: false
              }), {
                "new": true
              });

            case 8:
              shohnat = _context3.sent;
              (0, _user2.notifyAdmin)('SHOHNAT', id.toString(), "\u0642\u0627\u0645 ".concat(user.name, " \u0628\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0637\u0644\u0628"), 'عفش شخصي', query.trnsFrom.country == "YE" ? query.trnsFrom.MDR : query.trnsFrom.city);
              res.status(200).send(shohnat);
              _context3.next = 16;
              break;

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](0);
              next(_context3.t0);

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 13]]);
    }))();
  },
  getUserShohnat: function getUserShohnat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var query, userId, shohnat;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              query = {};
              userId = req.query.userId;

              if (userId) {
                query.userId = userId;
                query.latest = false;
              }

              _context4.next = 6;
              return _shohnat["default"].find(query);

            case 6:
              shohnat = _context4.sent;
              res.status(200).send(shohnat);
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
  latestShohnat: function latestShohnat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var query, userId;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              query = {};
              userId = req.query.userId;

              if (userId) {
                query.userId = userId;
                query.latest = false;
              }

              _context5.next = 6;
              return _shohnat["default"].updateMany(query, {
                latest: true
              });

            case 6:
              res.status(200).send();
              _context5.next = 12;
              break;

            case 9:
              _context5.prev = 9;
              _context5.t0 = _context5["catch"](0);
              next(_context5.t0);

            case 12:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 9]]);
    }))();
  },
  getAllShohnat: function getAllShohnat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var query, dateQ, shohnat;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              query = {
                deleted: false,
                canceled: false
              };
              dateQ = (0, _user2.dateQuery)(req.query.from, req.query.to);
              _context6.next = 5;
              return _shohnat["default"].find(_objectSpread(_objectSpread({}, query), dateQ)).populate("userId");

            case 5:
              shohnat = _context6.sent;
              res.status(200).send(shohnat);
              _context6.next = 12;
              break;

            case 9:
              _context6.prev = 9;
              _context6.t0 = _context6["catch"](0);
              next(_context6.t0);

            case 12:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[0, 9]]);
    }))();
  },
  getTransShohnat: function getTransShohnat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var query, dateQ, shohnat;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              query = {
                deleted: false,
                withTrans: true,
                shohnhStatus: "ORD"
              };
              dateQ = (0, _user2.dateQuery)(req.query.from, req.query.to);
              _context7.next = 5;
              return _shohnat["default"].find(_objectSpread(_objectSpread({}, query), dateQ)).populate("userId");

            case 5:
              shohnat = _context7.sent;
              res.status(200).send(shohnat);
              _context7.next = 12;
              break;

            case 9:
              _context7.prev = 9;
              _context7.t0 = _context7["catch"](0);
              next(_context7.t0);

            case 12:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[0, 9]]);
    }))();
  },
  validateUpdateStateShohnat: function validateUpdateStateShohnat() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('status').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  setStatusShohnat: function setStatusShohnat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var validatedBody, query, shohnat, user;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = {
                deleted: false,
                _id: validatedBody.id,
                canceled: false
              };
              _context8.next = 5;
              return _shohnat["default"].findOne(query);

            case 5:
              shohnat = _context8.sent;

              if (shohnat) {
                _context8.next = 8;
                break;
              }

              return _context8.abrupt("return", next(new _ApiError["default"](400, 'تم ألغاء الطلب  مسبقاً')));

            case 8:
              _context8.next = 10;
              return _user["default"].findOne({
                deleted: false,
                _id: shohnat.userId
              });

            case 10:
              user = _context8.sent;
              shohnat.shohnhStatus = validatedBody.status;
              shohnat.latest = false;
              _context8.next = 15;
              return shohnat.save();

            case 15:
              if (!user.token) {
                _context8.next = 44;
                break;
              }

              if (!(shohnat.shohnhStatus == "ORD")) {
                _context8.next = 21;
                break;
              }

              _context8.next = 19;
              return _notif["default"].pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "حالة الشحنة: في الإنتظار", 'عفش شخصي');

            case 19:
              _context8.next = 44;
              break;

            case 21:
              if (!(shohnat.shohnhStatus == "MND")) {
                _context8.next = 26;
                break;
              }

              _context8.next = 24;
              return _notif["default"].pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "اصبحت شحنتك في يد المندوب", 'عفش شخصي');

            case 24:
              _context8.next = 44;
              break;

            case 26:
              if (!(shohnat.shohnhStatus == "HOSH")) {
                _context8.next = 31;
                break;
              }

              _context8.next = 29;
              return _notif["default"].pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "تم استلام شحنتك الى الحوش", 'عفش شخصي');

            case 29:
              _context8.next = 44;
              break;

            case 31:
              if (!(shohnat.shohnhStatus == "CAR")) {
                _context8.next = 36;
                break;
              }

              _context8.next = 34;
              return _notif["default"].pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "اصبحت شحنتك في الطريق", 'عفش شخصي');

            case 34:
              _context8.next = 44;
              break;

            case 36:
              if (!(shohnat.shohnhStatus == "WSL")) {
                _context8.next = 41;
                break;
              }

              _context8.next = 39;
              return _notif["default"].pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "لقد وصلت شحنتك ، الرجاء مراجعة مكان التسليم", 'عفش شخصي');

            case 39:
              _context8.next = 44;
              break;

            case 41:
              if (!(shohnat.shohnhStatus == "SOLM")) {
                _context8.next = 44;
                break;
              }

              _context8.next = 44;
              return _notif["default"].pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "تم تسليم الشحنة", 'عفش شخصي');

            case 44:
              res.status(200).send(shohnat);
              _context8.next = 51;
              break;

            case 47:
              _context8.prev = 47;
              _context8.t0 = _context8["catch"](0);
              console.log(_context8.t0);
              next(_context8.t0);

            case 51:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[0, 47]]);
    }))();
  },
  validateUpdatePriceShohnat: function validateUpdatePriceShohnat() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('cost').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  setPriceShohnat: function setPriceShohnat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var validatedBody, query, shohnat, user;
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
              return _shohnat["default"].findOne(query);

            case 5:
              shohnat = _context9.sent;
              _context9.next = 8;
              return _user["default"].findOne({
                deleted: false,
                _id: shohnat.userId
              });

            case 8:
              user = _context9.sent;
              _context9.next = 11;
              return _notif["default"].pushNotification(user, 'SHOHNAT-PRICE', validatedBody.id.toString(), "\u062A\u0645 \u062A\u0633\u0639\u064A\u0631 \u0627\u0644\u0634\u062D\u0646\u0629", 'عفش شخصي');

            case 11:
              shohnat.price = validatedBody.cost;
              shohnat.priceStatus = "WAITTING";
              shohnat.latest = false;
              _context9.next = 16;
              return shohnat.save();

            case 16:
              res.status(200).send(shohnat);
              _context9.next = 23;
              break;

            case 19:
              _context9.prev = 19;
              _context9.t0 = _context9["catch"](0);
              console.log(_context9.t0);
              next(_context9.t0);

            case 23:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[0, 19]]);
    }))();
  },
  validateAcceptPriceShohnat: function validateAcceptPriceShohnat() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  acceptPriceShohnat: function acceptPriceShohnat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
      var validatedBody, query, shohnat, user;
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
              return _shohnat["default"].findOne(query);

            case 5:
              shohnat = _context10.sent;
              _context10.next = 8;
              return _user["default"].findOne({
                deleted: false,
                _id: shohnat.userId
              });

            case 8:
              user = _context10.sent;
              (0, _user2.notifyAdmin)('SHOHNAT', validatedBody.id.toString(), "\u0642\u0627\u0645 ".concat(user.name, " \u0628\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0633\u0639\u0631 \u0627\u0644\u0634\u062D\u0646\u0629"), 'عفش شخصي', shohnat.trnsFrom.country == "YE" ? shohnat.trnsFrom.MDR : shohnat.trnsFrom.city);
              shohnat.priceStatus = "ACCEPTED";
              shohnat.latest = false;
              _context10.next = 14;
              return shohnat.save();

            case 14:
              res.status(200).send(shohnat);
              _context10.next = 21;
              break;

            case 17:
              _context10.prev = 17;
              _context10.t0 = _context10["catch"](0);
              console.log(_context10.t0);
              next(_context10.t0);

            case 21:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, null, [[0, 17]]);
    }))();
  },
  validateRefusePriceShohnat: function validateRefusePriceShohnat() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  refusePriceShohnat: function refusePriceShohnat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      var validatedBody, query, shohnat, user;
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
              return _shohnat["default"].findOne(query);

            case 5:
              shohnat = _context11.sent;
              _context11.next = 8;
              return _user["default"].findOne({
                deleted: false,
                _id: shohnat.userId
              });

            case 8:
              user = _context11.sent;
              (0, _user2.notifyAdmin)('SHOHNAT', validatedBody.id.toString(), "\u0642\u0627\u0645 \u0627\u0644\u0639\u0645\u064A\u0644 ".concat(user.name, " \u0628\u0631\u0641\u0636 \u0633\u0639\u0631 \u0627\u0644\u0634\u062D\u0646\u0629"), 'عفش شخصي', shohnat.trnsFrom.country == "YE" ? shohnat.trnsFrom.MDR : shohnat.trnsFrom.city);
              shohnat.oldPrice = shohnat.price;
              shohnat.price = 0;
              shohnat.priceStatus = "NONE";
              shohnat.latest = false;
              _context11.next = 16;
              return shohnat.save();

            case 16:
              res.status(200).send(shohnat);
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
  setCancelShohnat: function setCancelShohnat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      var isAdmin, query, shohnat, user;
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
              return _shohnat["default"].findOne(query);

            case 5:
              shohnat = _context12.sent;
              _context12.next = 8;
              return _user["default"].findOne({
                deleted: false,
                _id: shohnat.userId
              });

            case 8:
              user = _context12.sent;

              if (!isAdmin) {
                _context12.next = 14;
                break;
              }

              _context12.next = 12;
              return _notif["default"].pushNotification(user, 'SHOHNAT', query._id.toString(), "\u0642\u0627\u0645 \u0627\u0644\u0645\u0633\u0624\u0644 \u0628\u0631\u0641\u0636 \u0627\u0644\u0634\u062D\u0646\u0629", 'عفش شخصي');

            case 12:
              _context12.next = 15;
              break;

            case 14:
              (0, _user2.notifyAdmin)('SHOHNAT', query._id.toString(), "\u0642\u0627\u0645 \u0627\u0644\u0639\u0645\u064A\u0644 ".concat(user.name, " \u0628\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0634\u062D\u0646\u0629"), 'عفش شخصي', shohnat.trnsFrom.country == "YE" ? shohnat.trnsFrom.MDR : shohnat.trnsFrom.city);

            case 15:
              shohnat.latest = false;
              shohnat.canceled = true;
              _context12.next = 19;
              return shohnat.save();

            case 19:
              res.status(200).send(shohnat);
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