"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _user = _interopRequireDefault(require("../../models/user.model/user.model"));

var _CheckMethods = require("../../helpers/CheckMethods");

var _notification = _interopRequireDefault(require("../../models/notification.model/notification.model"));

var _ApiResponse = _interopRequireDefault(require("../../helpers/ApiResponse"));

var _pushNotificationService = require("../../services/push-notification-service");

var _shared = require("../shared.controller/shared.controller");

var _check = require("express-validator/check");

var _ApiError = _interopRequireDefault(require("../../helpers/ApiError"));

var _i18n = _interopRequireDefault(require("i18n"));

var _socketEvents = _interopRequireDefault(require("../../socketEvents"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// import config from '../../config'
var populateQuery = [{
  path: 'resource',
  model: 'user'
}, {
  path: 'target',
  model: 'user'
}, {
  path: 'users',
  model: 'user'
}, {
  path: 'order',
  model: 'order'
}, {
  path: 'promoCode',
  model: 'promocode'
}];

var create = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resource, target, description, subject, subjectType, order, promoCode) {
    var query, newNotification, counter;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            query = {
              resource: resource,
              target: target,
              description: description,
              subject: subject,
              subjectType: subjectType
            };
            if (subjectType == "PROMOCODE") query.promoCode = subject;
            if (subjectType == "ORDER") query.order = subject;
            if (subjectType == "CHANGE_ORDER_STATUS") query.order = subject;

            if (subject && subjectType) {
              query.subjectType = subjectType;
              query.subject = subject;
            }

            if (order) {
              query.order = order;
            }

            if (promoCode) {
              query.promoCode = promoCode;
            }

            newNotification = new _notification["default"](query);
            _context.next = 11;
            return newNotification.save();

          case 11:
            _context.next = 13;
            return _notification["default"].count({
              deleted: false,
              target: target,
              informed: {
                $ne: target
              }
            });

          case 13:
            counter = _context.sent;
            notificationNSP.to('room-' + target).emit(_socketEvents["default"].NotificationsCount, {
              count: counter
            });
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0.message);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 17]]);
  }));

  return function create(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();

var create_notif = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(resource, target, subject, text, subjectType, subjectId) {
    var query, notification;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            query = {
              resource: resource,
              target: target,
              subject: subject,
              text: text
            };
            notification = {};
            _context2.next = 5;
            return _notification["default"].create({
              _id: false,
              resource: resource,
              target: target,
              title: subject,
              text: text,
              subjectType: subjectType,
              subjectId: subjectId
            }).then(function (resp) {
              notification = resp;
            })["catch"](function (e) {
              console.error(e);
            });

          case 5:
            return _context2.abrupt("return", notification);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0.message);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function create_notif(_x8, _x9, _x10, _x11, _x12, _x13) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = {
  findMyNotification: function findMyNotification(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var user, page, limit, query, subjectType, notifs, notifsCount, pageCount, toRoom;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              user = req.user._id;
              page = +req.query.page || 1, limit = +req.query.limit || 20;
              query = {
                deleted: false,
                $or: [{
                  target: user
                }, {
                  users: {
                    $elemMatch: {
                      $eq: user
                    }
                  }
                }, {
                  type: 'ALL'
                }],
                type: {
                  $nin: ['MAIL', 'SMS']
                },
                createdAt: {
                  $gte: req.user.createdAt
                },
                usersDeleted: {
                  $ne: user
                }
              };
              subjectType = req.query.subjectType;
              if (subjectType) query = {
                subjectType: 'ADMIN',
                deleted: false,
                usersDeleted: {
                  $ne: user
                }
              };
              _context3.next = 8;
              return _notification["default"].find(query).populate(populateQuery).sort({
                createdAt: -1
              }).limit(limit).skip((page - 1) * limit);

            case 8:
              notifs = _context3.sent;
              notifs = _notification["default"].schema.methods.toJSONLocalizedOnly(notifs, _i18n["default"].getLocale());
              _context3.next = 12;
              return _notification["default"].count(query);

            case 12:
              notifsCount = _context3.sent;
              pageCount = Math.ceil(notifsCount / limit);

              if (subjectType) {
                _context3.next = 20;
                break;
              }

              query = {
                $or: [{
                  target: user
                }, {
                  users: user,
                  type: 'USERS'
                }],
                informed: {
                  $ne: user
                },
                deleted: false,
                usersDeleted: {
                  $ne: user
                }
              };
              _context3.next = 18;
              return _notification["default"].updateMany(query, {
                $addToSet: {
                  informed: user
                }
              });

            case 18:
              toRoom = 'room-' + user;
              notificationNSP.to(toRoom).emit(_socketEvents["default"].NotificationsCount, {
                count: 0
              });

            case 20:
              res.send(new _ApiResponse["default"](notifs, page, pageCount, limit, notifsCount, req));
              _context3.next = 26;
              break;

            case 23:
              _context3.prev = 23;
              _context3.t0 = _context3["catch"](0);
              next(_context3.t0);

            case 26:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 23]]);
    }))();
  },
  read: function read(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var notifId, notif;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              notifId = req.params.notifId;
              _context4.next = 4;
              return (0, _CheckMethods.checkExistThenGet)(notifId, _notification["default"]);

            case 4:
              notif = _context4.sent;
              notif.read = true;
              _context4.next = 8;
              return notif.save();

            case 8:
              res.send('notif read');
              _context4.next = 14;
              break;

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](0);
              next(_context4.t0);

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[0, 11]]);
    }))();
  },
  unread: function unread(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var notifId, notif;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              notifId = req.params.notifId;
              _context5.next = 4;
              return (0, _CheckMethods.checkExistThenGet)(notifId, _notification["default"]);

            case 4:
              notif = _context5.sent;
              notif.read = false;
              _context5.next = 8;
              return notif.save();

            case 8:
              res.send('notif unread');
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
  getCountNotification: function getCountNotification(id) {
    var _arguments = arguments;
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var admin, toRoom, query, notifsCount, chargeCount, saOrderCount, tripCount;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              admin = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : false;
              _context6.prev = 1;
              toRoom = id;
              query = {
                target: id,
                deleted: false,
                read: false
              };
              _context6.next = 6;
              return _notification["default"].countDocuments(query);

            case 6:
              notifsCount = _context6.sent;

              if (admin) {
                _context6.next = 20;
                break;
              }

              _context6.next = 10;
              return _notification["default"].countDocuments(_objectSpread(_objectSpread({}, query), {}, {
                subjectType: {
                  $in: ["SHOHNAT", "COMMERCIAL", "SHOHNAT-PRICE"]
                }
              }));

            case 10:
              chargeCount = _context6.sent;
              _context6.next = 13;
              return _notification["default"].countDocuments(_objectSpread(_objectSpread({}, query), {}, {
                subjectType: {
                  $in: ["SAORDER", "SAORDER-PRICE"]
                }
              }));

            case 13:
              saOrderCount = _context6.sent;
              _context6.next = 16;
              return _notification["default"].countDocuments(_objectSpread(_objectSpread({}, query), {}, {
                subjectType: {
                  $in: ["TRIP", "ORDER"]
                }
              }));

            case 16:
              tripCount = _context6.sent;
              notificationNSP.to('room-' + toRoom).emit("NotificationsCount", {
                count: notifsCount,
                chargeCount: chargeCount,
                saOrderCount: saOrderCount,
                tripCount: tripCount
              });
              _context6.next = 22;
              break;

            case 20:
              console.log('admin');
              notificationNSP.to('room-admin' + toRoom).emit("NotificationsCount", {
                count: notifsCount
              });

            case 22:
              _context6.next = 27;
              break;

            case 24:
              _context6.prev = 24;
              _context6.t0 = _context6["catch"](1);
              console.log(_context6.t0.message);

            case 27:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[1, 24]]);
    }))();
  },
  // NewNotification
  pushNotification: function pushNotification(targetUser, subjectType, subjectId, text, title) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var data, creatednotif, adminCheck;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              //  var user = await checkExistThenGet(targetUser, User, { deleted: false });
              // if (user.notification) {
              data = {
                targetUser: targetUser.token,
                subjectType: subjectType,
                subjectId: subjectId,
                text: text,
                title: title
              };
              _context7.next = 4;
              return create_notif('', targetUser.id, title, text, subjectType, subjectId);

            case 4:
              creatednotif = _context7.sent;
              adminCheck = false;
              if (targetUser.type == "ADMIN") adminCheck = true;
              _context7.next = 9;
              return exports["default"].getCountNotification(targetUser.id, adminCheck);

            case 9:
              (0, _pushNotificationService.sendPushNotification)(data);

              if (adminCheck) {
                notificationNSP.to('room-admin' + targetUser.id).emit('NewNotification', {
                  notification: data
                });
              } else {
                notificationNSP.to('room-' + targetUser.id).emit('NewNotification', {
                  notification: data
                });
              } // } else {
              //     return true;
              // }


              _context7.next = 17;
              break;

            case 13:
              _context7.prev = 13;
              _context7.t0 = _context7["catch"](0);
              console.log("error.message");
              console.log(_context7.t0.message);

            case 17:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[0, 13]]);
    }))();
  },
  validateAdminSendToAll: function validateAdminSendToAll() {
    var validations = [(0, _check.body)('titleOfNotification.ar').not().isEmpty().withMessage('titleOfNotification is required'), (0, _check.body)('titleOfNotification.en').not().isEmpty().withMessage('titleOfNotification is required'), (0, _check.body)('text.ar').not().isEmpty().withMessage('text is required'), (0, _check.body)('text.en').not().isEmpty().withMessage('text is required')];
    return validations;
  },
  adminSendToAllUsers: function adminSendToAllUsers(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var user, validatedBody, image, notifiObj, allUsers;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              user = req.user;

              if (!(user.type != 'ADMIN' && user.type != 'SUB_ADMIN')) {
                _context9.next = 4;
                break;
              }

              return _context9.abrupt("return", next(new _ApiError["default"](403, 'admin.auth')));

            case 4:
              validatedBody = (0, _shared.checkValidations)(req);

              if (!req.file) {
                _context9.next = 10;
                break;
              }

              _context9.next = 8;
              return (0, _shared.handleImg)(req, {
                attributeName: 'image',
                isUpdate: false
              });

            case 8:
              image = _context9.sent;
              validatedBody.image = image;

            case 10:
              notifiObj = {
                resource: req.user.id,
                type: "ALL",
                subjectType: "ADMIN",
                description: validatedBody.text
              };
              if (validatedBody.image) notifiObj.image = validatedBody.image;
              _context9.next = 14;
              return _notification["default"].create(notifiObj);

            case 14:
              _context9.next = 16;
              return _user["default"].find({
                deleted: false,
                type: 'CLIENT'
              });

            case 16:
              allUsers = _context9.sent;
              allUsers.forEach( /*#__PURE__*/function () {
                var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(user) {
                  return _regenerator["default"].wrap(function _callee8$(_context8) {
                    while (1) {
                      switch (_context8.prev = _context8.next) {
                        case 0:
                          if (user.notification) {
                            if (user.language == 'ar') {
                              (0, _pushNotificationService.sendPushNotification)({
                                targetUser: user,
                                subjectType: "ADMIN",
                                subjectId: 1,
                                text: validatedBody.text.ar,
                                title: validatedBody.titleOfNotification.ar,
                                image: validatedBody.image ? process.env.BACKEND_ENDPOINT + validatedBody.image : ''
                              });
                            } else {
                              (0, _pushNotificationService.sendPushNotification)({
                                targetUser: user,
                                subjectType: "ADMIN",
                                subjectId: 1,
                                text: validatedBody.text.en,
                                title: validatedBody.titleOfNotification.en,
                                image: validatedBody.image ? process.env.BACKEND_ENDPOINT + validatedBody.image : ''
                              });
                            }
                          }

                          _context8.t0 = notificationNSP.to('room-' + user.id);
                          _context8.t1 = _socketEvents["default"].NotificationsCount;
                          _context8.next = 5;
                          return _notification["default"].count({
                            $or: [{
                              target: user.id
                            }, {
                              users: user.id
                            }],
                            informed: {
                              $ne: user.id
                            },
                            deleted: false,
                            usersDeleted: {
                              $ne: user.id
                            }
                          });

                        case 5:
                          _context8.t2 = _context8.sent;
                          _context8.t3 = {
                            count: _context8.t2
                          };

                          _context8.t0.emit.call(_context8.t0, _context8.t1, _context8.t3);

                        case 8:
                        case "end":
                          return _context8.stop();
                      }
                    }
                  }, _callee8);
                }));

                return function (_x14) {
                  return _ref3.apply(this, arguments);
                };
              }());
              res.status(200).send("Successfully send to all users");
              _context9.next = 24;
              break;

            case 21:
              _context9.prev = 21;
              _context9.t0 = _context9["catch"](0);
              next(_context9.t0);

            case 24:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[0, 21]]);
    }))();
  },
  validateAdminSendToSpecificUsers: function validateAdminSendToSpecificUsers() {
    var validations = [(0, _check.body)('titleOfNotification.ar').not().isEmpty().withMessage('titleOfNotification is required'), (0, _check.body)('titleOfNotification.en').not().isEmpty().withMessage('titleOfNotification is required'), (0, _check.body)('text.ar').not().isEmpty().withMessage('text is required'), (0, _check.body)('text.en').not().isEmpty().withMessage('text is required'), (0, _check.body)('users').not().isEmpty().withMessage('users is required').isArray().withMessage('must be array').custom( /*#__PURE__*/function () {
      var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(val, _ref4) {
        var req, index;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                req = _ref4.req;
                index = 0;

              case 2:
                if (!(index < val.length)) {
                  _context10.next = 8;
                  break;
                }

                _context10.next = 5;
                return (0, _CheckMethods.checkExist)(val[index], _user["default"], {
                  deleted: false
                });

              case 5:
                index++;
                _context10.next = 2;
                break;

              case 8:
                return _context10.abrupt("return", true);

              case 9:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      return function (_x15, _x16) {
        return _ref5.apply(this, arguments);
      };
    }())];
    return validations;
  },
  adminSendToAllSpecificUsers: function adminSendToAllSpecificUsers(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      var validatedBody, image, notifiObj, allUsers;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.prev = 0;
              validatedBody = (0, _shared.checkValidations)(req);

              if (!req.file) {
                _context12.next = 7;
                break;
              }

              _context12.next = 5;
              return (0, _shared.handleImg)(req, {
                attributeName: 'image',
                isUpdate: false
              });

            case 5:
              image = _context12.sent;
              validatedBody.image = image;

            case 7:
              notifiObj = {
                resource: req.user.id,
                type: "USERS",
                subjectType: "ADMIN",
                description: validatedBody.text,
                users: validatedBody.users
              };
              if (validatedBody.image) notifiObj.image = validatedBody.image;
              _context12.next = 11;
              return _notification["default"].create(notifiObj);

            case 11:
              _context12.next = 13;
              return _user["default"].find({
                deleted: false,
                _id: {
                  $in: validatedBody.users
                }
              });

            case 13:
              allUsers = _context12.sent;
              allUsers.forEach( /*#__PURE__*/function () {
                var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(user) {
                  return _regenerator["default"].wrap(function _callee11$(_context11) {
                    while (1) {
                      switch (_context11.prev = _context11.next) {
                        case 0:
                          if (user.notification) {
                            if (user.language == 'ar') {
                              (0, _pushNotificationService.sendPushNotification)({
                                targetUser: user,
                                subjectType: "ADMIN",
                                subjectId: 1,
                                text: validatedBody.text.ar,
                                title: validatedBody.titleOfNotification.ar,
                                image: validatedBody.image ? process.env.BACKEND_ENDPOINT + validatedBody.image : ''
                              });
                            } else {
                              (0, _pushNotificationService.sendPushNotification)({
                                targetUser: user,
                                subjectType: "ADMIN",
                                subjectId: 1,
                                text: validatedBody.text.en,
                                title: validatedBody.titleOfNotification.en,
                                image: validatedBody.image ? process.env.BACKEND_ENDPOINT + validatedBody.image : ''
                              });
                            }
                          }

                          _context11.t0 = notificationNSP.to('room-' + user.id);
                          _context11.t1 = _socketEvents["default"].NotificationsCount;
                          _context11.next = 5;
                          return _notification["default"].count({
                            $or: [{
                              target: user.id
                            }, {
                              users: user.id
                            }],
                            informed: {
                              $ne: user.id
                            },
                            deleted: false,
                            usersDeleted: {
                              $ne: user.id
                            }
                          });

                        case 5:
                          _context11.t2 = _context11.sent;
                          _context11.t3 = {
                            count: _context11.t2
                          };

                          _context11.t0.emit.call(_context11.t0, _context11.t1, _context11.t3);

                        case 8:
                        case "end":
                          return _context11.stop();
                      }
                    }
                  }, _callee11);
                }));

                return function (_x17) {
                  return _ref6.apply(this, arguments);
                };
              }());
              res.status(200).send("Successfully send to user");
              _context12.next = 21;
              break;

            case 18:
              _context12.prev = 18;
              _context12.t0 = _context12["catch"](0);
              next(_context12.t0);

            case 21:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, null, [[0, 18]]);
    }))();
  },
  create: create,
  findAll: function findAll(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
      var page, limit, _req$query, resource, admin, query, notifs, notifsCount, pageCount;

      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.prev = 0;
              page = +req.query.page || 1, limit = +req.query.limit || 20;
              _req$query = req.query, resource = _req$query.resource, admin = _req$query.admin;
              query = {
                deleted: false,
                subjectType: "ADMIN",
                type: {
                  $ne: null
                }
              };
              if (resource) query.resource = resource;
              _context13.next = 7;
              return _notification["default"].find(query).populate(populateQuery).sort({
                _id: -1
              }).limit(limit).skip((page - 1) * limit);

            case 7:
              notifs = _context13.sent;
              if (!admin) notifs = _notification["default"].schema.methods.toJSONLocalizedOnly(notifs, _i18n["default"].getLocale());
              _context13.next = 11;
              return _notification["default"].count(query);

            case 11:
              notifsCount = _context13.sent;
              pageCount = Math.ceil(notifsCount / limit);
              res.send(new _ApiResponse["default"](notifs, page, pageCount, limit, notifsCount, req));
              _context13.next = 19;
              break;

            case 16:
              _context13.prev = 16;
              _context13.t0 = _context13["catch"](0);
              next(_context13.t0);

            case 19:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, null, [[0, 16]]);
    }))();
  },
  getLastNotifications: function getLastNotifications(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
      var user, page, limit, query, notifs, notifsCount, pageCount;
      return _regenerator["default"].wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.prev = 0;
              user = req.query.userId;
              page = +req.query.page || 1, limit = +req.query.limit || 20;
              query = {
                deleted: false,
                target: user
              };
              _context14.next = 6;
              return _notification["default"].find(query).sort({
                _id: -1
              }).limit(limit).skip((page - 1) * limit);

            case 6:
              notifs = _context14.sent;
              notifs.reverse();
              _context14.next = 10;
              return _notification["default"].countDocuments(query);

            case 10:
              notifsCount = _context14.sent;
              pageCount = Math.ceil(notifsCount / limit);
              res.send(new _ApiResponse["default"](notifs, page, pageCount, limit, notifsCount, req));
              _context14.next = 19;
              break;

            case 15:
              _context14.prev = 15;
              _context14.t0 = _context14["catch"](0);
              console.log(_context14.t0);
              next(_context14.t0);

            case 19:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, null, [[0, 15]]);
    }))();
  },
  markAsRead: function markAsRead(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
      var userId, page, limit, user, query;
      return _regenerator["default"].wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.prev = 0;
              userId = req.query.userId;
              page = +req.query.page || 1, limit = +req.query.limit || 20;
              _context15.next = 5;
              return _user["default"].findOne({
                deleted: false,
                _id: userId
              });

            case 5:
              user = _context15.sent;
              query = {
                deleted: false,
                target: userId
              };

              if (!req.query.type) {
                _context15.next = 17;
                break;
              }

              _context15.t0 = req.query.type;
              _context15.next = _context15.t0 === "charge" ? 11 : _context15.t0 === "trip" ? 13 : _context15.t0 === "saOrder" ? 15 : 17;
              break;

            case 11:
              query.subjectType = {
                $in: ["SHOHNAT", "COMMERCIAL", "SHOHNAT-PRICE"]
              };
              return _context15.abrupt("break", 17);

            case 13:
              query.subjectType = {
                $in: ["TRIP", "ORDER"]
              };
              return _context15.abrupt("break", 17);

            case 15:
              query.subjectType = {
                $in: ["SAORDER", "SAORDER-PRICE"]
              };
              return _context15.abrupt("break", 17);

            case 17:
              console.log(query);
              _context15.next = 20;
              return _notification["default"].updateMany(query, {
                read: true
              });

            case 20:
              _context15.next = 22;
              return exports["default"].getCountNotification(userId, user.type == "ADMIN");

            case 22:
              //   if(user.type=="ADMIN"){
              //     notificationNSP.to('room-admin').emit(socketEvents.NotificationsCount, { count: 0 });
              //   }else{
              //     notificationNSP.to('room-'+userId).emit(socketEvents.NotificationsCount, { count: 0 });
              //   }
              res.send('notif marked as read');
              _context15.next = 28;
              break;

            case 25:
              _context15.prev = 25;
              _context15.t1 = _context15["catch"](0);
              next(_context15.t1);

            case 28:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, null, [[0, 25]]);
    }))();
  },
  "delete": function _delete(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
      var notifId, notif;
      return _regenerator["default"].wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.prev = 0;
              notifId = req.query.notifId;
              _context16.next = 4;
              return (0, _CheckMethods.checkExistThenGet)(notifId, _notification["default"], {
                deleted: false
              });

            case 4:
              notif = _context16.sent;
              console.log(notif);
              notif.deleted = true;
              _context16.next = 9;
              return notif.save();

            case 9:
              res.send('notif deleted');
              _context16.next = 15;
              break;

            case 12:
              _context16.prev = 12;
              _context16.t0 = _context16["catch"](0);
              next(_context16.t0);

            case 15:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, null, [[0, 12]]);
    }))();
  },
  userDelete: function userDelete(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
      var notifId, notif;
      return _regenerator["default"].wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.prev = 0;
              notifId = req.params.notifId;
              _context17.next = 4;
              return (0, _CheckMethods.checkExistThenGet)(notifId, _notification["default"], {
                deleted: false
              });

            case 4:
              notif = _context17.sent;
              _context17.next = 7;
              return _notification["default"].findByIdAndUpdate(notifId, {
                $push: {
                  usersDeleted: req.user.id
                }
              });

            case 7:
              res.send('notif deleted');
              _context17.next = 13;
              break;

            case 10:
              _context17.prev = 10;
              _context17.t0 = _context17["catch"](0);
              next(_context17.t0);

            case 13:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, null, [[0, 10]]);
    }))();
  },
  findById: function findById(req, res, next) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
      var notifId, removeLanguage, notifi;
      return _regenerator["default"].wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.prev = 0;
              notifId = req.params.notifId;
              removeLanguage = req.query.removeLanguage;
              _context18.next = 5;
              return (0, _CheckMethods.checkExistThenGet)(notifId, _notification["default"], {
                deleted: false,
                populate: populateQuery
              });

            case 5:
              notifi = _context18.sent;

              if (!removeLanguage) {
                notifi = _notification["default"].schema.methods.toJSONLocalizedOnly(notifi, _i18n["default"].getLocale());
              }

              res.status(200).send(notifi);
              _context18.next = 13;
              break;

            case 10:
              _context18.prev = 10;
              _context18.t0 = _context18["catch"](0);
              next(_context18.t0);

            case 13:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18, null, [[0, 10]]);
    }))();
  }
};
exports["default"] = _default;