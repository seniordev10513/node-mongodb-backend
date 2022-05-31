import mongoose, { Schema } from "mongoose";
import mongooseI18n from 'mongoose-i18n-localize'
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
//import autoIncrement from 'mongoose-auto-increment';

const oMsfrSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        default: 0
    },
    ID: {
        type: String
    },
    numPers: {
        type: Number
    },
    userId: {
        type: Number,
        ref:"user"
    },
    From: {
        country: {type: String},
        city: {type: Number, ref: 'place'},
        MP: {type: Number, ref: 'place'},
        region: {type: String}, 
    },
    To: {
        country: {type: String},
        city: {type: Number, ref: 'place'},
        MP: {type: Number, ref: 'place'},
        region: {type: String}, 
    },
    canceled :{type: Boolean , default: false},
    finished :{type: Boolean , default: false},
    withTrans: {type: Boolean},
    transFrom:{
        country: {type: String},
        city: {type: Number, ref: 'place'},
        region: {type: String}, 
        detail: {type: String},
        geoLocation: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], default: [30.98758, 30.867589] }
           },
    },
    FromDate: {type: Date},
    ToDate: {type: Date},
    AddedTo: {type: Number, ref: 'onlineCar'},
    ordered: {
        type: Boolean,
        default: false
    },
    rate: {type: Number},
    
    deleted: {
        type: Boolean,
        default: false
    },
  
}, { timestamps: true });

oMsfrSchema.index({userId: 1});
oMsfrSchema.index({AddedTo: 1});


oMsfrSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

oMsfrSchema.plugin(mongooseI18n, {locales: ['en', 'ar']});
oMsfrSchema.plugin(autoIncrementSQ , { id: "oMsfr_id", inc_field: "_id" });


export default mongoose.model('onlineMsfr', oMsfrSchema);