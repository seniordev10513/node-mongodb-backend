"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _chat = _interopRequireDefault(require("../../controllers/chat.controller/chat.controller"));

var router = _express["default"].Router();

router.route('/recent').get(_chat["default"].getRecentConversation);
router.route('/initiate').post(_chat["default"].validateInitiate(), _chat["default"].initiate);
router.route('/conversation').get(_chat["default"].getConversationByRoomId);
router.route('/post').post(_chat["default"].validatePostMessage(), _chat["default"].postMessage);
router.route('/markMessageRead').post(_chat["default"].markConversationReadByRoomId); //  .post( chatController.validate(), messageController.create);

var _default = router;
exports["default"] = _default;