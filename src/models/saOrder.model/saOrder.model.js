import mongoose, { Schema } from 'mongoose';
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
// import bcrypt from 'bcryptjs';
// import isEmail from 'validator/lib/isEmail';
import mongooseI18n from 'mongoose-i18n-localize'

const OrderStatus = (status) => {
    switch(status) {
        case "ORD" : return "في الإنتظار"
        case "ACPT" : return "تم قبول الطلب"
        case "BUY" : return "تم شراء الطلب"
        case "LOAD" : return "تم تحميل الطلب"
        case "WSL" : return "تم وصول الطلب"
        case "SOLM" : return "تم تسليم الشحنة"
    }
}
const userSchema = new Schema({
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
    description: {
        type: String,
        required: true,
    },
    link:{
        type: String
    },
    image:{
        type: String
    },
    price: {type: Number},
    oldPrice: {type: Number},
    priceStatus:{type: String, enum :["NONE","WAITTING","ACCEPTED"] ,default: "NONE"},
    status: {type: String, enum :["ORD","ACPT","BUY","LOAD","WSL","SOLM"] ,default: "ORD"},
    booked: {type: Boolean, default: false},
    admin:{
        type: Number,
        ref:"user"
    },
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
},{ timestamps: true });

//userSchema.index({ geoLocation: "2dsphere" });

// userSchema.pre('save', function (next) {
//     const account = this;
//     if (!account.isModified('password')) return next();
//     const salt = bcrypt.genSaltSync();
//     bcrypt.hash(account.password, salt).then(hash => {
//         account.password = hash;
//         next();
//     }).catch(err => console.log(err));
// });
// userSchema.methods.isValidPassword = function (newPassword, callback) {
//     let user = this;
//     bcrypt.compare(newPassword, user.password, function (err, isMatch) {
//         if (err)
//             return callback(err);
//         callback(null, isMatch);
//     });
// };

userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
        delete ret.__v;
    }
});

userSchema.plugin(mongooseI18n, {locales: ['en', 'ar']});
userSchema.plugin(autoIncrementSQ , { id: "saOrder", inc_field: "_id" });
export default mongoose.model('saOrder', userSchema);