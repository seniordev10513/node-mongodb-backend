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
    office: {type: Number, ref: "office"},
    userId: {type: Number, ref: "user"}, 
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

officeSchema.index({office: 1});
officeSchema.index({userId: 1});

officeSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


officeSchema.plugin(mongooseI18n, {locales: ['en', 'ar']});
officeSchema.plugin(autoIncrementSQ , { id: "officeClicks_id", inc_field: "_id" });


export default mongoose.model('officeClicks', officeSchema);