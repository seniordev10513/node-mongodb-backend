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

var _commercial = _interopRequireDefault(require("../../models/commercial.model/commercial.model"));

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
  validateAddCommercial: function validateAddCommercial() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('wholeTruck').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('truckType').optional().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('lugType').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('date').optional().not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('From').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('To').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  addCommercial: function addCommercial(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var validatedBody, query, band, commercial, ID, mdr, mdn;
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
              _context2.next = 32;
              break;

            case 11:
              query.CommercialStatus = "ORD";
              _context2.next = 14;
              return _commercial["default"].create(query);

            case 14:
              commercial = _context2.sent;
              ID = commercial.id.toString().padStart(6, "0");

              if (!(query.To.country == "YE")) {
                _context2.next = 23;
                break;
              }

              _context2.next = 19;
              return _tplace["default"].findOne({
                _id: query.To.MDR
              });

            case 19:
              mdr = _context2.sent;
              ID = mdr.placeChar + '-' + ID;
              _context2.next = 27;
              break;

            case 23:
              _context2.next = 25;
              return _tplace["default"].findOne({
                _id: query.To.city
              });

            case 25:
              mdn = _context2.sent;
              ID = mdn.placeChar + '-' + ID;

            case 27:
              (0, _user2.notifyAdmin)('COMMERCIAL', ID.toString(), "تم اضافة  عفش تجاري جديد", 'عفش تجاري', query.From.country == "YE" ? query.From.MDR : query.From.city);
              commercial.ID = ID;
              _context2.next = 31;
              return commercial.save();

            case 31:
              res.status(200).send(commercial);

            case 32:
              _context2.next = 37;
              break;

            case 34:
              _context2.prev = 34;
              _context2.t0 = _context2["catch"](0);
              next(_context2.t0);

            case 37:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 34]]);
    }))();
  },
  validateUpdateCommercial: function validateUpdateCommercial() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('wholeTruck').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('truckType').optional().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('lugType').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('date').optional().not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('From').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('To').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  UpdateCommercial: function UpdateCommercial(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var validatedBody, id, query, user, commercial;
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
              return _commercial["default"].findOneAndUpdate({
                _id: id
              }, _objectSpread(_objectSpread({}, query), {}, {
                latest: false
              }), {
                "new": true
              });

            case 8:
              commercial = _context3.sent;
              // commercial = {...commercial,...query}
              // console.log({...commercial,...query});
              // console.log(commercial);
              // await commercial.save()
              (0, _user2.notifyAdmin)('COMMERCIAL', id.toString(), "\u0642\u0627\u0645 ".concat(user.name, " \u0628\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0637\u0644\u0628"), 'عفش تجاري', query.From.country == "YE" ? query.From.MDR : query.From.city);
              res.status(200).send(commercial);
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
  getUserCommercial: function getUserCommercial(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var query, userId, commercial;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              query = {
                deleted: false
              };
              userId = req.query.userId;

              if (userId) {
                query.userId = userId;
                query.latest = false;
              }

              _context4.next = 6;
              return _commercial["default"].find(query);

            case 6:
              commercial = _context4.sent;
              res.status(200).send(commercial);
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
  latestUserCommercial: function latestUserCommercial(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var query, userId;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              query = {
                deleted: false
              };
              userId = req.query.userId;

              if (userId) {
                query.userId = userId;
                query.latest = false;
              }

              _context5.next = 6;
              return _commercial["default"].updateMany(query, {
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
  getAllCommercial: function getAllCommercial(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var query, dateQ, commercial;
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
              return _commercial["default"].find(_objectSpread(_objectSpread({}, query), dateQ)).populate("userId");

            case 5:
              commercial = _context6.sent;
              res.status(200).send(commercial);
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
  // async getTransCommercial(req, res, next) {
  //     try {
  //         let query = {deleted:false,withTrans:true,shohnhStatus:"ORD"}
  //         let commercial = await Commercial.find(query).populate("userId")
  //         res.status(200).send(commercial)
  //     } catch (err) {
  //         next(err);
  //     }
  // },
  validateUpdateStateCommercial: function validateUpdateStateCommercial() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('status').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  setStatusCommercial: function setStatusCommercial(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var validatedBody, query, commercial, user;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              query = {
                deleted: false,
                _id: validatedBody.id,
                canceled: false
              };
              _context7.next = 5;
              return _commercial["default"].findOne(query);

            case 5:
              commercial = _context7.sent;

              if (commercial) {
                _context7.next = 8;
                break;
              }

              return _context7.abrupt("return", next(new _ApiError["default"](400, 'تم ألغاء الطلب  مسبقاً')));

            case 8:
              _context7.next = 10;
              return _user["default"].findOne({
                deleted: false,
                _id: commercial.userId
              });

            case 10:
              user = _context7.sent;
              commercial.CommercialStatus = validatedBody.status;
              commercial.latest = false; // console.log(user);

              _context7.next = 15;
              return commercial.save();

            case 15:
              if (!user.token) {
                _context7.next = 39;
                break;
              }

              if (!(commercial.CommercialStatus == "ORD")) {
                _context7.next = 21;
                break;
              }

              _context7.next = 19;
              return _notif["default"].pushNotification(user, 'COMMERCIAL', validatedBody.id.toString(), "حالة الشحنة : في الإنتظار", 'عفش تجاري');

            case 19:
              _context7.next = 39;
              break;

            case 21:
              if (!(commercial.CommercialStatus == "LOAD")) {
                _context7.next = 26;
                break;
              }

              _context7.next = 24;
              return _notif["default"].pushNotification(user, 'COMMERCIAL', validatedBody.id.toString(), "تم إيجاد سيارة ادخل للشحنة للتفاصيل", 'عفش تجاري');

            case 24:
              _context7.next = 39;
              break;

            case 26:
              if (!(commercial.CommercialStatus == "MNF")) {
                _context7.next = 31;
                break;
              }

              _context7.next = 29;
              return _notif["default"].pushNotification(user, 'COMMERCIAL', validatedBody.id.toString(), "تم تحميل الشحنة", 'عفش تجاري');

            case 29:
              _context7.next = 39;
              break;

            case 31:
              if (!(commercial.CommercialStatus == "WSL")) {
                _context7.next = 36;
                break;
              }

              _context7.next = 34;
              return _notif["default"].pushNotification(user, 'COMMERCIAL', validatedBody.id.toString(), "وصلت الشحنة الى الوجهة", 'عفش تجاري');

            case 34:
              _context7.next = 39;
              break;

            case 36:
              if (!(commercial.CommercialStatus == "SOLM")) {
                _context7.next = 39;
                break;
              }

              _context7.next = 39;
              return _notif["default"].pushNotification(user, 'COMMERCIAL', validatedBody.id.toString(), "تم تسليم الشحنة الى المستلم", 'عفش تجاري');

            case 39:
              res.status(200).send(commercial);
              _context7.next = 46;
              break;

            case 42:
              _context7.prev = 42;
              _context7.t0 = _context7["catch"](0);
              console.log(_context7.t0);
              next(_context7.t0);

            case 46:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[0, 42]]);
    }))();
  },
  validateUpdatePriceCommercial: function validateUpdatePriceCommercial() {
    var validations = [(0, _check.body)('id').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('cost').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  cancelCommercial: function cancelCommercial(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var isAdmin, query, commercial, user;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              isAdmin = req.query.type == 'admin';
              query = {
                deleted: false,
                _id: req.query.id
              };
              _context8.next = 5;
              return _commercial["default"].findOne(query);

            case 5:
              commercial = _context8.sent;
              _context8.next = 8;
              return _user["default"].findOne({
                deleted: false,
                _id: commercial.userId
              });

            case 8:
              user = _context8.sent;
              commercial.canceled = true;
              commercial.latest = false;

              if (!isAdmin) {
                _context8.next = 16;
                break;
              }

              _context8.next = 14;
              return _notif["default"].pushNotification(user, 'COMMERCIAL', query._id.toString(), "\u0642\u0627\u0645 \u0627\u0644\u0645\u0633\u0624\u0644 \u0628\u0631\u0641\u0636 \u0637\u0644\u0628 \u0627\u0644\u0634\u062D\u0646\u0629 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629", 'عفش تجاري');

            case 14:
              _context8.next = 17;
              break;

            case 16:
              (0, _user2.notifyAdmin)('COMMERCIAL', query._id.toString(), "\u0642\u0627\u0645 ".concat(user.name, " \u0628\u0625\u0644\u063A\u0627\u0621 \u0637\u0644\u0628 \u0627\u0644\u0634\u062D\u0646\u0629 \u0627\u0644\u062A\u062C\u0627\u0631\u064A\u0629"), 'عفش تجاري', commercial.From.country == "YE" ? commercial.From.MDR : query.From.city);

            case 17:
              _context8.next = 19;
              return commercial.save();

            case 19:
              res.status(200).send(commercial);
              _context8.next = 26;
              break;

            case 22:
              _context8.prev = 22;
              _context8.t0 = _context8["catch"](0);
              console.log(_context8.t0);
              next(_context8.t0);

            case 26:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[0, 22]]);
    }))();
  }
};
exports["default"] = _default;