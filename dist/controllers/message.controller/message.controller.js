"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _message = _interopRequireDefault(require("../../models/message.model/message.model"));

var _CheckMethods = require("../../helpers/CheckMethods");

var _shared = require("../shared.controller/shared.controller");

var _user = _interopRequireDefault(require("../../models/user.model/user.model"));

var _socketEvents = _interopRequireDefault(require("../../socketEvents"));

var _check = require("express-validator/check");

var _shared2 = require("../../controllers/shared.controller/shared.controller");

var _i18n = _interopRequireDefault(require("i18n"));

var _ApiError = _interopRequireDefault(require("../../helpers/ApiError"));

var _notif = _interopRequireDefault(require("../notif.controller/notif.controller"));

var _ApiResponse = _interopRequireDefault(require("../../helpers/ApiResponse"));

// let popQuery = [{ path: 'sender', model: 'user' }, { path: 'receiver', model: 'user' }]
var countUnseen = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(id) {
    var query, chatCount;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            query = {
              deleted: false,
              'reciver.user': id,
              'reciver.read': false
            };
            _context.next = 4;
            return _message["default"].count(query);

          case 4:
            chatCount = _context.sent;
            chatNSP.to('room-' + id).emit(_socketEvents["default"].NewMessageCount, {
              chatCount: chatCount
            });
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function countUnseen(_x) {
    return _ref.apply(this, arguments);
  };
}();

var handelNewMessageSocket = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(message) {
    var text;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return countUnseen(message.reciver.user.id);

          case 3:
            chatNSP.to('room-' + message.reciver.user.id).emit(_socketEvents["default"].NewMessage, {
              message: message
            });

            if (!(message.reciver.user.activeChatHead == false)) {
              _context2.next = 8;
              break;
            }

            text = message.message.text ? {
              en: message.message.text,
              ar: message.message.text
            } : {
              en: 'New Message',
              ar: ' رسالة جديدة'
            };
            _context2.next = 8;
            return _notif["default"].pushNotification(message.reciver.user.id, 'MESSAGE', message.sender.id, text[message.reciver.user.language]);

          case 8:
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 10]]);
  }));

  return function handelNewMessageSocket(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var updateSeen = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(user, friend) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _message["default"].updateMany({
              deleted: false,
              'reciver.user': user,
              'reciver.read': false,
              sender: friend
            }, {
              $set: {
                'reciver.read': true,
                'reciver.readDate': new Date()
              }
            });

          case 3:
            _context3.next = 5;
            return countUnseen(user);

          case 5:
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            throw _context3.t0;

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function updateSeen(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var createMessage = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(user, receiver, text) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function createMessage(_x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

var _default = {
  validate: function validate() {
    var validation = [(0, _check.body)('text').optional().not().isEmpty().withMessage(function () {
      return _i18n["default"].__('messageRequired');
    }), (0, _check.body)('receiver').optional().not().isEmpty().withMessage(function () {
      return _i18n["default"].__('reciverRequired');
    })];
    return validation;
  },
  create: function create(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var data, user, message, friend, file, createdMessage;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              // let user = req.user;
              data = (0, _shared2.checkValidations)(req);
              user = data.sender;

              if (!(data.sender == data.receiver)) {
                _context5.next = 5;
                break;
              }

              return _context5.abrupt("return", next(new _ApiError["default"](400, _i18n["default"].__('invalidReciver'))));

            case 5:
              if (!data.reciver) {
                _context5.next = 12;
                break;
              }

              _context5.next = 8;
              return (0, _CheckMethods.checkExistThenGet)(data.reciver, _user["default"], {
                deleted: false
              });

            case 8:
              friend = _context5.sent;
              message = {
                reciver: {
                  user: friend.id
                },
                sender: user.id,
                message: {}
              };
              _context5.next = 13;
              break;

            case 12:
              message = {
                sender: user.id,
                message: {}
              };

            case 13:
              if (data.text || req.file) {
                _context5.next = 15;
                break;
              }

              return _context5.abrupt("return", next(new _ApiError["default"](404, _i18n["default"].__('messageRequired'))));

            case 15:
              if (data.text) {
                message.message.text = data.text;
              }

              if (!req.file) {
                _context5.next = 31;
                break;
              }

              file = (0, _shared.handleImg)(req, {
                attributeName: 'file'
              });

              if (!req.file.mimetype.includes('image/')) {
                _context5.next = 22;
                break;
              }

              message.message.image = file;
              _context5.next = 31;
              break;

            case 22:
              if (!req.file.mimetype.includes('video/')) {
                _context5.next = 26;
                break;
              }

              message.message.video = file;
              _context5.next = 31;
              break;

            case 26:
              if (!req.file.mimetype.includes('application/')) {
                _context5.next = 30;
                break;
              }

              message.message.document = file;
              _context5.next = 31;
              break;

            case 30:
              return _context5.abrupt("return", next(new _ApiError["default"](404, _i18n["default"].__('fileTypeError'))));

            case 31:
              message.lastMessage = true;
              _context5.next = 34;
              return _message["default"].create(message);

            case 34:
              createdMessage = _context5.sent;
              _context5.next = 37;
              return _message["default"].populate(createdMessage, popQuery);

            case 37:
              createdMessage = _context5.sent;
              res.status(200).send(createdMessage);

              if (!data.reciver) {
                _context5.next = 45;
                break;
              }

              _context5.next = 42;
              return _message["default"].updateMany({
                deleted: false,
                _id: {
                  $ne: createdMessage.id
                },
                $or: [{
                  sender: user.id,
                  'reciver.user': friend.id
                }, {
                  sender: friend.id,
                  'reciver.user': user.id
                }]
              }, {
                $set: {
                  lastMessage: false
                }
              });

            case 42:
              handelNewMessageSocket(createdMessage);
              _context5.next = 46;
              break;

            case 45:
              adminNSP.emit(_socketEvents["default"].NEWHELPMESSAGE, {
                message: createdMessage
              });

            case 46:
              _context5.next = 51;
              break;

            case 48:
              _context5.prev = 48;
              _context5.t0 = _context5["catch"](0);
              next(_context5.t0);

            case 51:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[0, 48]]);
    }))();
  },
  getById: function getById(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var id, message;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              id = req.params.id;
              _context6.next = 4;
              return (0, _CheckMethods.checkExistThenGet)(id, _message["default"], {
                deleted: false
              });

            case 4:
              message = _context6.sent;
              res.status(200).send(message);
              _context6.next = 11;
              break;

            case 8:
              _context6.prev = 8;
              _context6.t0 = _context6["catch"](0);
              next(_context6.t0);

            case 11:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[0, 8]]);
    }))();
  },
  deleteForEveryOne: function deleteForEveryOne(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var id, message;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              id = req.params.id;
              _context7.next = 4;
              return (0, _CheckMethods.checkExistThenGet)(id, _message["default"], {
                deleted: false
              });

            case 4:
              message = _context7.sent;
              message.deleted = true;
              _context7.next = 8;
              return message.save();

            case 8:
              res.status(200).send('Deleted');
              _context7.next = 14;
              break;

            case 11:
              _context7.prev = 11;
              _context7.t0 = _context7["catch"](0);
              next(_context7.t0);

            case 14:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[0, 11]]);
    }))();
  },
  getLastContacts: function getLastContacts(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var user, page, limit, query, messages, resolveData, data, length, index, sender, resolveResult, _index, messagesCount, pageCount;

      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              user = req.query.userId;
              page = +req.query.page || 1, limit = +req.query.limit || 20;
              query = {
                deleted: false,
                lastMessage: true,
                $or: [{
                  sender: +user,
                  'reciver.user': {
                    $ne: null
                  }
                }, {
                  'reciver.user': +user,
                  sender: {
                    $ne: null
                  }
                }]
              };
              _context8.next = 6;
              return _message["default"].find(query).populate(popQuery).sort({
                _id: -1
              }).limit(limit).skip((page - 1) * limit);

            case 6:
              messages = _context8.sent;
              resolveData = [];
              data = [];
              length = messages.length;

              for (index = 0; index < length; index++) {
                sender = messages[index].sender.id != user ? messages[index].sender.id : messages[index].reciver.user.id;
                resolveData.push((0, _shared.createPromise)(_message["default"].count({
                  deleted: false,
                  'reciver.read': false,
                  'reciver.user': +user,
                  sender: sender
                })));
              }

              _context8.next = 13;
              return Promise.all(resolveData);

            case 13:
              resolveResult = _context8.sent;

              for (_index = 0; _index < length; _index++) {
                data.push({
                  message: messages[_index],
                  unReadCount: resolveResult[_index]
                });
              }

              messages = data;
              _context8.next = 18;
              return _message["default"].count(query);

            case 18:
              messagesCount = _context8.sent;
              pageCount = Math.ceil(messagesCount / limit);
              res.send(new _ApiResponse["default"](messages, page, pageCount, limit, messagesCount, req));
              _context8.next = 26;
              break;

            case 23:
              _context8.prev = 23;
              _context8.t0 = _context8["catch"](0);
              next(_context8.t0);

            case 26:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[0, 23]]);
    }))();
  },
  getChatHistory: function getChatHistory(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var user, friend, page, limit, query, chats, chatCount, pageCount;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              user = req.user.id;
              friend = req.query.friend;
              page = +req.query.page || 1, limit = +req.query.limit || 20;
              query = {
                deleted: false,
                $or: [{
                  sender: user,
                  'reciver.user': friend
                }, {
                  sender: friend,
                  'reciver.user': user
                }]
              };
              _context9.next = 7;
              return _message["default"].find(query).populate(popQuery).sort({
                _id: -1
              }).limit(limit).skip((page - 1) * limit);

            case 7:
              chats = _context9.sent;
              _context9.next = 10;
              return _message["default"].count(query);

            case 10:
              chatCount = _context9.sent;
              pageCount = Math.ceil(chatCount / limit);
              res.send(new _ApiResponse["default"](chats, page, pageCount, limit, chatCount, req));
              _context9.next = 15;
              return _message["default"].updateMany({
                deleted: false,
                sender: friend,
                'reciver.user': user,
                'reciver.read': false
              }, {
                $set: {
                  'reciver.read': true,
                  'reciver.readDate': new Date()
                }
              });

            case 15:
              _context9.next = 20;
              break;

            case 17:
              _context9.prev = 17;
              _context9.t0 = _context9["catch"](0);
              next(_context9.t0);

            case 20:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[0, 17]]);
    }))();
  },
  ///////////////////////// Admin ////////////////////////////
  adminChat: function adminChat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
      var user, page, limit, query, messages, messagesCount, pageCount;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.prev = 0;
              user = req.user;
              page = +req.query.page || 1, limit = +req.query.limit || 20;
              query = {
                deleted: false,
                lastMessage: true,
                'reciver.user': {
                  $ne: null
                },
                sender: {
                  $ne: null
                }
              };
              _context10.next = 6;
              return _message["default"].find(query).populate(popQuery).sort({
                _id: -1
              }).limit(limit).skip((page - 1) * limit);

            case 6:
              messages = _context10.sent;
              _context10.next = 9;
              return _message["default"].count(query);

            case 9:
              messagesCount = _context10.sent;
              pageCount = Math.ceil(messagesCount / limit);
              res.send(new _ApiResponse["default"](messages, page, pageCount, limit, messagesCount, req));
              _context10.next = 17;
              break;

            case 14:
              _context10.prev = 14;
              _context10.t0 = _context10["catch"](0);
              next(_context10.t0);

            case 17:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, null, [[0, 14]]);
    }))();
  },
  getChatHistoryForAdmin: function getChatHistoryForAdmin(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      var _req$query, friend, user, page, limit, query, chats, chatCount, pageCount;

      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;
              _req$query = req.query, friend = _req$query.friend, user = _req$query.user;
              page = +req.query.page || 1, limit = +req.query.limit || 20;
              query = {
                deleted: false,
                $or: [{
                  sender: user,
                  'reciver.user': friend
                }, {
                  sender: friend,
                  'reciver.user': user
                }]
              };
              _context11.next = 6;
              return _message["default"].find(query).populate(popQuery).sort({
                _id: -1
              }).limit(limit).skip((page - 1) * limit);

            case 6:
              chats = _context11.sent;
              _context11.next = 9;
              return _message["default"].count(query);

            case 9:
              chatCount = _context11.sent;
              pageCount = Math.ceil(chatCount / limit);
              res.send(new _ApiResponse["default"](chats, page, pageCount, limit, chatCount, req));
              _context11.next = 17;
              break;

            case 14:
              _context11.prev = 14;
              _context11.t0 = _context11["catch"](0);
              next(_context11.t0);

            case 17:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, null, [[0, 14]]);
    }))();
  },
  ////////////////////////// Help center //////////////////////
  getMyHelpCenterChat: function getMyHelpCenterChat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      var user, page, limit, query, messages, messagesCount, pageCount;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.prev = 0;
              user = req.user;
              page = +req.query.page || 1, limit = +req.query.limit || 20;
              query = {};

              if (!(req.user.type == 'ADMIN' || req.user.type == 'SUB_ADMIN')) {
                _context12.next = 13;
                break;
              }

              if (req.query.user) {
                _context12.next = 7;
                break;
              }

              return _context12.abrupt("return", next(new _ApiError["default"](404, _i18n["default"].__('userRequired'))));

            case 7:
              _context12.next = 9;
              return (0, _CheckMethods.checkExistThenGet)(+req.query.user, _user["default"], {
                deleted: false
              });

            case 9:
              user = _context12.sent;
              query = {
                deleted: false,
                $or: [{
                  sender: user.id,
                  'reciver.user': null
                }, {
                  sender: null,
                  'reciver.user': user.id
                }]
              };
              _context12.next = 14;
              break;

            case 13:
              query = {
                deleted: false,
                $or: [{
                  sender: user.id,
                  'reciver.user': null
                }, {
                  sender: null,
                  'reciver.user': user.id
                }]
              };

            case 14:
              _context12.next = 16;
              return _message["default"].find(query).populate(popQuery).sort({
                _id: -1
              }).limit(limit).skip((page - 1) * limit);

            case 16:
              messages = _context12.sent;
              _context12.next = 19;
              return _message["default"].count(query);

            case 19:
              messagesCount = _context12.sent;
              pageCount = Math.ceil(messagesCount / limit);
              res.send(new _ApiResponse["default"](messages, page, pageCount, limit, messagesCount, req));
              _context12.next = 24;
              return _message["default"].updateMany({
                deleted: false,
                sender: null,
                'reciver.user': user,
                'reciver.read': false
              }, {
                $set: {
                  'reciver.read': true,
                  'reciver.readDate': new Date()
                }
              });

            case 24:
              _context12.next = 29;
              break;

            case 26:
              _context12.prev = 26;
              _context12.t0 = _context12["catch"](0);
              next(_context12.t0);

            case 29:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, null, [[0, 26]]);
    }))();
  },
  adminReplyHelpCenterChat: function adminReplyHelpCenterChat(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
      var user, data, message, friend, file, createdMessage;
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.prev = 0;
              user = req.user;
              data = (0, _shared2.checkValidations)(req);

              if (data.reciver) {
                _context13.next = 5;
                break;
              }

              return _context13.abrupt("return", next(new _ApiError["default"](400, _i18n["default"].__('reciverRequired'))));

            case 5:
              _context13.next = 7;
              return (0, _CheckMethods.checkExistThenGet)(data.reciver, _user["default"], {
                deleted: false
              });

            case 7:
              friend = _context13.sent;
              message = {
                reciver: {
                  user: friend.id
                },
                admin: user.id,
                message: {}
              };

              if (data.text || req.file) {
                _context13.next = 11;
                break;
              }

              return _context13.abrupt("return", next(new _ApiError["default"](404, _i18n["default"].__('messageRequired'))));

            case 11:
              if (data.text) {
                message.message.text = data.text;
              }

              if (!req.file) {
                _context13.next = 27;
                break;
              }

              file = (0, _shared.handleImg)(req, {
                attributeName: 'file'
              });

              if (!req.file.mimetype.includes('image/')) {
                _context13.next = 18;
                break;
              }

              message.message.image = file;
              _context13.next = 27;
              break;

            case 18:
              if (!req.file.mimetype.includes('video/')) {
                _context13.next = 22;
                break;
              }

              message.message.video = file;
              _context13.next = 27;
              break;

            case 22:
              if (!req.file.mimetype.includes('application/')) {
                _context13.next = 26;
                break;
              }

              message.message.document = file;
              _context13.next = 27;
              break;

            case 26:
              return _context13.abrupt("return", next(new _ApiError["default"](404, _i18n["default"].__('fileTypeError'))));

            case 27:
              _context13.next = 29;
              return _message["default"].create(message);

            case 29:
              createdMessage = _context13.sent;
              _context13.next = 32;
              return _message["default"].populate(createdMessage, popQuery);

            case 32:
              createdMessage = _context13.sent;
              res.status(200).send({
                message: createdMessage
              });
              createdMessage.sender = req.user;
              handelNewMessageSocket(createdMessage);
              _context13.next = 41;
              break;

            case 38:
              _context13.prev = 38;
              _context13.t0 = _context13["catch"](0);
              next(_context13.t0);

            case 41:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, null, [[0, 38]]);
    }))();
  },
  countUnseen: countUnseen,
  updateSeen: updateSeen // countUnseenForAdmin

  /*.aggregate()
                                      .match(query)
                                      .addFields({'reciverUser':"$reciver.user" , 'reciverRead':"$reciver.read" })
                                      .group({_id:'$_id', unReadCount: {$sum:{ $cond: [{$and:[{'reciverUser': +user.id},{'reciverRead':false}]},1, 0] } } });
                                      // .group({_id:{case_1: {sender : +user.id , reciver : '$reciver.user' } , case_2 :{} },  unReadCount: {$sum:{ $cond: [{$and:[{'reciverUser': +user.id},{'reciverRead':false}]},1, 0] } } });
  */

}; // async getChatHistory(req, res, next) {
//     try {
//         let user = req.user.id;
//         let {friend} = req.query;
//         let page = +req.query.page || 1,
//             limit = +req.query.limit || 20;
//         let query = {
//             deleted: false,
//             $or: [{ sender: user ,'reciver.user':friend},
//                   {sender: friend ,  'reciver.user': user }
//             ]
//         };
//         await Message.updateMany({ deleted: false, 'reciver.user': user ,'reciver.read':false}, { $set: { 'reciver.read': true, 'reciver.readDate': new Date() } })
//         var chats = await Message.find(query).populate(popQuery).sort({ _id: -1 }).limit(limit).skip((page - 1) * limit);
//         const chatCount = await Message.count(query);
//         const pageCount = Math.ceil(chatCount / limit);
//         res.send(new ApiResponse(chats, page, pageCount, limit, chatCount, req));
//     } catch (error) {
//         next(error)
//     }
// },
// let countUnseenForAdmin = async ()=>{
//     try {
//         let query = {
//             deleted: false,
//             'reciver.user': null,
//             'reciver.read': false,
//             lastMessage: true
//         };
//         const chatCount = await Message.count(query);
//         chatNSP.to('room-admin').emit(SocketEvents.NewMessageCount, {count:chatCount });
//     } catch (error) {
//         throw error ;
//     }
// }

exports["default"] = _default;