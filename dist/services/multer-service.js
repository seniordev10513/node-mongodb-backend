"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multerSaveTo = multerSaveTo;

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _ApiError = _interopRequireDefault(require("../helpers/ApiError"));

var _mime = _interopRequireDefault(require("mime"));

var _v = _interopRequireDefault(require("uuid/v4"));

var fileFilter = function fileFilter(req, file, cb) {
  // const filetypes = /jpeg|jpg|png|image\/\*/;
  // const mimetype = filetypes.test(file.mimetype);
  // const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // if (mimetype && extname) {
  //     return cb(null, true);
  // }
  // cb(new ApiError.UnprocessableEntity('File upload only supports images types'));
  return cb(null, true);
};

function multerSaveTo(folderName) {
  var storage = _multer["default"].diskStorage({
    destination: function destination(req, file, cb) {
      //console.log(file)
      //console.log("file in mulllllllllllllllllllllllllllllllllllllllllllllllllllllrt")
      var dest = 'uploads/' + folderName;
      (0, _mkdirp["default"])(dest, function (err) {
        if (err) return cb(new _ApiError["default"](500, 'Couldn\'t create dest'));
        cb(null, dest);
      });
    },
    filename: function filename(req, file, cb) {
      //console.log(file)
      //console.log("file in fileeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeename")
      if (!file.originalname.includes('.')) {
        var extension = file.mimetype.split('/')[1];
        file.originalname = file.originalname + '.' + extension;
      }

      cb(null, (0, _v["default"])() + _path["default"].extname(file.originalname));
    }
  });

  return (0, _multer["default"])({
    storage: storage,
    //fileFilter,
    limits: {
      fieldNameSize: 1024 * 1024 * 10,
      fieldSize: 1024 * 1024 * 50 // limit 10mb

    }
  });
}