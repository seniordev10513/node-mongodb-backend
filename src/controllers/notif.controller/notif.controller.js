import User from "../../models/user.model/user.model";
import { checkExistThenGet, checkExist } from "../../helpers/CheckMethods";
import Notification from "../../models/notification.model/notification.model";
import ApiResponse from "../../helpers/ApiResponse";
import { sendPushNotification } from '../../services/push-notification-service'
import { checkValidations, handleImg } from '../shared.controller/shared.controller';
import { body } from 'express-validator/check';
import ApiError from "../../helpers/ApiError";
import i18n from 'i18n';
import socketEvents from '../../socketEvents';
// import config from '../../config'
const populateQuery = [
    { path: 'resource', model: 'user' },
    { path: 'target', model: 'user' },
    { path: 'users', model: 'user' },
    { path: 'order', model: 'order' },
    { path: 'promoCode', model: 'promocode' },
];

let create = async (resource, target, description, subject, subjectType, order,promoCode) => {
    try {
        var query = { resource, target, description, subject, subjectType }
        if (subjectType == "PROMOCODE") query.promoCode = subject;
        if (subjectType == "ORDER") query.order = subject;
        if (subjectType == "CHANGE_ORDER_STATUS") query.order = subject;

        if (subject && subjectType) {
            query.subjectType = subjectType;
            query.subject = subject;
        }
        if (order) {
            query.order = order;
        }
        if (promoCode) {
            query.promoCode =promoCode
        }

        var newNotification = new Notification(query);
        await newNotification.save();

        let counter = await Notification.count({ deleted: false, target: target, informed: { $ne: target } });
        notificationNSP.to('room-' + target).emit(socketEvents.NotificationsCount, { count: counter });
    } catch (error) {
        console.log(error.message)
    }
}

let create_notif = async (resource, target, subject, text, subjectType, subjectId) => {
    try {
        var query = { resource, target, subject, text }
        let notification = {};
        await Notification.create({_id: false, resource: resource, target: target, title: subject, text: text, subjectType: subjectType, subjectId: subjectId}).then(resp => {
          notification = resp;
        }).catch(e => {console.error(e)});

        return notification;

      //  notificationNSP.to('room-' + target).emit(socketEvents.NotificationsCount, { count: counter });
    } catch (error) {
        console.log(error.message)
    }
}
export default {

    async findMyNotification(req, res, next) {
        try {
            let user = req.user._id;
            let page = +req.query.page || 1, limit = +req.query.limit || 20;
            let query = {
                deleted: false,
                $or: [{ target: user }, { users: { $elemMatch: { $eq: user } } }, { type: 'ALL' }],
                type: { $nin: ['MAIL', 'SMS'] },
                createdAt: { $gte: req.user.createdAt },
                usersDeleted: { $ne: user }
            };
            let { subjectType } = req.query
            if (subjectType) query = { subjectType: 'ADMIN', deleted: false, usersDeleted: { $ne: user } };

            var notifs = await Notification.find(query).populate(populateQuery)
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip((page - 1) * limit);

            notifs = Notification.schema.methods.toJSONLocalizedOnly(notifs, i18n.getLocale());
            const notifsCount = await Notification.count(query);
            const pageCount = Math.ceil(notifsCount / limit);
            if (!subjectType) {
                query = { $or: [{ target: user }, { users: user, type: 'USERS' }], informed: { $ne: user }, deleted: false, usersDeleted: { $ne: user } }

                await Notification.updateMany(query, { $addToSet: { informed: user } });
                var toRoom = 'room-' + user;
                notificationNSP.to(toRoom).emit(socketEvents.NotificationsCount, { count: 0 });
            }

            res.send(new ApiResponse(notifs, page, pageCount, limit, notifsCount, req));
        } catch (err) {
            next(err);
        }
    },

    async read(req, res, next) {
        try {
            let { notifId } = req.params;
            let notif = await checkExistThenGet(notifId, Notification);
            notif.read = true;
            await notif.save();
            res.send('notif read');
        } catch (error) {
            next(error);
        }
    },

    async unread(req, res, next) {
        try {
            let { notifId } = req.params;
            let notif = await checkExistThenGet(notifId, Notification);
            notif.read = false;
            await notif.save();
            res.send('notif unread');
        } catch (error) {
            next(error);
        }
    },

    async getCountNotification(id, admin = false) {
        try {
            var toRoom = id;
            var query = {
                target: id,
                deleted: false,
                read: false,
            }
            var notifsCount = await Notification.countDocuments(query);
            if (!admin) {
                var chargeCount = await Notification.countDocuments({...query,subjectType:{$in:["SHOHNAT","COMMERCIAL","SHOHNAT-PRICE"]}});
                var saOrderCount = await Notification.countDocuments({...query,subjectType:{$in:["SAORDER","SAORDER-PRICE"]}});
                var tripCount = await Notification.countDocuments({...query,subjectType:{$in:["TRIP","ORDER"]}});
                notificationNSP.to('room-'+toRoom).emit("NotificationsCount", { count: notifsCount,chargeCount:chargeCount,saOrderCount:saOrderCount,tripCount:tripCount });
            }
            else {
                console.log('admin');
                notificationNSP.to('room-admin' + toRoom).emit("NotificationsCount", { count: notifsCount });
            }
        } catch (err) {
            console.log(err.message);
        }
    },
    // NewNotification


    async pushNotification(targetUser, subjectType, subjectId, text, title) {
        try {
          //  var user = await checkExistThenGet(targetUser, User, { deleted: false });
            // if (user.notification) {
                let data = { targetUser: targetUser.token, subjectType: subjectType, subjectId: subjectId, text: text, title: title }
                let creatednotif = await create_notif('',targetUser.id, title, text, subjectType, subjectId);
                let adminCheck = false;
                if(targetUser.type=="ADMIN") adminCheck = true;
                await exports.default.getCountNotification(targetUser.id,adminCheck);
                sendPushNotification(data);
                if(adminCheck){
                  notificationNSP.to('room-admin' + targetUser.id).emit('NewNotification', { notification: data });

                }else{
                  notificationNSP.to('room-' + targetUser.id).emit('NewNotification', { notification: data });
                }

            // } else {
            //     return true;
            // }
        } catch (error) {
          console.log("error.message")
          console.log(error.message)
        }
    },

    validateAdminSendToAll() {
        let validations = [
            body('titleOfNotification.ar').not().isEmpty().withMessage('titleOfNotification is required'),
            body('titleOfNotification.en').not().isEmpty().withMessage('titleOfNotification is required'),
            body('text.ar').not().isEmpty().withMessage('text is required'),
            body('text.en').not().isEmpty().withMessage('text is required'),

        ];
        return validations;
    },

    async adminSendToAllUsers(req, res, next) {
        try {
            let user = req.user;
            if (user.type != 'ADMIN' && user.type != 'SUB_ADMIN') {
                return next(new ApiError(403, ('admin.auth')));
            }
            let validatedBody = checkValidations(req);
            if (req.file) {
                let image = await handleImg(req, { attributeName: 'image', isUpdate: false });
                validatedBody.image = image;
            }
            let notifiObj = { resource: req.user.id, type: "ALL", subjectType: "ADMIN", description: validatedBody.text };
            if(validatedBody.image) notifiObj.image = validatedBody.image
            await Notification.create(notifiObj)
            var allUsers = await User.find({ deleted: false, type: 'CLIENT' });
            allUsers.forEach(async (user) => {
                if (user.notification) {
                    if (user.language == 'ar') {
                        sendPushNotification(
                            {
                                targetUser: user,
                                subjectType: "ADMIN",
                                subjectId: 1,
                                text: validatedBody.text.ar,
                                title: validatedBody.titleOfNotification.ar,
                                image: (validatedBody.image) ? process.env.BACKEND_ENDPOINT + validatedBody.image : ''
                            });
                    }
                    else {
                        sendPushNotification(
                            {
                                targetUser: user,
                                subjectType: "ADMIN",
                                subjectId: 1,
                                text: validatedBody.text.en,
                                title: validatedBody.titleOfNotification.en,
                                image: (validatedBody.image) ?  process.env.BACKEND_ENDPOINT + validatedBody.image : ''
                            });
                    }
                }
                notificationNSP.to('room-'+user.id).emit(socketEvents.NotificationsCount, { count:await Notification.count({$or:[{target: user.id},{users:user.id}],informed: { $ne: user.id },deleted: false,usersDeleted: { $ne: user.id }}) });

            });
            res.status(200).send("Successfully send to all users");
        } catch (error) {
            next(error)
        }
    },

    validateAdminSendToSpecificUsers() {
        let validations = [
            body('titleOfNotification.ar').not().isEmpty().withMessage('titleOfNotification is required'),
            body('titleOfNotification.en').not().isEmpty().withMessage('titleOfNotification is required'),
            body('text.ar').not().isEmpty().withMessage('text is required'),
            body('text.en').not().isEmpty().withMessage('text is required'),
            body('users').not().isEmpty().withMessage('users is required').isArray().withMessage('must be array').custom(async (val, { req }) => {
                for (let index = 0; index < val.length; index++) {
                    await checkExist(val[index], User, { deleted: false });
                }
                return true;
            }),
        ];
        return validations;
    },
    async adminSendToAllSpecificUsers(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            if (req.file) {
                let image = await handleImg(req, { attributeName: 'image', isUpdate: false });
                validatedBody.image = image;
            }
            let notifiObj = { resource: req.user.id, type: "USERS", subjectType: "ADMIN", description: validatedBody.text, users: validatedBody.users };
            if(validatedBody.image) notifiObj.image = validatedBody.image
            await Notification.create(notifiObj)
            var allUsers = await User.find({ deleted: false, _id: { $in: validatedBody.users } });
            allUsers.forEach(async (user) => {
                if (user.notification) {
                    if (user.language == 'ar') {
                        sendPushNotification(
                            {
                                targetUser: user,
                                subjectType: "ADMIN",
                                subjectId: 1,
                                text: validatedBody.text.ar,
                                title: validatedBody.titleOfNotification.ar,
                                image: (validatedBody.image) ?  process.env.BACKEND_ENDPOINT + validatedBody.image : ''
                            });
                    }
                    else {
                        sendPushNotification(
                            {
                                targetUser: user,
                                subjectType: "ADMIN",
                                subjectId: 1,
                                text: validatedBody.text.en,
                                title: validatedBody.titleOfNotification.en,
                                image: (validatedBody.image) ?  process.env.BACKEND_ENDPOINT + validatedBody.image : ''
                            });
                    }
                }
                notificationNSP.to('room-'+user.id).emit(socketEvents.NotificationsCount, { count:await Notification.count({$or:[{target: user.id},{users:user.id}],informed: { $ne: user.id },deleted: false,usersDeleted: { $ne: user.id }}) });

            });
            res.status(200).send("Successfully send to user");

        } catch (error) {
            next(error)

        }
    },
    create,
    async findAll(req, res, next) {
        try {
            let page = +req.query.page || 1, limit = +req.query.limit || 20;
            let { resource, admin } = req.query;
            let query = { deleted: false, subjectType: "ADMIN", type: { $ne: null } };
            if (resource) query.resource = resource;
            var notifs = await Notification.find(query).populate(populateQuery)
                .sort({ _id: -1 })
                .limit(limit)
                .skip((page - 1) * limit);
            if (!admin)
                notifs = Notification.schema.methods.toJSONLocalizedOnly(notifs, i18n.getLocale());
            const notifsCount = await Notification.count(query);
            const pageCount = Math.ceil(notifsCount / limit);
            res.send(new ApiResponse(notifs, page, pageCount, limit, notifsCount, req));
        } catch (err) {
            next(err);
        }
    },
    async getLastNotifications(req, res, next){
        try {
            let user = req.query.userId;
            let page = +req.query.page || 1, limit = +req.query.limit || 20;
            let query = { deleted: false , target: user };
            let notifs = await Notification.find(query)
                .sort({ _id: -1 })
                .limit(limit)
                .skip((page - 1) * limit);
            notifs.reverse();
            const notifsCount = await Notification.countDocuments(query);
            const pageCount = Math.ceil(notifsCount / limit);
            res.send(new ApiResponse(notifs, page, pageCount, limit, notifsCount, req));
        } catch (error) {
          console.log(error);
            next(error);
        }
    },
    async markAsRead(req, res, next) {
        try {
          let userId = req.query.userId;
          let page = +req.query.page || 1, limit = +req.query.limit || 20
          let user = await User.findOne({ deleted: false, _id: userId });
          let query = { deleted: false , target: userId };
          if(req.query.type){
              switch (req.query.type) {
                  case "charge":
                      query.subjectType = {$in:["SHOHNAT","COMMERCIAL","SHOHNAT-PRICE"]}
                      break;
                  case "trip":
                      query.subjectType = {$in:["TRIP","ORDER"]}
                      break;
                  case "saOrder":
                      query.subjectType = {$in:["SAORDER","SAORDER-PRICE"]}
                      break;
              }
          }
          console.log(query);
          await Notification.updateMany(query, { read: true});
          await exports.default.getCountNotification(userId,user.type == "ADMIN");
        //   if(user.type=="ADMIN"){
        //     notificationNSP.to('room-admin').emit(socketEvents.NotificationsCount, { count: 0 });
        //   }else{
        //     notificationNSP.to('room-'+userId).emit(socketEvents.NotificationsCount, { count: 0 });
        //   }
          res.send('notif marked as read');
        } catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {

            let notifId  = req.query.notifId;
            let notif = await checkExistThenGet(notifId, Notification, { deleted: false });
            console.log(notif);

            notif.deleted = true;
            await notif.save();
            res.send('notif deleted');
        } catch (error) {
            next(error);
        }
    },
    async userDelete(req, res, next) {
        try {
            let { notifId } = req.params;
            let notif = await checkExistThenGet(notifId, Notification, { deleted: false });
            await Notification.findByIdAndUpdate(notifId, { $push: { usersDeleted: req.user.id } });
            res.send('notif deleted');
        } catch (error) {
            next(error);
        }
    },
    async findById(req, res, next) {
        try {
            let { notifId } = req.params;
            let { removeLanguage } = req.query;
            let notifi = await checkExistThenGet(notifId, Notification, { deleted: false, populate: populateQuery });
            if (!removeLanguage) {
                notifi = Notification.schema.methods.toJSONLocalizedOnly(notifi, i18n.getLocale());
            }
            res.status(200).send(notifi)

        } catch (err) {
            next(err)
        }
    }
}
