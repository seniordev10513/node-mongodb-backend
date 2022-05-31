import Message from "../../models/message.model/message.model";
import { checkExistThenGet, checkExist } from "../../helpers/CheckMethods";
import { createPromise, handleImg } from '../shared.controller/shared.controller'
import User from '../../models/user.model/user.model';
import SocketEvents from '../../socketEvents'
import { body } from "express-validator/check";
import { checkValidations } from '../../controllers/shared.controller/shared.controller';
import i18n from 'i18n'
import ApiError from "../../helpers/ApiError";
import notificationController from '../notif.controller/notif.controller'
import ApiResponse from "../../helpers/ApiResponse";
import socketEvents from '../../socketEvents'


// let popQuery = [{ path: 'sender', model: 'user' }, { path: 'receiver', model: 'user' }]

let countUnseen = async (id)=>{
    try {
        let query = {
            deleted: false,
            'reciver.user': id ,
            'reciver.read': false
        };
        const chatCount = await Message.count(query);
        chatNSP.to('room-' + id).emit(SocketEvents.NewMessageCount, { chatCount: chatCount });
    } catch (error) {
        throw error ;
    }
}


let handelNewMessageSocket = async (message) => {
    try {
        await countUnseen(message.reciver.user.id)
        chatNSP.to('room-' + message.reciver.user.id).emit(SocketEvents.NewMessage, { message: message });
        if (message.reciver.user.activeChatHead == false) {
            let text = (message.message.text) ? {en: message.message.text , ar :message.message.text} :{en: 'New Message' , ar: ' رسالة جديدة'};
            await notificationController.pushNotification(message.reciver.user.id, 'MESSAGE', message.sender.id, text[message.reciver.user.language])
        }
    } catch (error) {
        console.log(error);
    }
}


let updateSeen = async (user,friend)=>{
    try {
        await Message.updateMany({ deleted: false, 'reciver.user': user,'reciver.read':false,sender:friend }, { $set: { 'reciver.read': true, 'reciver.readDate': new Date() } })
        await countUnseen(user);
    } catch (error) {
        throw error ;
    }
}

let createMessage = async (user, receiver, text)=>{

}

export default {

    validate() {
        let validation = [
            body('text').optional().not().isEmpty().withMessage(() => i18n.__('messageRequired')),
            body('receiver').optional().not().isEmpty().withMessage(() => i18n.__('reciverRequired')),
        ]
        return validation;
    },

    async create(req, res, next) {
        try {
            // let user = req.user;
            const data = checkValidations(req);


            let user = data.sender;
            if (data.sender == data.receiver) {
                return next(new ApiError(400,i18n.__('invalidReciver')));
            }

            let message ,friend;

            if (data.reciver) {
                friend = await checkExistThenGet(data.reciver, User, { deleted: false });
                message = {reciver : { user: friend.id }, sender: user.id, message: {} };
            }else{
                message = { sender: user.id, message: {} };
            }


            if (!(data.text || req.file)) {
                return next(new ApiError(404, i18n.__('messageRequired')));
            }

            if (data.text) {
                message.message.text = data.text;
            }
            if (req.file) {
                let file = handleImg(req, { attributeName: 'file' });
                if (req.file.mimetype.includes('image/')) {
                    message.message.image = file;
                } else if (req.file.mimetype.includes('video/')) {
                    message.message.video = file;
                } else if (req.file.mimetype.includes('application/')) {
                    message.message.document = file;
                } else {
                    return next(new ApiError(404, i18n.__('fileTypeError')));
                }
            }

            message.lastMessage = true;
            let createdMessage = await Message.create(message);
            createdMessage = await Message.populate(createdMessage, popQuery);
            res.status(200).send(createdMessage);
            if (data.reciver) {
                await Message.updateMany({ deleted:false , _id:{$ne:createdMessage.id} ,$or:[{sender:user.id ,'reciver.user':friend.id },{sender:friend.id ,'reciver.user':user.id}]},
                                        {$set:{lastMessage:false}});
                handelNewMessageSocket(createdMessage);
            }else{
                adminNSP.emit(socketEvents.NEWHELPMESSAGE, {message:createdMessage });

            }

        } catch (error) {
            next(error)
        }
    },
    async getById(req, res, next) {
        try {
            let { id } = req.params;
            let message = await checkExistThenGet(id, Message, { deleted: false });
            res.status(200).send(message);
        } catch (error) {
            next(error)
        }
    },

    async deleteForEveryOne(req, res, next) {
        try {
            let { id } = req.params;
            let message = await checkExistThenGet(id, Message, { deleted: false });
            message.deleted = true;
            await message.save();
            res.status(200).send('Deleted');
        } catch (error) {
            next(error)
        }
    },

    async getLastContacts(req, res, next){
        try {
            let user = req.query.userId;
            let page = +req.query.page || 1, limit = +req.query.limit || 20;
            let query = { deleted: false , lastMessage:true , $or: [{ sender: +user ,'reciver.user' : {$ne:null}}, {'reciver.user': +user,sender : {$ne:null} } ] };
            let messages = await Message.find(query).populate(popQuery).sort({ _id: -1 }).limit(limit).skip((page - 1) * limit);
            let resolveData = [];
            let data = []
            let length = messages.length;
            for (let index = 0; index < length; index++) {
                let sender = (messages[index].sender.id != user) ? messages[index].sender.id : messages[index].reciver.user.id;
                resolveData.push(createPromise(Message.count({deleted:false,'reciver.read':false , 'reciver.user': +user  , sender : sender })))
            }
            let resolveResult = await Promise.all(resolveData);
            for (let index = 0; index < length; index++) {
                data.push({message:messages[index] , unReadCount : resolveResult[index] });

            }
            messages = data ;
            let messagesCount = await Message.count(query);
            const pageCount = Math.ceil(messagesCount / limit);
            res.send(new ApiResponse(messages, page, pageCount, limit, messagesCount, req));
        } catch (error) {
            next(error);
        }
    },

    async getChatHistory(req, res, next) {
        try {
            let user = req.user.id;
            let {friend} = req.query;
            let page = +req.query.page || 1,
                limit = +req.query.limit || 20;
            let query = {
                deleted: false,
                $or: [{ sender: user ,'reciver.user':friend},
                      {sender: friend ,  'reciver.user': user }
                ]
            };
            var chats = await Message.find(query).populate(popQuery).sort({ _id: -1 }).limit(limit).skip((page - 1) * limit);
            const chatCount = await Message.count(query);
            const pageCount = Math.ceil(chatCount / limit);
            res.send(new ApiResponse(chats, page, pageCount, limit, chatCount, req));
            await Message.updateMany({ deleted: false , sender:friend , 'reciver.user': user ,'reciver.read':false}, { $set: { 'reciver.read': true, 'reciver.readDate': new Date() } })
        } catch (error) {
            next(error)
        }
    },

    ///////////////////////// Admin ////////////////////////////


    async adminChat(req, res, next){
        try {
            let user = req.user;
            let page = +req.query.page || 1, limit = +req.query.limit || 20;
            let query = { deleted: false , lastMessage:true , 'reciver.user':{$ne:null} , sender:{$ne:null} };
            let messages = await Message.find(query).populate(popQuery).sort({ _id: -1 }).limit(limit).skip((page - 1) * limit);
            let messagesCount = await Message.count(query);
            const pageCount = Math.ceil(messagesCount / limit);
            res.send(new ApiResponse(messages, page, pageCount, limit, messagesCount, req));
        } catch (error) {
            next(error);
        }
    },

    async getChatHistoryForAdmin(req, res, next) {
        try {

            let {friend , user} = req.query;
            let page = +req.query.page || 1,
                limit = +req.query.limit || 20;
            let query = {
                deleted: false,
                $or: [{ sender: user ,'reciver.user':friend},
                      {sender: friend ,  'reciver.user': user }
                ]
            };
            var chats = await Message.find(query).populate(popQuery).sort({ _id: -1 }).limit(limit).skip((page - 1) * limit);
            const chatCount = await Message.count(query);
            const pageCount = Math.ceil(chatCount / limit);
            res.send(new ApiResponse(chats, page, pageCount, limit, chatCount, req));
        } catch (error) {
            next(error)
        }
    },

    ////////////////////////// Help center //////////////////////

    async getMyHelpCenterChat(req, res, next){
        try {
            let user = req.user;
            let page = +req.query.page || 1, limit = +req.query.limit || 20;
            let query = {}
            if ((req.user.type == 'ADMIN') || (req.user.type == 'SUB_ADMIN') ) {
                if (!req.query.user) {
                    return next(new ApiError(404,i18n.__('userRequired')) );
                }
                user =  await checkExistThenGet(+req.query.user,User,{deleted:false})
                query = { deleted: false , $or:[{sender:user.id,'reciver.user': null },{sender:null,'reciver.user': user.id}]  };
            }else{
                query = { deleted: false , $or:[{sender:user.id,'reciver.user': null },{sender:null,'reciver.user': user.id}]  };
            }

            let messages = await Message.find(query).populate(popQuery).sort({ _id: -1 }).limit(limit).skip((page - 1) * limit);
            let messagesCount = await Message.count(query);
            const pageCount = Math.ceil(messagesCount / limit);
            res.send(new ApiResponse(messages, page, pageCount, limit, messagesCount, req));
            await Message.updateMany({ deleted: false , sender:null , 'reciver.user': user ,'reciver.read':false}, { $set: { 'reciver.read': true, 'reciver.readDate': new Date() } })

        } catch (error) {
            next(error);
        }
    },


    async adminReplyHelpCenterChat(req, res, next){
        try {
            let user = req.user;
            let data = checkValidations(req);
            if (!data.reciver) {
                return next(new ApiError(400,i18n.__('reciverRequired')));
            }
            let message ,friend;
            friend = await checkExistThenGet(data.reciver, User, { deleted: false });
            message = {reciver : { user: friend.id }, admin: user.id, message: {} };


            if (!(data.text || req.file)) {
                return next(new ApiError(404, i18n.__('messageRequired')));
            }

            if (data.text) {
                message.message.text = data.text;
            }
            if (req.file) {
                let file = handleImg(req, { attributeName: 'file' });
                if (req.file.mimetype.includes('image/')) {
                    message.message.image = file;
                } else if (req.file.mimetype.includes('video/')) {
                    message.message.video = file;
                } else if (req.file.mimetype.includes('application/')) {
                    message.message.document = file;
                } else {
                    return next(new ApiError(404, i18n.__('fileTypeError')));
                }
            }

            //message.lastMessage = true;
            let createdMessage = await Message.create(message);
            createdMessage = await Message.populate(createdMessage, popQuery);
            res.status(200).send({message:createdMessage});
            createdMessage.sender = req.user
            handelNewMessageSocket(createdMessage);

        } catch (error) {
            next(error);
        }
    },




    countUnseen,
    updateSeen,
    // countUnseenForAdmin

    /*.aggregate()
                                        .match(query)
                                        .addFields({'reciverUser':"$reciver.user" , 'reciverRead':"$reciver.read" })
                                        .group({_id:'$_id', unReadCount: {$sum:{ $cond: [{$and:[{'reciverUser': +user.id},{'reciverRead':false}]},1, 0] } } });
                                        // .group({_id:{case_1: {sender : +user.id , reciver : '$reciver.user' } , case_2 :{} },  unReadCount: {$sum:{ $cond: [{$and:[{'reciverUser': +user.id},{'reciverRead':false}]},1, 0] } } });
    */
}


// async getChatHistory(req, res, next) {
//     try {
//         let user = req.user.id;
//         let {friend} = req.query;
//         let page = +req.query.page || 1,
//             limit = +req.query.limit || 20;
//         let query = {
//             deleted: false,
//             $or: [{ sender: user ,'reciver.user':friend},
//                   {sender: friend ,  'reciver.user': user }
//             ]
//         };
//         await Message.updateMany({ deleted: false, 'reciver.user': user ,'reciver.read':false}, { $set: { 'reciver.read': true, 'reciver.readDate': new Date() } })
//         var chats = await Message.find(query).populate(popQuery).sort({ _id: -1 }).limit(limit).skip((page - 1) * limit);
//         const chatCount = await Message.count(query);
//         const pageCount = Math.ceil(chatCount / limit);
//         res.send(new ApiResponse(chats, page, pageCount, limit, chatCount, req));
//     } catch (error) {
//         next(error)
//     }
// },


// let countUnseenForAdmin = async ()=>{
//     try {
//         let query = {
//             deleted: false,
//             'reciver.user': null,
//             'reciver.read': false,
//             lastMessage: true
//         };
//         const chatCount = await Message.count(query);
//         chatNSP.to('room-admin').emit(SocketEvents.NewMessageCount, {count:chatCount });
//     } catch (error) {
//         throw error ;
//     }
// }
