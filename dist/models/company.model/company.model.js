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

var autoIncrementSQ = require('mongoose-sequence')(_mongoose["default"]);

var locationSchema = new _mongoose.Schema({
  "long": {
    type: Number,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true,
    "default": "el-Giza"
  }
});
var CategorySchema = new _mongoose.Schema({
  name: {
    type: String,
    i18n: true
  },
  icon: {
    type: String
  },
  image: {
    type: String
  },
  category: {
    type: Number,
    ref: 'category'
  },
  product: {
    type: Boolean,
    "default": false
  }
});
var CompanySchema = new _mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  logo: {
    type: String
  },
  deleted: {
    type: Boolean,
    "default": false
  },
  instructionsForUse: {
    type: [{
      title: {
        ar: {
          type: String
        },
        en: {
          type: String
        }
      },
      description: {
        ar: {
          type: String
        },
        en: {
          type: String
        }
      }
    }],
    i18n: true,
    required: true
  },
  signupAsUser: {
    // الاشتراك كمستخدم
    type: String,
    i18n: true,
    required: true
  },
  signupAsUserFile: {
    type: String
  },
  signupAsStore: {
    // الاشتراك كمتجر
    type: String,
    i18n: true,
    required: true
  },
  signupAsStoreFile: {
    type: String
  },
  signupAsDriver: {
    // الاشتراك كمندوب
    type: String,
    i18n: true,
    required: true
  },
  signupAsDriverFile: {
    type: String
  },
  termsAndConditions: {
    // شروط واحكام المشتركين
    type: String,
    i18n: true,
    required: true
  },
  howToBuyAndShip: {
    // كيفية الشراء والشحن
    type: String,
    i18n: true,
    required: true
  },
  privacy: {
    // خصوصية تجول 
    type: String,
    i18n: true,
    required: true
  },
  commonQuestions: {
    type: [{
      question: {
        ar: {
          type: String
        },
        en: {
          type: String
        }
      },
      answer: {
        ar: {
          type: String
        },
        en: {
          type: String
        }
      }
    }],
    i18n: true,
    required: true
  },
  aboutUs: {
    type: String,
    i18n: true,
    required: true
  },
  androidUrl: {
    type: String,
    required: true
  },
  iosUrl: {
    type: String,
    required: true
  },
  socialLinks: {
    type: [{
      key: {
        type: String
      },
      value: {
        type: String
      }
    }],
    required: true
  },
  appShareCount: {
    type: Number,
    "default": 0
  },
  //////////////////////////////////////////////////
  // firstCategory: {
  //     type: CategorySchema
  // },
  // secondCategory: {
  //     type: CategorySchema
  // },
  // thirdCategory: {
  //     type: CategorySchema
  // },
  todayDeal: [Number],
  todayDealDate: {
    type: Date
  },
  /////////////////////////////////////////////////
  transportPrice: {
    // it will be with each trasport company 
    type: Number,
    "default": 0
  },
  numberOfRowsForAdvertisments: {
    type: Number,
    "default": 2
  },
  ///////////////////////////////////////////////
  taxes: {
    type: Number,
    "default": 10
  }
}, {
  timestamps: true
});
CompanySchema.set('toJSON', {
  transform: function transform(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
CompanySchema.plugin(autoIncrementSQ, {
  id: "company_id",
  inc_field: "_id"
});
CompanySchema.plugin(_mongooseI18nLocalize["default"], {
  locales: ['ar', 'en']
});

var _default = _mongoose["default"].model('company', CompanySchema);

exports["default"] = _default;