import mongoose, { Schema } from "mongoose";
import mongooseI18n from 'mongoose-i18n-localize'
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
//import autoIncrement from 'mongoose-auto-increment';

const exchangeSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        default: 0
    },
    place: {
        type: Number,
    },
    price: {
        type: Number,
    },
    name: {
        type: String,
    },
    canceled:{type: Boolean,default:false},
    deleted: {
        type: Boolean,
        default: false
    }
  
}, { timestamps: true });


exchangeSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


exchangeSchema.plugin(mongooseI18n, {locales: ['en', 'ar']});
exchangeSchema.plugin(autoIncrementSQ , { id: "exchange_id", inc_field: "_id" });


export default mongoose.model('exchange', exchangeSchema);