"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _chat = _interopRequireDefault(require("../../models/chat.model/chat.model"));

var _chatMessages = _interopRequireDefault(require("../../models/chatMessages.model/chatMessages.model"));

var _notif = _interopRequireDefault(require("../notif.controller/notif.controller"));

var _user = _interopRequireDefault(require("../../models/user.model/user.model"));

var _ApiResponse = _interopRequireDefault(require("../../helpers/ApiResponse"));

var _CheckMethods = require("../../helpers/CheckMethods");

var _check = require("express-validator/check");

var _shared = require("../shared.controller/shared.controller");

var _i18n = _interopRequireDefault(require("i18n"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// import config from '../../config'
var populateQuery = [{
  path: 'user',
  model: 'user'
}];
var _default = {
  validateInitiate: function validateInitiate() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('receiver').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  initiate: function initiate(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var validation, userId, receiver, user, admin, chatRoom;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              validation = (0, _shared.checkValidations)(req);
              userId = validation.userId, receiver = validation.receiver;
              _context.next = 5;
              return _user["default"].findOne({
                deleted: false,
                _id: userId
              });

            case 5:
              user = _context.sent;

              if (!user) {
                _context.next = 14;
                break;
              }

              admin = user.type == 'ADMIN' ? true : false;
              _context.next = 10;
              return _chat["default"].initiateChat(receiver, userId, admin);

            case 10:
              chatRoom = _context.sent;
              res.status(200).send(chatRoom);
              _context.next = 15;
              break;

            case 14:
              next('user_error');

            case 15:
              _context.next = 20;
              break;

            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](0);
              next(_context.t0);

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 17]]);
    }))();
  },
  validatePostMessage: function validatePostMessage() {
    var validations = [(0, _check.body)('userId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('messageText').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    }), (0, _check.body)('roomId').not().isEmpty().withMessage(function () {
      return _i18n["default"].__('phoneRequired');
    })];
    return validations;
  },
  postMessage: function postMessage(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var validation, chatRoomId, room, text, user, sender, post, sendId, sendTo, adminCheck, sendTO;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              validation = (0, _shared.checkValidations)(req);
              chatRoomId = validation.roomId;
              _context2.next = 5;
              return _chat["default"].findOne({
                _id: chatRoomId
              });

            case 5:
              room = _context2.sent;
              text = validation.messageText;
              user = validation.userId;
              _context2.next = 10;
              return _user["default"].findOne({
                deleted: false,
                _id: user
              });

            case 10:
              sender = _context2.sent;

              if (!sender.banded) {
                _context2.next = 15;
                break;
              }

              res.status(202).send({
                banded: true
              });
              _context2.next = 34;
              break;

            case 15:
              _context2.next = 17;
              return _chatMessages["default"].create({
                _id: false,
                chatRoomId: chatRoomId,
                text: text,
                user: user,
                sent: true,
                received: false
              });

            case 17:
              post = _context2.sent;
              sendId = 0;

              if (room.receiver == user) {
                sendId = room.chatInitiator;
              } else {
                sendId = room.receiver;
              }

              _context2.next = 22;
              return _user["default"].findOne({
                deleted: false,
                _id: sendId
              }, 'type');

            case 22:
              sendTo = _context2.sent;
              adminCheck = false;
              if (sendTo.type == "ADMIN") adminCheck = true;

              if (adminCheck) {
                chatNSP.to('room-admin' + sendId).emit('NewMessage', {
                  data: post
                });
              } else {
                chatNSP.to('room-' + sendId).emit('NewMessage', {
                  data: post
                });
              }

              _context2.next = 28;
              return _user["default"].findOne({
                deleted: false,
                _id: sendId
              });

            case 28:
              sendTO = _context2.sent;
              _context2.next = 31;
              return exports["default"].getCountChat(sendTO.id, adminCheck);

            case 31:
              _context2.next = 33;
              return _notif["default"].pushNotification(sendTO, 'MESSAGE', chatRoomId, text, sender.name);

            case 33:
              res.status(200).send(post);

            case 34:
              _context2.next = 39;
              break;

            case 36:
              _context2.prev = 36;
              _context2.t0 = _context2["catch"](0);
              next(_context2.t0);

            case 39:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 36]]);
    }))();
  },
  getRecentConversation: function getRecentConversation(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var currentLoggedUser, options, user, admin, rooms, roomreturn, _iterator, _step, room, newRoom;

      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              currentLoggedUser = req.query.userId;
              options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10
              };
              _context3.next = 5;
              return _user["default"].findOne({
                deleted: false,
                _id: currentLoggedUser
              });

            case 5:
              user = _context3.sent;

              if (!user) {
                _context3.next = 49;
                break;
              }

              admin = false;
              if (user.type == 'ADMIN') admin = true;
              _context3.next = 11;
              return _chat["default"].getChatRoomsByUserId(currentLoggedUser, admin);

            case 11:
              rooms = _context3.sent;
              roomreturn = [];
              _iterator = _createForOfIteratorHelper(rooms);
              _context3.prev = 14;

              _iterator.s();

            case 16:
              if ((_step = _iterator.n()).done) {
                _context3.next = 38;
                break;
              }

              room = _step.value;
              newRoom = {};

              if (!(room.receiver != currentLoggedUser)) {
                _context3.next = 25;
                break;
              }

              _context3.next = 22;
              return _user["default"].findOne({
                deleted: false,
                _id: room.receiver
              }, 'id name');

            case 22:
              newRoom['receiver'] = _context3.sent;
              _context3.next = 28;
              break;

            case 25:
              _context3.next = 27;
              return _user["default"].findOne({
                deleted: false,
                _id: room.chatInitiator
              }, 'id name');

            case 27:
              newRoom['receiver'] = _context3.sent;

            case 28:
              _context3.next = 30;
              return _chatMessages["default"].findOne({
                chatRoomId: room.id
              }, 'text').sort({
                createdAt: -1
              });

            case 30:
              newRoom['lastMessage'] = _context3.sent;
              _context3.next = 33;
              return _chatMessages["default"].countDocuments({
                user: {
                  $ne: currentLoggedUser
                },
                chatRoomId: room.id,
                received: false
              });

            case 33:
              newRoom['count'] = _context3.sent;
              newRoom['id'] = room.id;
              roomreturn.push(newRoom);

            case 36:
              _context3.next = 16;
              break;

            case 38:
              _context3.next = 43;
              break;

            case 40:
              _context3.prev = 40;
              _context3.t0 = _context3["catch"](14);

              _iterator.e(_context3.t0);

            case 43:
              _context3.prev = 43;

              _iterator.f();

              return _context3.finish(43);

            case 46:
              res.status(200).send(roomreturn);
              _context3.next = 50;
              break;

            case 49:
              next('user_error');

            case 50:
              _context3.next = 55;
              break;

            case 52:
              _context3.prev = 52;
              _context3.t1 = _context3["catch"](0);
              next(_context3.t1);

            case 55:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 52], [14, 40, 43, 46]]);
    }))();
  },
  getConversationByRoomId: function getConversationByRoomId(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var _req$query, roomId, userId, receiver, room, page, limit, conversation, chatCount, pageCount;

      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _req$query = req.query, roomId = _req$query.roomId, userId = _req$query.userId;
              console.log(roomId);
              if (roomId == 'undefined') next('roomID');
              receiver = {};
              _context4.next = 7;
              return _chat["default"].getChatRoomByRoomId(roomId);

            case 7:
              room = _context4.sent;

              if (!room) {
                next();
              } // const receiver = await User.find(room.userIds


              console.log(room);

              if (!userId) {
                _context4.next = 20;
                break;
              }

              if (!(room.receiver != userId)) {
                _context4.next = 17;
                break;
              }

              _context4.next = 14;
              return _user["default"].findOne({
                deleted: false,
                _id: room.receiver
              }, 'id name');

            case 14:
              receiver = _context4.sent;
              _context4.next = 20;
              break;

            case 17:
              _context4.next = 19;
              return _user["default"].findOne({
                deleted: false,
                _id: room.chatInitiator
              }, 'id name');

            case 19:
              receiver = _context4.sent;

            case 20:
              page = parseInt(req.query.page) || 0;
              limit = parseInt(req.query.limit) || 20;
              _context4.next = 24;
              return _chatMessages["default"].find({
                chatRoomId: roomId
              }).skip(limit * page).limit(limit).sort({
                createdAt: -1
              });

            case 24:
              conversation = _context4.sent;
              _context4.next = 27;
              return _chatMessages["default"].countDocuments({
                chatRoomId: roomId
              });

            case 27:
              chatCount = _context4.sent;
              pageCount = Math.ceil(chatCount / limit);
              res.status(200).send({
                conversation: conversation,
                pageCount: pageCount,
                receiver: receiver
              });
              _context4.next = 35;
              break;

            case 32:
              _context4.prev = 32;
              _context4.t0 = _context4["catch"](0);
              next(_context4.t0);

            case 35:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 32]]);
    }))();
  },
  getCountChat: function getCountChat(id) {
    var _arguments = arguments;
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var admin, toRoom, counter, rooms, _iterator2, _step2, room;

      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              admin = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : false;
              _context5.prev = 1;
              toRoom = id;
              counter = 0;
              _context5.next = 6;
              return _chat["default"].getChatRoomsByUserId(id, admin);

            case 6:
              rooms = _context5.sent;
              _iterator2 = _createForOfIteratorHelper(rooms);
              _context5.prev = 8;

              _iterator2.s();

            case 10:
              if ((_step2 = _iterator2.n()).done) {
                _context5.next = 18;
                break;
              }

              room = _step2.value;
              _context5.t0 = counter;
              _context5.next = 15;
              return _chatMessages["default"].countDocuments({
                user: {
                  $ne: id
                },
                chatRoomId: room.id,
                received: false
              });

            case 15:
              counter = _context5.t0 += _context5.sent;

            case 16:
              _context5.next = 10;
              break;

            case 18:
              _context5.next = 23;
              break;

            case 20:
              _context5.prev = 20;
              _context5.t1 = _context5["catch"](8);

              _iterator2.e(_context5.t1);

            case 23:
              _context5.prev = 23;

              _iterator2.f();

              return _context5.finish(23);

            case 26:
              console.log(counter);
              console.log(admin);

              if (!admin) {
                chatNSP.to('room-' + toRoom).emit("NewMessageCount", {
                  count: counter
                });
              } else {
                chatNSP.to('room-admin' + toRoom).emit("NewMessageCount", {
                  count: counter
                });
              }

              _context5.next = 34;
              break;

            case 31:
              _context5.prev = 31;
              _context5.t2 = _context5["catch"](1);
              console.log(_context5.t2.message);

            case 34:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[1, 31], [8, 20, 23, 26]]);
    }))();
  },
  markConversationReadByRoomId: function markConversationReadByRoomId(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var roomId, currentLoggedUser, receiverId, user, receiver, room, result, admin;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              console.log(req.body);
              roomId = req.body.roomId;
              currentLoggedUser = req.body.userId;
              receiverId = req.body.receiverId;
              _context6.next = 7;
              return _user["default"].findOne({
                deleted: false,
                _id: currentLoggedUser
              });

            case 7:
              user = _context6.sent;
              _context6.next = 10;
              return _user["default"].findOne({
                deleted: false,
                _id: receiverId
              });

            case 10:
              receiver = _context6.sent;
              _context6.next = 13;
              return _chat["default"].getChatRoomByRoomId(roomId);

            case 13:
              room = _context6.sent;

              if (room) {
                _context6.next = 18;
                break;
              }

              next('No room exists for this id');
              _context6.next = 28;
              break;

            case 18:
              _context6.next = 20;
              return _chatMessages["default"].updateMany({
                'chatRoomId': roomId,
                'user': {
                  $ne: currentLoggedUser
                }
              }, {
                received: true
              }, {
                multi: true
              });

            case 20:
              result = _context6.sent;
              admin = false;
              if (receiver.type == 'ADMIN') admin = true;
              console.log(admin);
              _context6.next = 26;
              return exports["default"].getCountChat(currentLoggedUser, !admin);

            case 26:
              if (!admin) {
                chatNSP.to('room-' + receiverId).emit("MarkAsRead", {
                  roomId: roomId
                });
              } else {
                chatNSP.to('room-admin' + receiverId).emit("MarkAsRead", {
                  roomId: roomId
                });
              }

              return _context6.abrupt("return", res.status(200).send(result));

            case 28:
              _context6.next = 34;
              break;

            case 30:
              _context6.prev = 30;
              _context6.t0 = _context6["catch"](0);
              console.log(_context6.t0);
              next(_context6.t0);

            case 34:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[0, 30]]);
    }))();
  }
};
exports["default"] = _default;