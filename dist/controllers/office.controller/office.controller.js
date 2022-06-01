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

var _office = _interopRequireDefault(require("../../models/office.model/office.model"));

var _officeClicks = _interopRequireDefault(require("../../models/officeClicks.model/officeClicks.model"));

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
  validateAddOffice: function validateAddOffice() {
    var validations = [(0, _check.body)('initDate').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('name').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('From').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('phone').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('services').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  addOffice: function addOffice(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var validatedBody, query, office;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              console.log(req);
              validatedBody = (0, _shared.checkValidations)(req);
              query = _objectSpread({}, validatedBody);
              _context2.next = 6;
              return _office["default"].create(query);

            case 6:
              office = _context2.sent;
              res.status(200).send(office);
              _context2.next = 13;
              break;

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](0);
              next(_context2.t0);

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 10]]);
    }))();
  },
  getOffices: function getOffices(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var query, _req$query, id, city, mdr, service, shohnat;

      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              query = {
                deleted: false,
                canceled: false
              };
              _req$query = req.query, id = _req$query.id, city = _req$query.city, mdr = _req$query.mdr, service = _req$query.service;

              if (id) {
                query._id = id;
              }

              if (city) {
                query["From.city"] = city;
              }

              if (mdr) {
                query["From.MDR"] = mdr;
              }

              if (service) {
                query.services = service;
              }

              _context3.next = 9;
              return _office["default"].find(query);

            case 9:
              shohnat = _context3.sent;
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
  setCancelOffice: function setCancelOffice(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var query, office;
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
              return _office["default"].findOne(query);

            case 4:
              office = _context4.sent;
              // if(isAdmin){
              //     await notificationController.pushNotification(user, 'SHOHNAT', query._id.toString(), `قام المسؤل برفض الشحنة`, 'عفش شخصي');
              // }else{
              //     notifyAdmin('SHOHNAT', query._id.toString(),`قام العميل ${user.name} بإلغاء الشحنة`, 'عفش شخصي',shohnat.trnsFrom.country == "YE"?shohnat.trnsFrom.MDR:shohnat.trnsFrom.city)
              // }
              office.canceled = true;
              _context4.next = 8;
              return office.save();

            case 8:
              res.status(200).send(office);
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
  setOfficeClick: function setOfficeClick(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var _req$query2, office, user;

      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _req$query2 = req.query, office = _req$query2.office, user = _req$query2.user;
              _context5.next = 4;
              return _officeClicks["default"].create({
                office: office,
                userId: user
              });

            case 4:
              res.status(200).send("office clicked");
              _context5.next = 11;
              break;

            case 7:
              _context5.prev = 7;
              _context5.t0 = _context5["catch"](0);
              console.log(_context5.t0);
              next(_context5.t0);

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 7]]);
    }))();
  }
};
exports["default"] = _default;