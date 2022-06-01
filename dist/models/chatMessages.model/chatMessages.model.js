"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _mongooseI18nLocalize = _interopRequireDefault(require("mongoose-i18n-localize"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var autoIncrementSQ = require('mongoose-sequence')(_mongoose["default"]);

var MESSAGE_TYPES = {
  TYPE_TEXT: "text"
};
var chatMessageSchema = new _mongoose["default"].Schema({
  _id: {
    type: Number,
    required: true
  },
  chatRoomId: {
    type: Number,
    ref: 'Chat'
  },
  text: String,
  type: {
    type: String,
    "default": function _default() {
      return MESSAGE_TYPES.TYPE_TEXT;
    }
  },
  user: {
    type: Number,
    ref: 'user'
  },
  system: {
    type: Boolean,
    "default": false
  },
  sent: {
    type: Boolean,
    "default": true
  },
  received: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true,
  collection: "chatmessages"
});
chatMessageSchema.index({
  chatRoomId: 1
});
chatMessageSchema.index({
  user: 1
});
/**
 * This method will create a post in chat
 *
 * @param {String} roomId - id of chat room
 * @param {String} message - message you want to post in the chat room
 * @param {String} postedByUser - user who is posting the message
 */

chatMessageSchema.statics.createPostInChatRoom = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(chatRoomId, text, user) {
    var system,
        post,
        aggregate,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            system = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;
            _context.prev = 1;
            _context.next = 4;
            return this.create({
              _id: false,
              chatRoomId: chatRoomId,
              text: text,
              user: user,
              system: system
            });

          case 4:
            post = _context.sent;
            _context.next = 7;
            return this.aggregate([// get post where _id = post._id
            {
              $match: {
                _id: post._id
              }
            }, // do a join on another table called users, and
            // get me a user whose _id = postedByUser
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
              }
            }, {
              $unwind: '$user'
            }, // do a join on another table called chatrooms, and
            // get me a chatroom whose _id = chatRoomId
            {
              $lookup: {
                from: 'chatrooms',
                localField: 'chatRoomId',
                foreignField: '_id',
                as: 'chatRoomInfo'
              }
            }, {
              $unwind: '$chatRoomInfo'
            }, // group data
            {
              $group: {
                _id: '$chatRoomInfo._id',
                postId: {
                  $last: '$_id'
                },
                chatRoomId: {
                  $last: '$chatRoomInfo._id'
                },
                text: {
                  $last: '$text'
                },
                type: {
                  $last: '$type'
                },
                user: {
                  $last: 'user'
                },
                system: {
                  $last: 'system'
                },
                sent: {
                  $last: 'sent'
                },
                received: {
                  $last: 'received'
                },
                createdAt: {
                  $last: '$createdAt'
                },
                updatedAt: {
                  $last: '$updatedAt'
                }
              }
            }]);

          case 7:
            aggregate = _context.sent;
            console.log(aggregate);
            return _context.abrupt("return", aggregate[0]);

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](1);
            throw _context.t0;

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 12]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @param {Number} chatRoomId - chat room id
 */


chatMessageSchema.statics.getConversationByRoomId = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(chatRoomId) {
    var options,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            _context2.prev = 1;
            console.log(chatRoomId);
            return _context2.abrupt("return", this.aggregate([{
              $match: {
                chatRoomId: chatRoomId
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, // do a join on another table called users, and
            // get me a user whose _id = postedByUser
            {
              $lookup: {
                from: 'users',
                localField: 'postedByUser',
                foreignField: '_id',
                as: 'postedByUser'
              }
            }, {
              $unwind: "$postedByUser"
            }, // apply pagination
            {
              $skip: options.page * options.limit
            }, {
              $limit: options.limit
            }, {
              $sort: {
                createdAt: 1
              }
            }]));

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](1);
            console.log(_context2.t0);
            throw _context2.t0;

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 6]]);
  }));

  return function (_x4) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @param {String} chatRoomId - chat room id
 * @param {String} currentUserOnlineId - user id
 */


chatMessageSchema.statics.markMessageRead = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(chatRoomId, currentUserOnlineId) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            return _context3.abrupt("return", this.updateMany({
              chatRoomId: chatRoomId,
              'readByRecipients.readByUserId': {
                $ne: currentUserOnlineId
              }
            }, {
              $addToSet: {
                readByRecipients: {
                  readByUserId: currentUserOnlineId
                }
              }
            }, {
              multi: true
            }));

          case 4:
            _context3.prev = 4;
            _context3.t0 = _context3["catch"](0);
            throw _context3.t0;

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 4]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @param {Array} chatRoomIds - chat room ids
 * @param {{ page, limit }} options - pagination options
 * @param {String} currentUserOnlineId - user id
 */


chatMessageSchema.statics.getRecentConversation = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(chatRoomIds, options, currentUserOnlineId) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            return _context4.abrupt("return", this.aggregate([{
              $match: {
                chatRoomId: {
                  $in: chatRoomIds
                }
              }
            }, {
              $group: {
                _id: '$chatRoomId',
                messageId: {
                  $last: '$_id'
                },
                chatRoomId: {
                  $last: '$chatRoomId'
                },
                message: {
                  $last: '$message'
                },
                type: {
                  $last: '$type'
                },
                postedByUser: {
                  $last: '$postedByUser'
                },
                createdAt: {
                  $last: '$createdAt'
                },
                readByRecipients: {
                  $last: '$readByRecipients'
                }
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }, // do a join on another table called users, and
            // get me a user whose _id = postedByUser
            {
              $lookup: {
                from: 'users',
                localField: 'postedByUser',
                foreignField: '_id',
                as: 'postedByUser'
              }
            }, {
              $unwind: "$postedByUser"
            }, // do a join on another table called chatrooms, and
            // get me room details
            {
              $lookup: {
                from: 'chatrooms',
                localField: '_id',
                foreignField: '_id',
                as: 'roomInfo'
              }
            }, {
              $unwind: "$roomInfo"
            }, {
              $unwind: "$roomInfo.userIds"
            }, // do a join on another table called users
            {
              $lookup: {
                from: 'users',
                localField: 'roomInfo.userIds',
                foreignField: '_id',
                as: 'roomInfo.userProfile'
              }
            }, {
              $unwind: "$readByRecipients"
            }, // do a join on another table called users
            {
              $lookup: {
                from: 'users',
                localField: 'readByRecipients.readByUserId',
                foreignField: '_id',
                as: 'readByRecipients.readByUser'
              }
            }, {
              $group: {
                _id: '$roomInfo._id',
                messageId: {
                  $last: '$messageId'
                },
                chatRoomId: {
                  $last: '$chatRoomId'
                },
                message: {
                  $last: '$message'
                },
                type: {
                  $last: '$type'
                },
                postedByUser: {
                  $last: '$postedByUser'
                },
                readByRecipients: {
                  $addToSet: '$readByRecipients'
                },
                roomInfo: {
                  $addToSet: '$roomInfo.userProfile'
                },
                createdAt: {
                  $last: '$createdAt'
                }
              }
            }, // apply pagination
            {
              $skip: options.page * options.limit
            }, {
              $limit: options.limit
            }]));

          case 4:
            _context4.prev = 4;
            _context4.t0 = _context4["catch"](0);
            throw _context4.t0;

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 4]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();

chatMessageSchema.plugin(autoIncrementSQ, {
  id: "chat_message_id",
  inc_field: "_id"
});

var _default2 = _mongoose["default"].model("ChatMessage", chatMessageSchema);

exports["default"] = _default2;