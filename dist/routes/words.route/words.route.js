"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _words = _interopRequireDefault(require("../../controllers/words.controller/words.controller"));

// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';
var router = _express["default"].Router();

router.route('/').get(_words["default"].findAll).post(_words["default"].validateAddWord(), _words["default"].addWord);
var _default = router;
exports["default"] = _default;