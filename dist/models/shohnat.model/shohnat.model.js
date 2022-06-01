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

var autoIncrementSQ = require('mongoose-sequence')(_mongoose["default"]); //import autoIncrement from 'mongoose-auto-increment';


var ShohnatSchema = new _mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    "default": 0
  },
  userId: {
    type: Number,
    required: true,
    ref: "user"
  },
  ID: {
    type: String
  },
  count: {
    type: Number
  },
  code: {
    type: String
  },
  images: {
    type: [String]
  },
  withTrans: {
    type: Boolean
  },
  trnsFrom: {
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
    },
    geoLocation: [Number]
  },
  tasleemAdress: {
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
    },
    geoLocation: [Number]
  },
  toperson: {
    name: {
      type: String
    },
    phone: {
      type: String
    },
    detail: {
      type: String
    }
  },
  isMostajal: {
    type: Boolean
  },
  price: {
    type: Number
  },
  oldPrice: {
    type: Number
  },
  priceStatus: {
    type: String,
    "enum": ["NONE", "WAITTING", "ACCEPTED"],
    "default": "NONE"
  },
  shohnhStatus: {
    type: String,
    "enum": ["ORD", "MND", "HOSH", "CAR", "WSL", "SOLM"],
    "default": "ORD"
  },
  canceled: {
    type: Boolean,
    "default": false
  },
  latest: {
    type: Boolean,
    "default": false
  },
  deleted: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});
ShohnatSchema.index({
  userId: 1
});
ShohnatSchema.index({
  ID: 1
});
ShohnatSchema.set('toJSON', {
  transform: function transform(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
ShohnatSchema.plugin(_mongooseI18nLocalize["default"], {
  locales: ['en', 'ar']
});
ShohnatSchema.plugin(autoIncrementSQ, {
  id: "shohnh_id",
  inc_field: "_id"
});

var _default = _mongoose["default"].model('shohnat', ShohnatSchema);

exports["default"] = _default;