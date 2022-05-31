import mongoose, { Schema } from "mongoose";
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
import mongooseI18nLocalize from 'mongoose-i18n-localize';



const ChatSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    receiver:{
        type: Number,
        ref: 'user'
    },
    chatInitiator:{
        type: Number,
        ref: 'user'
    },
    type:{
        type: String,
    },
}, { timestamps: true });

ChatSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});
/**
 * @param {String} userId - id of user
 * @return {Array} array of all chatroom that the user belongs to
 */
ChatSchema.statics.getChatRoomsByUserId = async function (userId, admin=false) {
  try {
    let rooms = [];
    if(!admin){
      rooms = await this.find({$or: [{receiver: userId}, {chatInitiator: userId}]}).sort({ created_at: -1 });
    }else{
      rooms = await this.find({ type: 'ADMIN' });
    }
    return rooms;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {String} roomId - id of chatroom
 * @return {Object} chatroom
 */
ChatSchema.statics.getChatRoomByRoomId = async function (roomId) {
  try {
    const room = await this.findOne({ _id: roomId });
    return room;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Array} userIds - array of strings of userIds
 * @param {String} chatInitiator - user who initiated the chat
 * @param {CHAT_ROOM_TYPES} type
 */
ChatSchema.statics.initiateChat = async function (receiver, chatInitiator, admin=false) {
  try {
    const type = admin?'ADMIN':'USER';
    const availableRoom = await this.findOne({
      receiver,
      chatInitiator,
      type,
    });
    if (availableRoom) {
      return {
        isNew: false,
        message: 'retrieving an old chat room',
        chatRoomId: availableRoom._doc._id,
        type: availableRoom._doc.type,

      };
    }

    const newRoom = await this.create({ receiver, chatInitiator, type, _id: false});
    return {
      isNew: true,
      message: 'creating a new chatroom',
      chatRoomId: newRoom._doc._id,
      type: newRoom._doc.type,
    };
  } catch (error) {
    console.log('error on start chat method', error);
    throw error;
  }
}
ChatSchema.plugin(autoIncrementSQ , { id: "chat_id", inc_field: "_id" });
ChatSchema.plugin(mongooseI18nLocalize,{locales:['ar','en']});
export default mongoose.model('Chat', ChatSchema);
