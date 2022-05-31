var mongoose = require('mongoose');
//var mongoose_auto_increment = require('mongoose-auto-increment');
const autoIncrementSQ = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

var message = {
    _id: {
        type: String,
        required: true
    },
    sender: {
        type: Number,
        ref: 'user'
    },
    receiver: { type: Number, ref: 'user' },
    delivered: { type: Boolean, default: false },
    deliverDate: { type: Date },
    read: { type: Boolean, default: false },
    readDate: { type: Date },
    deleted:{ type: Boolean, default: false },

    admin : { type: Number, ref: 'user' },
    message: {
        text: { type: String },
        image: { type: String },
        video: { type: String },
        document: { type: String },
        audio: { type: String },
        location: { lat: { type: String }, long: { type: String } }
    },
    playedBy: [Number],
    lastMessage:{
        type:Boolean,
        default:true
    },
    //////////////////////////////////////////////////////////////
    deleted: {
        type: Boolean,
        default: 0
    }
}

var messageSchema = new Schema(message, { timestamps: true });
messageSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

// messageSchema.plugin(autoIncrementSQ , { id: "message_id", inc_field: "_id" });

var messageModel = mongoose.model('message', messageSchema);
export default messageModel;
