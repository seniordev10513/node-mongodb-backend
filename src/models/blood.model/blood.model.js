import mongoose, { Schema } from "mongoose";
import mongooseI18n from 'mongoose-i18n-localize'
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
//import autoIncrement from 'mongoose-auto-increment';

const bloodSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: Number,
        ref: 'user'
    },
    age: {
        type: Number,
    },
    From: {
        country: {type: String, enum:["YE", "SA"]}, 
        city: {type: Number, ref: "place"}, 
        region: {type: String}, 
        MDR: {type: Number, ref: "place"}, 
    },
    contact: {
        phone: {type: String},
        whats: {type: String},
        others: {type: String},
    },
    name: {
        type: String,
    },
    groub: {
        type: String, enum: ['A+', 'AB+', 'O+', 'B+','A-', 'AB-', 'O-', 'B-']
    },

    canceled:{type: Boolean,default:false},
    
    deleted: {
        type: Boolean,
        default: false
    }
  
}, { timestamps: true });

bloodSchema.index({carId: 1});
bloodSchema.index({userId: 1});

bloodSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


bloodSchema.plugin(mongooseI18n, {locales: ['en', 'ar']});
bloodSchema.plugin(autoIncrementSQ , { id: "blood_id", inc_field: "_id" });


export default mongoose.model('blood', bloodSchema);