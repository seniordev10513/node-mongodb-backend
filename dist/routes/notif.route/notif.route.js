"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _notif = _interopRequireDefault(require("../../controllers/notif.controller/notif.controller"));

var router = _express["default"].Router();

router.route('/').get(_notif["default"].getLastNotifications);
router.route('/markAsRead').put(_notif["default"].markAsRead);
router.route('/delete').get(_notif["default"]["delete"]);
var _default = router;
exports["default"] = _default;