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
    name: {
        type: String,
        required: true,
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


userSchema.plugin(autoIncrementSQ , { id: "truck_id", inc_field: "_id" });
export default mongoose.model('truck', userSchema);