import mongoose, { Schema } from "mongoose";
import mongooseI18n from 'mongoose-i18n-localize'
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
//import autoIncrement from 'mongoose-auto-increment';

const oCarSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        default: 0
    },
    ID: {
        type: String
    },
    userId: {
        type: Number,
        ref:"user"
    },
    From: {
        country: {type: String, ref: 'place'},
        city: {type: Number, ref: 'place'},
        MP: {type: Number, ref: 'place'},
        region: {type: String}, 
    },
    To: {
        country: {type: String, ref: 'place'},
        city: {type: Number, ref: 'place'},
        MP: {type: Number, ref: 'place'},
        region: {type: String}, 
    },
    finished :{type: Boolean , default: false},
    canceled:{type: Boolean,default:false},
    date: {type: Date},
    lefted: {type: Number},
    added: {type: Number,default:0},
    max: {type: Number},
    isCompleted: {type: Boolean},
    locNow: {type: Number, ref: 'place'},
    isArrive: {type: Boolean},
    type: {type: [{type:String,enum: ['Pers', 'Trav', 'Trade']}]},
    PassPrice:{
        type: {type:String},
        price: {type:Number},
    },
    deleted: {
        type: Boolean,
        default: false
    },
  
}, { timestamps: true });

oCarSchema.index({ID: 1});
oCarSchema.index({userId: 1});

oCarSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


oCarSchema.plugin(mongooseI18n, {locales: ['en', 'ar']});
oCarSchema.plugin(autoIncrementSQ , { id: "oCar_id", inc_field: "_id" });


export default mongoose.model('onlineCar', oCarSchema);