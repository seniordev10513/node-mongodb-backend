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
    text: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false
    },
},{ timestamps: true });

userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
        delete ret.__v;
    }
});


userSchema.plugin(autoIncrementSQ , { id: "words_id", inc_field: "_id" });
export default mongoose.model('word', userSchema);