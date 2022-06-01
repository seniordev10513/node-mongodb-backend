"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkExistThenGet = exports.checkExist = void 0;
exports.checkLanguage = checkLanguage;
exports.validIds = exports.validId = exports.isYear = exports.isNumeric = exports.isLng = exports.isLat = exports.isInternationNo = exports.isImgUrl = exports.isArray = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ApiError = _interopRequireDefault(require("./ApiError"));

var _i18n = _interopRequireDefault(require("i18n"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// const capitalizeFirstChar = (name) => name.charAt(0).toUpperCase() + name.slice(1);
var checkExist = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(id, Model) {
    var extraQuery,
        errorMessage,
        model,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            extraQuery = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            errorMessage = _args.length > 3 && _args[3] !== undefined ? _args[3] : '';

            if ((0, _typeof2["default"])(extraQuery) != 'object') {
              errorMessage = extraQuery;
              extraQuery = {};
            }

            if (!validId(id)) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return Model.findOne(_objectSpread({
              _id: id
            }, extraQuery)).lean();

          case 6:
            model = _context.sent;

            if (!model) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return");

          case 9:
            throw new _ApiError["default"](404, errorMessage || "".concat(Model.modelName, " Not Found"));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function checkExist(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.checkExist = checkExist;

function checkLanguage(arModel, enModel, req) {
  var language = _i18n["default"].getLocale(req);

  try {
    if (language == 'ar') {
      return arModel;
    } else {
      return enModel;
    }
  } catch (error) {
    throw new _ApiError["default"](400, 'Can Not Set Language.');
  }
}

var checkExistThenGet = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id, Model) {
    var findQuery,
        errorMessage,
        populateQuery,
        selectQuery,
        model,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            findQuery = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {
              populate: '',
              select: ''
            };
            errorMessage = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : '';
            populateQuery = findQuery.populate || '', selectQuery = findQuery.select || '';

            if ((0, _typeof2["default"])(findQuery) != 'object') {
              errorMessage = findQuery;
              findQuery = {};
            } else {
              delete findQuery.populate;
              delete findQuery.select;
            }

            if (!validId(id)) {
              _context2.next = 10;
              break;
            }

            _context2.next = 7;
            return Model.findOne(_objectSpread({
              _id: id
            }, findQuery)).populate(populateQuery).select(selectQuery);

          case 7:
            model = _context2.sent;

            if (!model) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", model);

          case 10:
            throw new _ApiError["default"](404, errorMessage || "".concat(Model.modelName, " Not Found"));

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function checkExistThenGet(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); // export async function checkExistThenUpdate(id, Model, updateQuery, updateOptions = { populate: '', select: '' }, errorMessage = '') {
//     let populateQuery = updateQuery.populate, selectQuery = updateQuery.select;
//     delete updateQuery.populate;
//     delete updateQuery.select;
//     if (validId(id)) {
//         let model = await Model.findByIdAndUpdate(id, updateQuery, { new: true })
//             .populate(populateQuery).select(selectQuery);
//         if (model)
//             return model;
//     }
//     throw new ApiError(404, errorMessage || `${Model.modelName} Not Found`);
// }


exports.checkExistThenGet = checkExistThenGet;

var validId = function validId(id) {
  return isNumeric(id);
};

exports.validId = validId;

var validIds = function validIds(ids) {
  return isArray(ids) && ids.every(function (id) {
    return validId(id);
  });
};

exports.validIds = validIds;

var isNumeric = function isNumeric(value) {
  return Number.isInteger(parseInt(value));
};

exports.isNumeric = isNumeric;

var isArray = function isArray(values) {
  return Array.isArray(values);
};

exports.isArray = isArray;

var isImgUrl = function isImgUrl(value) {
  return /\.(jpeg|jpg|png|PNG|JPG|JPEG)$/.test(value);
};

exports.isImgUrl = isImgUrl;

var isLat = function isLat(value) {
  return /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/.test(value);
};

exports.isLat = isLat;

var isLng = function isLng(value) {
  return /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/.test(value);
};

exports.isLng = isLng;

var isYear = function isYear(value) {
  return /^\d{4}$/.test(value);
};

exports.isYear = isYear;

var isInternationNo = function isInternationNo(value) {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value);
};

exports.isInternationNo = isInternationNo;