import mongoose, { Schema } from 'mongoose';
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
// import bcrypt from 'bcryptjs';
// import isEmail from 'validator/lib/isEmail';
import mongooseI18n from 'mongoose-i18n-localize'


const userSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        default: 0
    },
    placeChar: {
        type: String
    },
    name: {
        type: String,
        required: true,
        i18n: true
    },
    hasChild:{
        type: Boolean
    },
    parent:{
        type: Number,
        ref: 'category'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    type:{
        type: String,
        // enum: ['COUNTRY','AREA','CITY','TOWN','REGYON', 'HOSH', 'TAJMEA'],
        enum: ['COUNTRY','MDN','MHF','MDR',"MP"],

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
userSchema.plugin(autoIncrementSQ , { id: "place_id", inc_field: "_id" });
export default mongoose.model('place', userSchema);