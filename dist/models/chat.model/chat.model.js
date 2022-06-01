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

var ChatSchema = new _mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  receiver: {
    type: Number,
    ref: 'user'
  },
  chatInitiator: {
    type: Number,
    ref: 'user'
  },
  type: {
    type: String
  }
}, {
  timestamps: true
});
ChatSchema.set('toJSON', {
  transform: function transform(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
/**
 * @param {String} userId - id of user
 * @return {Array} array of all chatroom that the user belongs to
 */

ChatSchema.statics.getChatRoomsByUserId = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userId) {
    var admin,
        rooms,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            admin = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
            _context.prev = 1;
            rooms = [];

            if (admin) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return this.find({
              $or: [{
                receiver: userId
              }, {
                chatInitiator: userId
              }]
            }).sort({
              created_at: -1
            });

          case 6:
            rooms = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.next = 11;
            return this.find({
              type: 'ADMIN'
            });

          case 11:
            rooms = _context.sent;

          case 12:
            return _context.abrupt("return", rooms);

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](1);
            throw _context.t0;

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 15]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @param {String} roomId - id of chatroom
 * @return {Object} chatroom
 */


ChatSchema.statics.getChatRoomByRoomId = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(roomId) {
    var room;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return this.findOne({
              _id: roomId
            });

          case 3:
            room = _context2.sent;
            return _context2.abrupt("return", room);

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            throw _context2.t0;

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 7]]);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @param {Array} userIds - array of strings of userIds
 * @param {String} chatInitiator - user who initiated the chat
 * @param {CHAT_ROOM_TYPES} type
 */


ChatSchema.statics.initiateChat = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(receiver, chatInitiator) {
    var admin,
        type,
        availableRoom,
        newRoom,
        _args3 = arguments;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            admin = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : false;
            _context3.prev = 1;
            type = admin ? 'ADMIN' : 'USER';
            _context3.next = 5;
            return this.findOne({
              receiver: receiver,
              chatInitiator: chatInitiator,
              type: type
            });

          case 5:
            availableRoom = _context3.sent;

            if (!availableRoom) {
              _context3.next = 8;
              break;
            }

            return _context3.abrupt("return", {
              isNew: false,
              message: 'retrieving an old chat room',
              chatRoomId: availableRoom._doc._id,
              type: availableRoom._doc.type
            });

          case 8:
            _context3.next = 10;
            return this.create({
              receiver: receiver,
              chatInitiator: chatInitiator,
              type: type,
              _id: false
            });

          case 10:
            newRoom = _context3.sent;
            return _context3.abrupt("return", {
              isNew: true,
              message: 'creating a new chatroom',
              chatRoomId: newRoom._doc._id,
              type: newRoom._doc.type
            });

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](1);
            console.log('error on start chat method', _context3.t0);
            throw _context3.t0;

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 14]]);
  }));

  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

ChatSchema.plugin(autoIncrementSQ, {
  id: "chat_id",
  inc_field: "_id"
});
ChatSchema.plugin(_mongooseI18nLocalize["default"], {
  locales: ['ar', 'en']
});

var _default = _mongoose["default"].model('Chat', ChatSchema);

exports["default"] = _default;