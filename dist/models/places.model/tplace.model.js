"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _mongooseI18nLocalize = _interopRequireDefault(require("mongoose-i18n-localize"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var autoIncrementSQ = require('mongoose-sequence')(_mongoose["default"]); // import bcrypt from 'bcryptjs';
// import isEmail from 'validator/lib/isEmail';


var userSchema = new _mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    "default": 0
  },
  placeChar: {
    type: String
  },
  name: {
    type: String,
    required: true,
    i18n: true
  },
  hasChild: {
    type: Boolean
  },
  parent: {
    type: Number,
    ref: 'category'
  },
  deleted: {
    type: Boolean,
    "default": false
  },
  type: {
    type: String,
    // enum: ['COUNTRY','AREA','CITY','TOWN','REGYON', 'HOSH', 'TAJMEA'],
    "enum": ['COUNTRY', 'MDN', 'MHF', 'MDR', "MP"]
  }
}, {
  timestamps: true
}); //userSchema.index({ geoLocation: "2dsphere" });
// userSchema.pre('save', function (next) {
//     const account = this;
//     if (!account.isModified('password')) return next();
//     const salt = bcrypt.genSaltSync();
//     bcrypt.hash(account.password, salt).then(hash => {
//         account.password = hash;
//         next();
//     }).catch(err => console.log(err));
// });
// userSchema.methods.isValidPassword = function (newPassword, callback) {
//     let user = this;
//     bcrypt.compare(newPassword, user.password, function (err, isMatch) {
//         if (err)
//             return callback(err);
//         callback(null, isMatch);
//     });
// };

userSchema.set('toJSON', {
  transform: function transform(doc, ret, options) {
    ret.id = ret._id;
    delete ret.password;
    delete ret._id;
    delete ret.__v;
  }
});
userSchema.plugin(_mongooseI18nLocalize["default"], {
  locales: ['en', 'ar']
});
userSchema.plugin(autoIncrementSQ, {
  id: "place_id",
  inc_field: "_id"
});

var _default = _mongoose["default"].model('place', userSchema);

exports["default"] = _default;