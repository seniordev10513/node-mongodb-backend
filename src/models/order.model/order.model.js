import mongoose, { Schema } from "mongoose";
import mongooseI18n from "mongoose-i18n-localize";
const autoIncrementSQ = require('mongoose-sequence')(mongoose);

let productSchema = new Schema({ 
    product: { type: Number, required: true},
    quantity: { type: Number, required: true },
    price:{type: Number ,required: true},
    offer:{type: Number ,default:0},
    priceAfterOffer:{type: Number},
    // color:{type: Number},
    // size:{type: Number},
    taxes:{  type: Number },
    taxesValue:{   type: Number  }
});

let traderSchema = new Schema({
    trader: {type: Number},
    products: { type: [productSchema], required: true},
    status: {type: String,enum: ['WAITING','ACCEPTED','REJECTED','CANCELED','PREPARED','HAND_OVERED','SHIPPED','DELIVERED'],default: 'WAITING'},
    rejectReason:{ type: String },
    deliveredDate:{ type: Date,default: new Date() },

    price:{  type: Number ,default : 0},
    transportPrice:{ type: Number,  default: 0 },
    discountValue:{ type: Number ,default:0},
    totalPrice:{ type: Number ,default:0},
    transportCompany : {type:Number,required:true}
})
const orderSchema = new Schema({
    order_id: {
        type: Number,
        required: true,
        default: 0
    },
    deleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: Number,
        ref: 'user',
        required: true
    },
    traders:{
        type:[traderSchema]
    },
    address: {
        type: Number,
        ref: 'address',
        
    },
    notes:{
        type: String
    },
    status: {
        type: String,
        enum: ['WAITING',
            'ACCEPTED',
            'REJECTED',
            'CANCELED',
            'SHIPPED','PREPARED','HAND_OVERED',
            'DELIVERED'],
        default: 'WAITING'
    },
    rejectReason:{
        type: String
    },
    paymentMethod: {
        type: String,
        enum: ['CASH', 'CREDIT']
    },
    creditCard: {
        type: Number,
        ref: 'credit'
    },
    
    //////////////////////////////////
    image:{
        type:String
    },
    replied:{
        type:Boolean
    },
    ///////////////////////////////
    deliveredDate:{
        type: Date,
        default: new Date()
    },
    orderNumber:{
        type:String,
        default:'23443'
    },
    adminInformed:{
        type:Boolean,
        default:false
    },
    
    /////////////////////////////////////////
    promoCode:{
        type: Number,
        ref:'promocode'
    },
    price:{
        type: Number
    },
    totalPrice:{
        type: Number
    },
   
    discountValue:{
        type: Number,
        default:0
    },
    
    ///////////////////////////////////////////////////////
    checkoutId:{
        type:String
    },
    paymentId:{
        type:String
    },
    paymentStatus:{
        type:String,
        enum:['PENDING','FAILED','SUCCESSED','REFUNDED'],
        
    }

});

// orderSchema.set('toJSON', {
//     transform: function (doc, ret, options) {
//         ret.id = ret._id;
//         delete ret._id;
//         delete ret.__v;
//     }
// });
//const autoIncrement = autoIncrementSQ(mongoose.connection);
orderSchema.plugin(autoIncrementSQ , { inc_field: "order_id" });
orderSchema.plugin(mongooseI18n, { locales: ['ar', 'en'] });

export default mongoose.model('order', orderSchema);