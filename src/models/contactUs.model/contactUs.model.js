import mongoose, { Schema } from "mongoose";
const autoIncrementSQ = require('mongoose-sequence')(mongoose);

const contactUsSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    name:{
        type: String
    },
    email: {
        type: String
    },
    notes: {
        type: String,
        required:true
    },
    phone: {
        type: String,
        required:true
    },
    reply:[String],

    user:{
        type:Number
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

contactUsSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

contactUsSchema.plugin(autoIncrementSQ , { id: "contact_id", inc_field: "_id" });
export default mongoose.model('contactUs', contactUsSchema);