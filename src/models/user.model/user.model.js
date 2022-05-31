import mongoose, { Schema } from 'mongoose';
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
import bcrypt from 'bcryptjs';
import isEmail from 'validator/lib/isEmail';
import mongooseI18n from 'mongoose-i18n-localize'


const userSchema = new Schema({
    _id: {
        type: Number,
        required: true,
        default: 0
    },
    rate:{
        type:Number,
        default:0,
        ref:'rates'
    },
    fromaddresses: [
        {address: {country:{type: String, enum:["YE", "SA"]}, aarea: {type: Number, ref: "place"}, city: {type: Number, ref: "place"}, region: {type: String},MDR:{type: Number, ref: "place"},detail: {type: String}},
        geoLocation: {
                     type: { type: String, enum: ['Point'], default: 'Point' },
                     coordinates: { type: [Number], default: [30.98758, 30.867589] }
                    },
        name: { type: String}
        }
        ],
    toaddresses: [
        {address: {country:{type: String, enum:["YE", "SA"]}, aarea: {type: Number, ref: "place"}, city: {type: Number, ref: "place"}, region: {type: String},MDR:{type: Number, ref: "place"}, detail: {type: String}},
        geoLocation: {
                        type: { type: String, enum: ['Point'], default: 'Point' },
                        coordinates: { type: [Number], default: [30.98758, 30.867589] }
                    },
        name: { type: String}
        }
        ],
    name: {
        type: String,
         required: true,
    },
    deviceId: {
        type: String,
    },
    token: {
        type: String,
         required: false,
    },
    phone: {
        type: String,
        trim: true
    },
    banded:{
        type: Boolean,
        default:false
    },
    haveTrip:{
        type: Boolean,
        default:false
    },
    TripId:{
        type: Number
    },
    country: {
        type: String,
        enum:["YE","SA"],
        trim: true
    },
    city: {              //المحافظة
        type: Number,
        ref: "place"
    },
    places: {              //المحافظة
        type: [Number],
        ref: "place"
    },
    mantaqa: {              //المنطقة
        type: String,
        trim: true
    },
    tajmeea: {              //منطقة التجميع
        type: String,
        trim: true
    },


    ////////////////////////////////////////////////
    email: {
        type: String,
        trim: true,
        validate: {
            validator: (email) => isEmail(email),
            message: 'Invalid Email Syntax'
        }
    },
    type: {
        type: String,
        enum: ['ADMIN','SUB_ADMIN','CLIENT','DRIVER'],
        required: true,
        default:'CLIENT'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    image:{
        type: String
    },
    notification:{
        type:Boolean,
        default:true
    },
    countryCode:{
        type:String,
        default:'+966'
    },
    // countryKey:{
    //     type:String,
    //     default:'SA'
    // },
    activeChatHead:{
        type: Boolean,
        default: false
    },
    /////////////////////////////////////////
    phones:[String],
    // socialLinks:{
    //     type: [{key:{type:String } , value:{type:String}}]
    // },
    slider:[String],
    searchKeys:[String],
    views:{
        type: Number,
        default: 0
    },
    follow:{
        type:Boolean,
        default:false
    },
    favorite:{
        type:Boolean,
        default:false
    },
    order:{
        type:Number
    },
    isDriver:{
        type:Boolean,
        default:false
    },
    car: {
        image: {type: String},
        carClass: {type: String, enum: ["TANK","TXI","ONETST","TWOTST","GMS", "FAN", "SDN", "BDN", "TRL"]},
        carModel: {type: Number},
        carType: {type: String},
        carID: {type: String},
        signUpDate: {type: Date},
        acceptDate: {type: Date},
        fromCity: {type: [Number], ref: "place"},
        toCity: {type: [Number], ref: "place"},
        isPers: {type: Boolean},
        isTrav: {type: Boolean},
        isTrade: {type: Boolean}
    }
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
userSchema.plugin(autoIncrementSQ , { id: "user_id", inc_field: "_id" });
export default mongoose.model('user', userSchema);
