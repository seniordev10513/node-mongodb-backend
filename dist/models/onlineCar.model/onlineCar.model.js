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


var oCarSchema = new _mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    "default": 0
  },
  ID: {
    type: String
  },
  userId: {
    type: Number,
    ref: "user"
  },
  From: {
    country: {
      type: String,
      ref: 'place'
    },
    city: {
      type: Number,
      ref: 'place'
    },
    MP: {
      type: Number,
      ref: 'place'
    },
    region: {
      type: String
    }
  },
  To: {
    country: {
      type: String,
      ref: 'place'
    },
    city: {
      type: Number,
      ref: 'place'
    },
    MP: {
      type: Number,
      ref: 'place'
    },
    region: {
      type: String
    }
  },
  finished: {
    type: Boolean,
    "default": false
  },
  canceled: {
    type: Boolean,
    "default": false
  },
  date: {
    type: Date
  },
  lefted: {
    type: Number
  },
  added: {
    type: Number,
    "default": 0
  },
  max: {
    type: Number
  },
  isCompleted: {
    type: Boolean
  },
  locNow: {
    type: Number,
    ref: 'place'
  },
  isArrive: {
    type: Boolean
  },
  type: {
    type: [{
      type: String,
      "enum": ['Pers', 'Trav', 'Trade']
    }]
  },
  PassPrice: {
    type: {
      type: String
    },
    price: {
      type: Number
    }
  },
  deleted: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});
oCarSchema.index({
  ID: 1
});
oCarSchema.index({
  userId: 1
});
oCarSchema.set('toJSON', {
  transform: function transform(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
oCarSchema.plugin(_mongooseI18nLocalize["default"], {
  locales: ['en', 'ar']
});
oCarSchema.plugin(autoIncrementSQ, {
  id: "oCar_id",
  inc_field: "_id"
});

var _default = _mongoose["default"].model('onlineCar', oCarSchema);

exports["default"] = _default;