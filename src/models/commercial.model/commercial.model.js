import mongoose, { Schema } from "mongoose";
import mongooseI18n from 'mongoose-i18n-localize'
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
//import autoIncrement from 'mongoose-auto-increment';

const CommercialSchema = new Schema({
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
    wholeTruck: {
        type: Boolean
    },
    truckType:{
        type: Number
    },
    lugType:{type: String},
    date:{From: Date, To: Date},
    From: {
        country: {type: String, enum:["YE", "SA"]}, 
        aarea: {type: Number, ref: "place"}, 
        city: {type: Number, ref: "place"}, 
        region: {type: String}, 
        MDR: {type: Number, ref: "place"}, 
        detail: {type: String},
        geoLocation:[Number],
        
    },
    To: {
        country: {type: String, enum:["YE", "SA"]}, 
        aarea: {type: Number, ref: "place"}, 
        city: {type: Number, ref: "place"}, 
        region: {type: String}, 
        MDR: {type: Number, ref: "place"}, 
        detail: {type: String},
        geoLocation:[Number]
    },
    CommercialStatus: {type: String, enum :["ORD","LOAD","MNF","WSL","SOLM"]},
    
    canceled: {
        type: Boolean,
        default: false
    },
    latest: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
  
}, { timestamps: true });

CommercialSchema.index({userId: 1});

CommercialSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


CommercialSchema.plugin(mongooseI18n, {locales: ['en', 'ar']});
CommercialSchema.plugin(autoIncrementSQ , { id: "commercial_id", inc_field: "_id" });


export default mongoose.model('commercial', CommercialSchema);