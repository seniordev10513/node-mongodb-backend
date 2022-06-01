"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _category = _interopRequireDefault(require("../../controllers/category.controller/category.controller"));

var _passport = require("../../services/passport");

var _multerService = require("../../services/multer-service");

var _shared = require("../../controllers/shared.controller/shared.controller");

var express = require('express');

var router = express.Router();
router.route('/').get(_category["default"].findAll).post(_passport.requireAuth, _category["default"].validateBody(), _category["default"].create);
router.route('/:categoryId').get(_category["default"].findById).put(_passport.requireAuth, _category["default"].validateBody(true), _category["default"].update)["delete"](_passport.requireAuth, _category["default"]["delete"]);
var _default = router;
exports["default"] = _default;