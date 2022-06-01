"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkValidations = checkValidations;
exports.createPromise = void 0;
exports.deleteImages = deleteImages;
exports.fieldhandleImg = fieldhandleImg;
exports.handleFiles = handleFiles;
exports.handleImg = handleImg;
exports.handleImgs = handleImgs;
exports.localeFn = void 0;
exports.parseObject = parseObject;
exports.removeFile = removeFile;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _ApiError = _interopRequireDefault(require("../../helpers/ApiError"));

var _check = require("express-validator/check");

var _filter = require("express-validator/filter");

var _utils = require("../../utils");

var _mongoose = require("mongoose");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function deleteTempImages(req) {// if (req.files) {
  //     console.log("req.files.length======", req.files.length)
  //     if (req.files.length && req.files.length > 0) {
  //         req.files.forEach(element => {
  //             fs.unlink(element.path, (err) => {
  //                 if (err) throw err;
  //                 console.log('file deleted');
  //             });
  //         });
  //     } else {
  //         let files = req.files;
  //         //console.log(files)
  //         for (var element in files) {
  //             files['' + element].forEach(file => {
  //                 fs.unlink(file.path, (err) => {
  //                     if (err) throw err;
  //                     console.log('file deleted');
  //                 });
  //             });
  //         };
  //     }
  // }
  // if (req.file) {
  //     fs.unlink(req.file.path, (err) => {
  //         if (err) throw err;
  //         console.log('file deleted');
  //     });
  // }
}

function deleteImages(images) {
  if (images.length && images.length > 0) {
    images.forEach(function (element) {
      if (_fs["default"].existsSync('.' + element)) _fs["default"].unlink('.' + element, function (err) {
        if (err) throw err;
      });
    });
  }
}

var createPromise = function createPromise(query) {
  var newPromise = new Promise( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var result;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return query;

            case 3:
              result = _context.sent;
              resolve(result);
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              reject(_context.t0);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 7]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  return newPromise;
};

exports.createPromise = createPromise;

var localeFn = function localeFn(localeName) {
  return function (value, _ref2) {
    var req = _ref2.req;
    return req.__(localeName);
  };
};

exports.localeFn = localeFn;

function checkValidations(req) {
  var validationErrors = (0, _check.validationResult)(req).array({
    onlyFirstError: true
  });

  if (validationErrors.length > 0) {
    deleteTempImages(req);
    console.log(validationErrors);
    throw new _ApiError["default"](422, validationErrors);
  }

  return (0, _filter.matchedData)(req);
}

function handleImgs(req) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref3$attributeName = _ref3.attributeName,
      attributeName = _ref3$attributeName === void 0 ? 'images' : _ref3$attributeName,
      _ref3$isUpdate = _ref3.isUpdate,
      isUpdate = _ref3$isUpdate === void 0 ? false : _ref3$isUpdate;

  var errMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  if (req.files && req.files.length > 0 || isUpdate && req.body[attributeName]) {
    // .files contain an array of 'images'
    var images = [];

    if (isUpdate && req.body[attributeName]) {
      if (Array.isArray(req.body[attributeName])) images = req.body[attributeName];else images.push(req.body[attributeName]);
    }

    var _iterator = _createForOfIteratorHelper(req.files),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var img = _step.value;
        images.push((0, _utils.toImgUrl)(req, img));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return images;
  }

  throw new _ApiError["default"].UnprocessableEntity("".concat(attributeName, " are required")) || errMessage;
}

function handleImg(req) {
  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref4$attributeName = _ref4.attributeName,
      attributeName = _ref4$attributeName === void 0 ? 'img' : _ref4$attributeName,
      _ref4$isUpdate = _ref4.isUpdate,
      isUpdate = _ref4$isUpdate === void 0 ? false : _ref4$isUpdate;

  if (req.file || isUpdate && req.body[attributeName]) return req.body[attributeName] || (0, _utils.toImgUrl)(req, req.file);
  throw new _ApiError["default"].UnprocessableEntity("".concat(attributeName, " is required"));
}

function handleFiles(req) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref5$attributeName = _ref5.attributeName,
      attributeName = _ref5$attributeName === void 0 ? 'files' : _ref5$attributeName,
      _ref5$isUpdate = _ref5.isUpdate,
      isUpdate = _ref5$isUpdate === void 0 ? false : _ref5$isUpdate;

  if (req.files && req.files.length > 0 || isUpdate && req.body[attributeName]) {
    var files = [];

    if (isUpdate && req.body[attributeName]) {
      if (Array.isArray(req.body[attributeName])) files = req.body[attributeName];else files.push(req.body[attributeName]);
    }

    var _iterator2 = _createForOfIteratorHelper(req.files),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var file = _step2.value;
        files.push((0, _utils.toFileUrl)(req, file));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return files;
  }

  throw new _ApiError["default"].UnprocessableEntity("".concat(attributeName, " are required"));
}

function parseObject(arrayOfFields) {
  var update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var fieldName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'body';
  return function (req, res, next) {
    try {
      for (var index = 0; index < arrayOfFields.length; index++) {
        var name = arrayOfFields[index];

        if (req[fieldName][name]) {
          req[fieldName][name] = JSON.parse(req[fieldName][name]);
        }
      }

      return next();
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };
}

function fieldhandleImg(req) {
  var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref6$attributeName = _ref6.attributeName,
      attributeName = _ref6$attributeName === void 0 ? 'images' : _ref6$attributeName,
      _ref6$isUpdate = _ref6.isUpdate,
      isUpdate = _ref6$isUpdate === void 0 ? false : _ref6$isUpdate;

  if (req.files && req.files[attributeName].length > 0 || isUpdate && req.body[attributeName]) {
    // .files contain an array of 'images'
    var images = [];

    for (var index = 0; index < req.files[attributeName].length; index++) {
      var image = (0, _utils.toImgUrl)(req, req.files[attributeName][index]);
      images.push(image);
    }

    return images;
  }

  throw new _ApiError["default"].UnprocessableEntity("".concat(attributeName, " are required"));
}

function removeFile() {
  var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var files = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (files.length > 0) {
    files.forEach(function (element) {
      _fs["default"].unlink(element, function (err) {
        if (err) throw err;
      });
    });
  } else {
    _fs["default"].unlink(file, function (err) {
      if (err) throw err;
    });
  }
}