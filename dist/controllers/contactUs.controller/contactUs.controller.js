"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _contactUs = _interopRequireDefault(require("../../models/contactUs.model/contactUs.model"));

var _ApiResponse = _interopRequireDefault(require("../../helpers/ApiResponse"));

var _CheckMethods = require("../../helpers/CheckMethods");

var _check = require("express-validator/check");

var _shared = require("../shared.controller/shared.controller");

var _i18n = _interopRequireDefault(require("i18n"));

var _notif = _interopRequireDefault(require("../notif.controller/notif.controller"));

var _socketEvents = _interopRequireDefault(require("../../socketEvents"));

var _emailMessage = require("../../services/emailMessage.service");

// import config from '../../config'
var populateQuery = [{
  path: 'user',
  model: 'user'
}];

var countNotReplied = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var count;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _contactUs["default"].count({
              deleted: false,
              "reply.0": {
                "$exists": false
              }
            });

          case 3:
            count = _context.sent;
            adminNSP.emit(_socketEvents["default"].ContactUsCount, {
              count: count
            });
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function countNotReplied() {
    return _ref.apply(this, arguments);
  };
}();

var _default = {
  find: function find(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var page, limit, _req$query, name, notes, phone, user, firebaseTokenType, query, contactuss, contactussCount, pageCount;

      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              page = +req.query.page || 1, limit = +req.query.limit || 20;
              _req$query = req.query, name = _req$query.name, notes = _req$query.notes, phone = _req$query.phone, user = _req$query.user, firebaseTokenType = _req$query.firebaseTokenType;
              query = {
                deleted: false
              };

              if (name) {
                query.name = {
                  '$regex': name,
                  '$options': 'i'
                };
              }

              if (notes) {
                query.notes = {
                  '$regex': notes,
                  '$options': 'i'
                };
              }

              if (phone) {
                query.phone = {
                  '$regex': phone,
                  '$options': 'i'
                };
              }

              if (user) {
                query.user = user;
              }

              if (firebaseTokenType) {
                query.firebaseTokenType = firebaseTokenType;
              }

              _context2.next = 11;
              return _contactUs["default"].find(query).sort({
                createdAt: -1
              }).populate(populateQuery).limit(limit).skip((page - 1) * limit);

            case 11:
              contactuss = _context2.sent;
              _context2.next = 14;
              return _contactUs["default"].count(query);

            case 14:
              contactussCount = _context2.sent;
              pageCount = Math.ceil(contactussCount / limit);
              res.status(200).send(new _ApiResponse["default"](contactuss, page, pageCount, limit, contactussCount, req));
              _context2.next = 22;
              break;

            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2["catch"](0);
              next(_context2.t0);

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 19]]);
    }))();
  },
  validateBody: function validateBody() {
    var validations = [(0, _check.body)('name').optional().not().isEmpty().withMessage(function () {
      return _i18n["default"].__('nameRequired');
    }), (0, _check.body)('email').optional().not().isEmpty().withMessage(function () {
      return _i18n["default"].__('emailRequired');
    }), (0, _check.body)('notes').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('notesRequired');
    }), (0, _check.body)('phone').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  create: function create(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var validatedBody, contactUs;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              if (req.user) validatedBody.user = req.user.id;
              _context3.next = 5;
              return _contactUs["default"].create(validatedBody);

            case 5:
              contactUs = _context3.sent;
              _context3.next = 8;
              return _contactUs["default"].populate(contactUs, populateQuery);

            case 8:
              contactUs = _context3.sent;
              res.status(200).send(contactUs);
              _context3.next = 12;
              return countNotReplied();

            case 12:
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
  findById: function findById(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var contactUsId, contactUs;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              contactUsId = req.params.contactUsId;
              _context4.next = 4;
              return (0, _CheckMethods.checkExistThenGet)(contactUsId, _contactUs["default"], {
                deleted: false,
                populate: populateQuery
              });

            case 4:
              contactUs = _context4.sent;
              res.status(200).send(contactUs);
              _context4.next = 11;
              break;

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4["catch"](0);
              next(_context4.t0);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 8]]);
    }))();
  },
  "delete": function _delete(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var contactUsId, contactUs;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              contactUsId = req.params.contactUsId;
              _context5.next = 4;
              return (0, _CheckMethods.checkExistThenGet)(contactUsId, _contactUs["default"], {
                deleted: false
              });

            case 4:
              contactUs = _context5.sent;
              contactUs.deleted = true;
              _context5.next = 8;
              return contactUs.save();

            case 8:
              res.status(200).send("Deleted Successfully");
              _context5.next = 14;
              break;

            case 11:
              _context5.prev = 11;
              _context5.t0 = _context5["catch"](0);
              next(_context5.t0);

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 11]]);
    }))();
  },
  validateReply: function validateReply() {
    var validations = [(0, _check.body)('reply').not().isEmpty().withMessage('replyRequired')];
    return validations;
  },
  reply: function reply(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var validatedBody, contactUsId, contactUs, newContactUs;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);
              contactUsId = req.params.contactUsId;
              _context6.next = 5;
              return (0, _CheckMethods.checkExistThenGet)(contactUsId, _contactUs["default"], {
                deleted: false,
                populate: populateQuery
              });

            case 5:
              contactUs = _context6.sent;
              _context6.next = 8;
              return _contactUs["default"].findOneAndUpdate({
                deleted: false,
                _id: contactUsId
              }, {
                $push: {
                  reply: validatedBody.reply
                }
              }, {
                "new": true
              });

            case 8:
              newContactUs = _context6.sent;
              res.status(200).send({
                newContactUs: newContactUs
              });
              _context6.next = 12;
              return _notif["default"].create(req.user.id, newContactUs.user, {
                en: validatedBody.reply,
                ar: validatedBody.reply
              }, newContactUs.id, 'CONTACTUS');

            case 12:
              if (!(req.user.language == 'ar')) {
                _context6.next = 17;
                break;
              }

              _context6.next = 15;
              return _notif["default"].pushNotification(newContactUs.user, 'CONTACTUS', newContactUs.id, validatedBody.reply, process.env.NOTIF_TITLE_AR);

            case 15:
              _context6.next = 19;
              break;

            case 17:
              _context6.next = 19;
              return _notif["default"].pushNotification(newContactUs.user, 'CONTACTUS', newContactUs.id, validatedBody.reply, process.env.NOTIF_TITLE_AR);

            case 19:
              _context6.next = 21;
              return (0, _emailMessage.sendEmail)(contactUs.email, validatedBody.reply);

            case 21:
              _context6.next = 23;
              return countNotReplied();

            case 23:
              _context6.next = 28;
              break;

            case 25:
              _context6.prev = 25;
              _context6.t0 = _context6["catch"](0);
              next(_context6.t0);

            case 28:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[0, 25]]);
    }))();
  },
  countNotReplied: countNotReplied
};
exports["default"] = _default;