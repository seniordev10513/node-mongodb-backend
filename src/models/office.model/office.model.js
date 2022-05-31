import mongoose, { Schema } from "mongoose";
import mongooseI18n from 'mongoose-i18n-localize'
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
//import autoIncrement from 'mongoose-auto-increment';

const officeSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        default: 0
    },
    initDate: {
        type: Date,
    },
    From: {
        city: {type: Number, ref: "place"}, 
        MDR: {type: Number, ref: "place"}, 
    },
    phone: {
        type: String,
    },
    name: {
        type: String,
    },
    services: {
        type: [String],
    },
    canceled:{type: Boolean,default:false},
    deleted: {
        type: Boolean,
        default: false
    }
  
}, { timestamps: true });


officeSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


officeSchema.plugin(mongooseI18n, {locales: ['en', 'ar']});
officeSchema.plugin(autoIncrementSQ , { id: "office_id", inc_field: "_id" });


export default mongoose.model('office', officeSchema);