import mongoose, { Schema } from "mongoose";
import mongooseI18n from 'mongoose-i18n-localize'
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
//import autoIncrement from 'mongoose-auto-increment';

const BandedSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: Number,
        ref: 'user'
    },
    deviceId: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    }
  
}, { timestamps: true });

BandedSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


BandedSchema.plugin(mongooseI18n, {locales: ['en', 'ar']});
BandedSchema.plugin(autoIncrementSQ , { id: "banded_id", inc_field: "_id" });


export default mongoose.model('banded', BandedSchema);