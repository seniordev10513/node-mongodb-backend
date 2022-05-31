import mongoose, { Schema } from "mongoose";
import mongooseI18n from 'mongoose-i18n-localize'
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
//import autoIncrement from 'mongoose-auto-increment';

const ShohnatSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        default: 0,
    },
    userId: {
        type: Number,
        required: true,
        ref:"user"
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
        country: {type: String, enum:["YE", "SA"]}, 
        aarea: {type: Number, ref: "place"}, 
        city: {type: Number, ref: "place"}, 
        region: {type: String}, 
        MDR: {type: Number, ref: "place"}, 
        detail: {type: String},
        geoLocation:[Number],
        
    },
    tasleemAdress: {
        country: {type: String, enum:["YE", "SA"]}, 
        aarea: {type: Number, ref: "place"}, 
        city: {type: Number, ref: "place"}, 
        region: {type: String}, 
        MDR: {type: Number, ref: "place"}, 
        detail: {type: String},
        geoLocation:[Number]
    },

    toperson: {
        name: {type: String},
        phone: {type: String},
        detail: {type: String}
    },

    isMostajal: {type: Boolean},

    price: {type: Number},
    oldPrice: {type: Number},
    priceStatus:{type: String, enum :["NONE","WAITTING","ACCEPTED"] ,default: "NONE"},
    shohnhStatus: {type: String, enum :["ORD","MND","HOSH","CAR","WSL","SOLM"] ,default: "ORD"},
    canceled:{type:Boolean , default:false},
    latest: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
  
}, { timestamps: true });

ShohnatSchema.index({userId: 1});
ShohnatSchema.index({ID: 1});


ShohnatSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


ShohnatSchema.plugin(mongooseI18n, {locales: ['en', 'ar']});
ShohnatSchema.plugin(autoIncrementSQ , { id: "shohnh_id", inc_field: "_id" });


export default mongoose.model('shohnat', ShohnatSchema);