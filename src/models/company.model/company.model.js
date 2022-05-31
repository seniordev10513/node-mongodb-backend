import mongoose, { Schema } from "mongoose";
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
import mongooseI18nLocalize from 'mongoose-i18n-localize';

let locationSchema = new Schema({
    long: { type: Number, required: true },
    lat: { type: Number, required: true },
    address: { type: String, required: true, default: "el-Giza" }
});

let CategorySchema = new Schema({
    name: { type: String, i18n: true },
    icon: { type: String },
    image: { type: String },
    category: { type: Number, ref: 'category' },
    product: { type: Boolean, default: false },
});

const CompanySchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    logo: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
    instructionsForUse: {
        type: [
            {
                title: { ar: { type: String }, en: { type: String } },
                description: { ar: { type: String }, en: { type: String } }
            }
        ],
        i18n: true,
        required: true
    },
    signupAsUser: { // الاشتراك كمستخدم
        type: String,
        i18n: true,
        required: true
    },
    signupAsUserFile:{
        type: String
    },
    signupAsStore: { // الاشتراك كمتجر
        type: String,
        i18n: true,
        required: true
    },
    signupAsStoreFile:{
        type: String
    },
    signupAsDriver: { // الاشتراك كمندوب
        type: String,
        i18n: true,
        required: true
    },
    signupAsDriverFile:{
        type: String
    },
    termsAndConditions: { // شروط واحكام المشتركين
        type: String,
        i18n: true,
        required: true
    },
    howToBuyAndShip: { // كيفية الشراء والشحن
        type: String,
        i18n: true,
        required: true
    },
    privacy: { // خصوصية تجول 
        type: String,
        i18n: true,
        required: true
    },
    commonQuestions: {
        type: [
            {
                question: { ar: { type: String }, en: { type: String } },
                answer: { ar: { type: String }, en: { type: String } }
            }
        ],
        i18n: true,
        required: true
    },
    aboutUs: {
        type: String,
        i18n: true,
        required: true
    },
    androidUrl: {
        type: String,
        required: true
    },
    iosUrl: {
        type: String,
        required: true
    },
    socialLinks: {
        type: [{ key: { type: String }, value: { type: String } }],
        required: true
    },
    appShareCount: {
        type: Number,
        default: 0
    },
    //////////////////////////////////////////////////
    // firstCategory: {
    //     type: CategorySchema
    // },
    // secondCategory: {
    //     type: CategorySchema
    // },
    // thirdCategory: {
    //     type: CategorySchema
    // },
    todayDeal:[Number],
    todayDealDate:{
        type:Date
    },
    /////////////////////////////////////////////////
    transportPrice: { // it will be with each trasport company 
        type: Number,
        default: 0
    },
    numberOfRowsForAdvertisments: {
        type: Number,
        default: 2
    },
    ///////////////////////////////////////////////
    taxes:{
        type:Number,
        default:10
    }


}, { timestamps: true });

CompanySchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


CompanySchema.plugin(autoIncrementSQ , { id: "company_id", inc_field: "_id" });
CompanySchema.plugin(mongooseI18nLocalize, { locales: ['ar', 'en'] });

export default mongoose.model('company', CompanySchema);