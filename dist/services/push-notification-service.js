"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendPushNotification = sendPushNotification;
exports.sendPushNotificationToGuests = sendPushNotificationToGuests;
exports.testDifferentPayLoad = testDifferentPayLoad;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var admin = _interopRequireWildcard(require("firebase-admin"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var serviceAccount = require('../../serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function sendPushNotification(_x) {
  return _sendPushNotification.apply(this, arguments);
}

function _sendPushNotification() {
  _sendPushNotification = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(notifi) {
    var userToken, payload;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              //  for (let index = 0; index < notifi.targetUser.length; index++) {
              userToken = notifi.targetUser; // if (notifi.targetUser.tokens[index].type == 'android') {

              payload = {
                token: userToken
              };
              payload.data = {
                title: notifi.title.toString(),
                body: notifi.text,
                subjectType: notifi.subjectType,
                subjectId: notifi.subjectId
              };
              payload.android = {
                notification: {
                  title: notifi.title.toString(),
                  body: notifi.text,
                  sticky: false,
                  visibility: 'public',
                  eventTimestamp: new Date(),
                  priority: 'high',
                  vibrateTimingsMillis: [100, 50, 250],
                  defaultVibrateTimings: false,
                  defaultSound: true,
                  lightSettings: {
                    color: '#AABBCC55',
                    lightOnDurationMillis: 200,
                    lightOffDurationMillis: 300
                  },
                  defaultLightSettings: false,
                  notificationCount: 1
                }
              }; // payload.notification = {
              //
              // }

              if (notifi.image && notifi.image != '') {
                payload.data.image = notifi.image;
                payload.data.badge = notifi.image;
                payload.notification.image = notifi.image;
              } // console.log(payload)


              admin.messaging().send(payload).then(function (response) {
                console.log('Successfully sent a message');
              })["catch"](function (error) {
                console.log('Error sending a message:', error.message);
              }); //       } else {
              //           let payload = {
              //               notification: {
              //                   title: notifi.title.toString(),
              // image: 'https://www.borsetelgomla.com/Borsa-Backend/otherImage.png',
              //                   body: notifi.text,
              //                   sound: 'default',
              //                   badge: '1'
              //               },
              //               data: {
              //                   message: notifi.text,
              //                   subjectId: notifi.subjectId.toString(),
              //                   subjectType: notifi.subjectType,
              //               }
              //           };
              //           if (notifi.trip) payload.data.trip = notifi.trip.toString();
              //           admin.messaging().sendToDevice(userToken, payload)
              //               .then(response => {
              //                   console.log('Successfully sent a message');
              //               })
              //               .catch(error => {
              //                   console.log('Error sending a message:', error);
              //               });
              //       }
              //  }
            } catch (error) {
              console.log('fire base error -->  ', error.message);
              console.log('fire base error -->  ', error);
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _sendPushNotification.apply(this, arguments);
}

function sendPushNotificationToGuests(_x2) {
  return _sendPushNotificationToGuests.apply(this, arguments);
}

function _sendPushNotificationToGuests() {
  _sendPushNotificationToGuests = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(notifi) {
    var payload;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            payload = {
              data: {
                message: notifi.text,
                subjectId: notifi.subjectId.toString(),
                subjectType: notifi.subjectType
              },
              token: notifi.targetUser
            };
            admin.messaging().send(payload).then(function (response) {
              console.log('Successfully sent a message');
            })["catch"](function (error) {
              console.log('Error sending a message:', error.message);
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _sendPushNotificationToGuests.apply(this, arguments);
}

function testDifferentPayLoad(_x3) {
  return _testDifferentPayLoad.apply(this, arguments);
}

function _testDifferentPayLoad() {
  _testDifferentPayLoad = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(payload) {
    var c, index, i;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return User.find({
              deleted: false
            });

          case 2:
            c = _context3.sent;

            for (index = 0; index < c.length; index++) {
              for (i = 0; i < c[index].token.length; i++) {
                payload.token = c[index].token[i];
                admin.messaging().send(payload).then(function (response) {
                  console.log('Successfully sent a message');
                })["catch"](function (error) {
                  console.log('Error sending a message:', error.message);
                });
              }
            }

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _testDifferentPayLoad.apply(this, arguments);
}