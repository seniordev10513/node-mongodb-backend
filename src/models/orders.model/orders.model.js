import mongoose, { Schema } from "mongoose";
import mongooseI18n from 'mongoose-i18n-localize'
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
//import autoIncrement from 'mongoose-auto-increment';

const orderSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: Number,
        ref: 'user'
    },
    carId: {
        type: Number,
        ref: 'user'
    },
    orderOf: {
        type: String,
        enum: ['CLIENT', 'DRIVER']
    },
    stat: {
        type: String, enum: ['WAITTING', 'CANCELED', 'REFUSED', 'ACCEPTED']
    },

    canceled:{type: Boolean,default:false},
    
    deleted: {
        type: Boolean,
        default: false
    }
  
}, { timestamps: true });

orderSchema.index({carId: 1});
orderSchema.index({userId: 1});

orderSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


orderSchema.plugin(mongooseI18n, {locales: ['en', 'ar']});
orderSchema.plugin(autoIncrementSQ , { id: "order_id", inc_field: "_id" });


export default mongoose.model('order', orderSchema);