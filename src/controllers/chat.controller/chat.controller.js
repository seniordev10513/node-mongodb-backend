import ChatRoomModel from '../../models/chat.model/chat.model';
import ChatMessageModel from '../../models/chatMessages.model/chatMessages.model';
import notificationController from '../notif.controller/notif.controller';

import User from '../../models/user.model/user.model';
import ApiResponse from "../../helpers/ApiResponse";
import { checkExistThenGet } from "../../helpers/CheckMethods";
import { body } from 'express-validator/check';
import { checkValidations } from "../shared.controller/shared.controller";
import i18n from 'i18n';
import notifyController from '../notif.controller/notif.controller';
// import config from '../../config'
const populateQuery = [
    { path: 'user', model: 'user' }
];


export default {

  validateInitiate() {
      let validations = [
          body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
          body('receiver').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
      ];
      return validations;
  },
  async initiate(req, res, next) {
    try {
      const validation = checkValidations(req);
      const { userId, receiver } = validation;
      let user = await User.findOne({ deleted: false, _id: userId });
      if(user){
        const admin = user.type=='ADMIN'?true:false;
        const chatRoom = await ChatRoomModel.initiateChat(receiver, userId,admin);
        res.status(200).send(chatRoom)
      }else{
        next('user_error');
      }
    } catch (err) {
      next(err);
    }
  },
  validatePostMessage() {
      let validations = [
          body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
          body('messageText').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
          body('roomId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
      ];
      return validations;
  },
  async postMessage(req, res, next) {
    try {
      const validation = checkValidations(req);
      const chatRoomId = validation.roomId;
      const room = await  ChatRoomModel.findOne({ _id: chatRoomId });
      const text = validation.messageText;
      const user = validation.userId;

      let sender = await User.findOne({ deleted: false, _id: user });
      if(sender.banded){
          res.status(202).send({banded:true});
      }else{
        let post = await ChatMessageModel.create({
          _id: false,
          chatRoomId,
          text,
          user,
          sent: true,
          received: false,
        });
        let sendId = 0;
      
        if(room.receiver == user){
          sendId = room.chatInitiator;
        }else{
          sendId = room.receiver;
        }
        let sendTo = await User.findOne({ deleted: false, _id: sendId }, 'type');
        let adminCheck = false;
        if(sendTo.type == "ADMIN") adminCheck = true;
        if(adminCheck){
          chatNSP.to('room-admin' + sendId).emit('NewMessage', { data: post });

        }else{
          chatNSP.to('room-'+sendId).emit('NewMessage', { data: post });
        }
        let sendTO = await User.findOne({ deleted: false, _id: sendId });
        await exports.default.getCountChat(sendTO.id,adminCheck);
        await notificationController.pushNotification(sendTO, 'MESSAGE', chatRoomId,text,  sender.name );

        res.status(200).send(post);
      }
    } catch (error) {
      next(error);
    }
  },
  async getRecentConversation(req, res, next) {
    try {
      const currentLoggedUser = req.query.userId;
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      };
      let user = await User.findOne({ deleted: false, _id: currentLoggedUser });
      if(user){

        let admin = false;
        if(user.type=='ADMIN') admin = true;
        const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser, admin);
        let roomreturn = [];

        for(let room of rooms) {
          let newRoom = {};
          if(room.receiver != currentLoggedUser){
            newRoom['receiver'] = await User.findOne({ deleted: false, _id: room.receiver }, 'id name');

          }else{
            newRoom['receiver'] = await User.findOne({ deleted: false, _id: room.chatInitiator }, 'id name');
          }
          newRoom['lastMessage'] =  await ChatMessageModel.findOne({ chatRoomId: room.id }, 'text').sort({ createdAt: -1 });

          newRoom['count'] =  await ChatMessageModel.countDocuments({user: { $ne: currentLoggedUser }, chatRoomId: room.id, received: false });

          newRoom['id'] = room.id;
          roomreturn.push(newRoom);
        }
        res.status(200).send(roomreturn);
      }else{
        next('user_error');

      }
    } catch (error) {
      next(error);
    }
  },
  async getConversationByRoomId(req, res, next) {
    try {
      const { roomId, userId } = req.query;
      console.log(roomId);
      if(roomId == 'undefined') next('roomID');
      let receiver = {};
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId);
      if (!room) {
        next();
      }
      // const receiver = await User.find(room.userIds
      console.log(room);
      if(userId)
      if(room.receiver != userId){
        receiver = await User.findOne({ deleted: false, _id: room.receiver }, 'id name');

      }else{
        receiver = await User.findOne({ deleted: false, _id: room.chatInitiator }, 'id name');
      }
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 20;
      const conversation = await ChatMessageModel.
      find({chatRoomId: roomId})
      .skip(limit*page)
      .limit(limit)
      .sort({ createdAt: -1 });
      const chatCount = await ChatMessageModel.countDocuments({chatRoomId: roomId});
      const pageCount = Math.ceil(chatCount / limit);
      res.status(200).send({conversation: conversation, pageCount: pageCount, receiver: receiver});

    } catch (error) {
      next(error);
    }
  },
  async getCountChat(id, admin = false) {
      try {
          var toRoom = id;
          let counter = 0;
          const rooms = await ChatRoomModel.getChatRoomsByUserId(id, admin);
          for(let room of rooms) {
            counter += await ChatMessageModel.countDocuments({user: { $ne: id }, chatRoomId: room.id, received: false });

          }
          console.log(counter);
          console.log(admin);

          if (!admin) {
              chatNSP.to('room-'+toRoom).emit("NewMessageCount", { count: counter });
          }
          else {
              chatNSP.to('room-admin'+toRoom).emit("NewMessageCount", { count: counter });
          }
      } catch (err) {
          console.log(err.message);
      }
  },
  async markConversationReadByRoomId(req, res, next) {
    try {
      console.log(req.body);
      const roomId  = req.body.roomId;
      const currentLoggedUser = req.body.userId;
      const receiverId = req.body.receiverId;
      const user = await User.findOne({ deleted: false, _id: currentLoggedUser });
      const receiver = await User.findOne({ deleted: false, _id: receiverId });
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId);
      if (!room) {
        next('No room exists for this id');
      }else{

      const result = await ChatMessageModel.updateMany(
        {
          'chatRoomId':roomId,
          'user': { $ne: currentLoggedUser }
        },
        {
          received: true,
        },
        {
          multi: true
        },
      );
      let admin = false;
      if(receiver.type=='ADMIN') admin = true
      console.log(admin);
      await exports.default.getCountChat(currentLoggedUser,!admin);
      if (!admin) {
          chatNSP.to('room-'+receiverId).emit("MarkAsRead", { roomId: roomId });
      }
      else {
          chatNSP.to('room-admin'+receiverId).emit("MarkAsRead", { roomId: roomId });
      }

      return res.status(200).send(result);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
}
