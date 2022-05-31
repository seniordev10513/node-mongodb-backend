import mongoose, { Schema } from "mongoose";
const autoIncrementSQ = require('mongoose-sequence')(mongoose);
import mongooseI18nLocalize from 'mongoose-i18n-localize';



const MESSAGE_TYPES = {
  TYPE_TEXT: "text",
};


const chatMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true
    },
    chatRoomId: {
      type: Number,
      ref: 'Chat',
    },
    text: String,
    type: {
      type: String,
      default: () => MESSAGE_TYPES.TYPE_TEXT,
    },
    user: {
      type: Number,
      ref: 'user',
    } ,
    system: { type: Boolean, default: false },
    sent: { type: Boolean, default: true },
    received: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "chatmessages",
  }
);

chatMessageSchema.index({chatRoomId: 1});
chatMessageSchema.index({user: 1});

/**
 * This method will create a post in chat
 *
 * @param {String} roomId - id of chat room
 * @param {String} message - message you want to post in the chat room
 * @param {String} postedByUser - user who is posting the message
 */
chatMessageSchema.statics.createPostInChatRoom = async function (chatRoomId, text, user, system=false) {
  try {
    const post = await this.create({
      _id: false,
      chatRoomId,
      text,
      user,
      system,
    });
    const aggregate = await this.aggregate([
      // get post where _id = post._id
      { $match: { _id: post._id } },
      // do a join on another table called users, and
      // get me a user whose _id = postedByUser
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        }
      },
      { $unwind: '$user' },
      // do a join on another table called chatrooms, and
      // get me a chatroom whose _id = chatRoomId
      {
        $lookup: {
          from: 'chatrooms',
          localField: 'chatRoomId',
          foreignField: '_id',
          as: 'chatRoomInfo',
        }
      },
      { $unwind: '$chatRoomInfo' },
      // group data
      {
        $group: {
          _id: '$chatRoomInfo._id',
          postId: { $last: '$_id' },
          chatRoomId: { $last: '$chatRoomInfo._id' },
          text: { $last: '$text' },
          type: { $last: '$type' },
          user: { $last: 'user' },
          system: { $last: 'system' },
          sent: { $last: 'sent' },
          received: { $last: 'received' },
          createdAt: { $last: '$createdAt' },
          updatedAt: { $last: '$updatedAt' },
        }
      }
    ]);
    console.log(aggregate);
    return aggregate[0];
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Number} chatRoomId - chat room id
 */
chatMessageSchema.statics.getConversationByRoomId = async function (chatRoomId, options = {}) {
  try {
    console.log(chatRoomId);
    return this.aggregate([
      { $match: { chatRoomId: chatRoomId } },
      { $sort: { createdAt: -1 } },
      // do a join on another table called users, and
      // get me a user whose _id = postedByUser
      {
        $lookup: {
          from: 'users',
          localField: 'postedByUser',
          foreignField: '_id',
          as: 'postedByUser',
        }
      },
      { $unwind: "$postedByUser" },
      // apply pagination
      { $skip: options.page * options.limit },
      { $limit: options.limit },
      { $sort: { createdAt: 1 } },
    ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @param {String} chatRoomId - chat room id
 * @param {String} currentUserOnlineId - user id
 */
chatMessageSchema.statics.markMessageRead = async function (chatRoomId, currentUserOnlineId) {
  try {
    return this.updateMany(
      {
        chatRoomId,
        'readByRecipients.readByUserId': { $ne: currentUserOnlineId }
      },
      {
        $addToSet: {
          readByRecipients: { readByUserId: currentUserOnlineId }
        }
      },
      {
        multi: true
      }
    );
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Array} chatRoomIds - chat room ids
 * @param {{ page, limit }} options - pagination options
 * @param {String} currentUserOnlineId - user id
 */
chatMessageSchema.statics.getRecentConversation = async function (chatRoomIds, options, currentUserOnlineId) {
  try {
    return this.aggregate([
      { $match: { chatRoomId: { $in: chatRoomIds } } },
      {
        $group: {
          _id: '$chatRoomId',
          messageId: { $last: '$_id' },
          chatRoomId: { $last: '$chatRoomId' },
          message: { $last: '$message' },
          type: { $last: '$type' },
          postedByUser: { $last: '$postedByUser' },
          createdAt: { $last: '$createdAt' },
          readByRecipients: { $last: '$readByRecipients' },
        }
      },
      { $sort: { createdAt: -1 } },
      // do a join on another table called users, and
      // get me a user whose _id = postedByUser
      {
        $lookup: {
          from: 'users',
          localField: 'postedByUser',
          foreignField: '_id',
          as: 'postedByUser',
        }
      },
      { $unwind: "$postedByUser" },
      // do a join on another table called chatrooms, and
      // get me room details
      {
        $lookup: {
          from: 'chatrooms',
          localField: '_id',
          foreignField: '_id',
          as: 'roomInfo',
        }
      },
      { $unwind: "$roomInfo" },
      { $unwind: "$roomInfo.userIds" },
      // do a join on another table called users
      {
        $lookup: {
          from: 'users',
          localField: 'roomInfo.userIds',
          foreignField: '_id',
          as: 'roomInfo.userProfile',
        }
      },
      { $unwind: "$readByRecipients" },
      // do a join on another table called users
      {
        $lookup: {
          from: 'users',
          localField: 'readByRecipients.readByUserId',
          foreignField: '_id',
          as: 'readByRecipients.readByUser',
        }
      },

      {
        $group: {
          _id: '$roomInfo._id',
          messageId: { $last: '$messageId' },
          chatRoomId: { $last: '$chatRoomId' },
          message: { $last: '$message' },
          type: { $last: '$type' },
          postedByUser: { $last: '$postedByUser' },
          readByRecipients: { $addToSet: '$readByRecipients' },
          roomInfo: { $addToSet: '$roomInfo.userProfile' },
          createdAt: { $last: '$createdAt' },
        },
      },
      // apply pagination
      { $skip: options.page * options.limit },
      { $limit: options.limit },
    ]);
  } catch (error) {
    throw error;
  }
}

chatMessageSchema.plugin(autoIncrementSQ , { id: "chat_message_id", inc_field: "_id" });

export default mongoose.model("ChatMessage", chatMessageSchema);
