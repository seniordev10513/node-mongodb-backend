"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _isEmail = _interopRequireDefault(require("validator/lib/isEmail"));

var _mongooseI18nLocalize = _interopRequireDefault(require("mongoose-i18n-localize"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var autoIncrementSQ = require('mongoose-sequence')(_mongoose["default"]);

var userSchema = new _mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    "default": 0
  },
  rate: {
    type: Number,
    "default": 0,
    ref: 'rates'
  },
  fromaddresses: [{
    address: {
      country: {
        type: String,
        "enum": ["YE", "SA"]
      },
      aarea: {
        type: Number,
        ref: "place"
      },
      city: {
        type: Number,
        ref: "place"
      },
      region: {
        type: String
      },
      MDR: {
        type: Number,
        ref: "place"
      },
      detail: {
        type: String
      }
    },
    geoLocation: {
      type: {
        type: String,
        "enum": ['Point'],
        "default": 'Point'
      },
      coordinates: {
        type: [Number],
        "default": [30.98758, 30.867589]
      }
    },
    name: {
      type: String
    }
  }],
  toaddresses: [{
    address: {
      country: {
        type: String,
        "enum": ["YE", "SA"]
      },
      aarea: {
        type: Number,
        ref: "place"
      },
      city: {
        type: Number,
        ref: "place"
      },
      region: {
        type: String
      },
      MDR: {
        type: Number,
        ref: "place"
      },
      detail: {
        type: String
      }
    },
    geoLocation: {
      type: {
        type: String,
        "enum": ['Point'],
        "default": 'Point'
      },
      coordinates: {
        type: [Number],
        "default": [30.98758, 30.867589]
      }
    },
    name: {
      type: String
    }
  }],
  name: {
    type: String,
    required: true
  },
  deviceId: {
    type: String
  },
  token: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    trim: true
  },
  banded: {
    type: Boolean,
    "default": false
  },
  haveTrip: {
    type: Boolean,
    "default": false
  },
  TripId: {
    type: Number
  },
  country: {
    type: String,
    "enum": ["YE", "SA"],
    trim: true
  },
  city: {
    //المحافظة
    type: Number,
    ref: "place"
  },
  places: {
    //المحافظة
    type: [Number],
    ref: "place"
  },
  mantaqa: {
    //المنطقة
    type: String,
    trim: true
  },
  tajmeea: {
    //منطقة التجميع
    type: String,
    trim: true
  },
  ////////////////////////////////////////////////
  email: {
    type: String,
    trim: true,
    validate: {
      validator: function validator(email) {
        return (0, _isEmail["default"])(email);
      },
      message: 'Invalid Email Syntax'
    }
  },
  type: {
    type: String,
    "enum": ['ADMIN', 'SUB_ADMIN', 'CLIENT', 'DRIVER'],
    required: true,
    "default": 'CLIENT'
  },
  deleted: {
    type: Boolean,
    "default": false
  },
  image: {
    type: String
  },
  notification: {
    type: Boolean,
    "default": true
  },
  countryCode: {
    type: String,
    "default": '+966'
  },
  // countryKey:{
  //     type:String,
  //     default:'SA'
  // },
  activeChatHead: {
    type: Boolean,
    "default": false
  },
  /////////////////////////////////////////
  phones: [String],
  // socialLinks:{
  //     type: [{key:{type:String } , value:{type:String}}]
  // },
  slider: [String],
  searchKeys: [String],
  views: {
    type: Number,
    "default": 0
  },
  follow: {
    type: Boolean,
    "default": false
  },
  favorite: {
    type: Boolean,
    "default": false
  },
  order: {
    type: Number
  },
  isDriver: {
    type: Boolean,
    "default": false
  },
  car: {
    image: {
      type: String
    },
    carClass: {
      type: String,
      "enum": ["TANK", "TXI", "ONETST", "TWOTST", "GMS", "FAN", "SDN", "BDN", "TRL"]
    },
    carModel: {
      type: Number
    },
    carType: {
      type: String
    },
    carID: {
      type: String
    },
    signUpDate: {
      type: Date
    },
    acceptDate: {
      type: Date
    },
    fromCity: {
      type: [Number],
      ref: "place"
    },
    toCity: {
      type: [Number],
      ref: "place"
    },
    isPers: {
      type: Boolean
    },
    isTrav: {
      type: Boolean
    },
    isTrade: {
      type: Boolean
    }
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
  id: "user_id",
  inc_field: "_id"
});

var _default = _mongoose["default"].model('user', userSchema);

exports["default"] = _default;