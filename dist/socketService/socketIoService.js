"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _notif = _interopRequireDefault(require("../controllers/notif.controller/notif.controller"));

var _chat = _interopRequireDefault(require("../controllers/chat.controller/chat.controller"));

var _user = _interopRequireDefault(require("../models/user.model/user.model"));

var _socketEvents = _interopRequireDefault(require("../socketEvents"));

// import Order from '../src/models/order.model/order.model'
// import contactUsController from '../src/controllers/contactUs.controller/contactUs.controller'
// import Company from '../src/models/company.model/company.model'
module.exports = {
  startNotification: function startNotification(io) {
    global.notificationNSP = io.of('/utils');
    notificationNSP.on('connection', /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(socket) {
        var id, user, adminCheck, roomName;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                id = socket.handshake.query.id;
                console.log('clientttttttt ' + id + ' connected on notification.');
                console.log(id);

                if (isNaN(id)) {
                  _context.next = 15;
                  break;
                }

                _context.next = 7;
                return _user["default"].findOne({
                  _id: id
                });

              case 7:
                user = _context.sent;

                if (!user) {
                  _context.next = 15;
                  break;
                }

                adminCheck = false;
                if (user.type == "ADMIN") adminCheck = true;

                if (adminCheck) {
                  socket.join('room-admin' + user.id);
                } else {
                  socket.join('room-' + user.id);
                }

                roomName = id;
                _context.next = 15;
                return _notif["default"].getCountNotification(id, adminCheck);

              case 15:
                _context.next = 20;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 17]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  },
  chat: function chat(io) {
    global.chatNSP = io.of('/chat');
    chatNSP.on('connection', /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(socket) {
        var id, user, adminCheck;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                id = socket.handshake.query.id; // let receiverId = socket.handshake.query.receiver;
                // console.log(id);

                _context5.next = 4;
                return _user["default"].findById(id);

              case 4:
                user = _context5.sent;
                adminCheck = false;
                if (user.type == "ADMIN") adminCheck = true;

                if (adminCheck) {
                  socket.join('room-admin' + user.id);
                } else {
                  socket.join('room-' + user.id);
                }

                console.log('New ' + user.type + ' Connected ' + id + ' on chat '); // console.log('receiverId' + receiverId);

                _context5.next = 11;
                return _chat["default"].getCountChat(id, adminCheck);

              case 11:
                socket.on(_socketEvents["default"].Typing, /*#__PURE__*/function () {
                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            // data =  { to }
                            if (data.to) {
                              chatNSP.to('room-' + data.to).emit(_socketEvents["default"].Typing, {
                                user: user
                              });
                            } else {
                              chatNSP.to('room-admin').emit(_socketEvents["default"].Typing, {
                                user: user
                              });
                            }

                          case 1:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x3) {
                    return _ref3.apply(this, arguments);
                  };
                }());
                socket.on(_socketEvents["default"].StopTyping, /*#__PURE__*/function () {
                  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data) {
                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            // data =  { to }
                            if (data.to) {
                              chatNSP.to('room-' + data.to).emit(_socketEvents["default"].Typing, {
                                user: user
                              });
                            } else {
                              chatNSP.to('room-admin').emit(_socketEvents["default"].Typing, {
                                user: user
                              });
                            }

                          case 1:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x4) {
                    return _ref4.apply(this, arguments);
                  };
                }());
                socket.on(_socketEvents["default"].UpdateSeen, /*#__PURE__*/function () {
                  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            if (!(data && data.user)) {
                              _context4.next = 3;
                              break;
                            }

                            _context4.next = 3;
                            return _chat["default"].updateSeen(data);

                          case 3:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function (_x5) {
                    return _ref5.apply(this, arguments);
                  };
                }());
                _context5.next = 19;
                break;

              case 16:
                _context5.prev = 16;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);

              case 19:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 16]]);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  },
  admin: function admin(io) {// global.adminNSP = io.of('/admin');
    // adminNSP.on('connection', async function(socket) {
    //     var id = socket.handshake.query.id;
    //     let user = await User.findById(id);
    //     var roomName = 'room-admin';
    //     socket.join(roomName);
    //     if(user.type == 'SUB_ADMIN'){
    //         socket.join('room-'+ id);
    //         adminNSP.to('room-'+ id).emit(socketEvents.NewUser, {user, user });
    //     }
    //     console.log('New admin Connected ' + id + ' on admin nsp ');
    //     await NotificationController.getCountNotification(id, true);
    //     let onlineOrder = await Order.count({deleted:false , type:'ONLINE' , adminInformed:false});
    //     let manualOrder = await Order.count({deleted:false , type:'MANULAY' , adminInformed:false});
    //     adminNSP.emit(socketEvents.UpdateOrderCount, {onlineOrder, manualOrder });
    //     await messageController.countUnseenForAdmin();
    //     await contactUsController.countNotReplied();
    // })
  }
};