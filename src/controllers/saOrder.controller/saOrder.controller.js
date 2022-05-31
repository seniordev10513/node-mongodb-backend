import bcrypt from 'bcryptjs';
import { body } from 'express-validator/check';
import { checkValidations,fieldhandleImg,handleImg } from '../shared.controller/shared.controller';
import ApiError from '../../helpers/ApiError';
import i18n from 'i18n'
// import config from '../../config';
import notificationController from '../notif.controller/notif.controller'
import tplaceModel from '../../models/places.model/tplace.model';
// import PPlace from '../../models/places.model/places.model';
// import PPlace from '../../models/places.model/tt'
import saOrder from '../../models/saOrder.model/saOrder.model'
import User from '../../models/user.model/user.model'
import {notifyAdmin,dateQuery} from '../user.controller/user.controller'


const isBanded = async (id) => {
    let user = await User.findOne({_id:id},"banded")
    return user.banded
}

export default {
    validateAddsaOrder() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('link').optional().withMessage(() => { return i18n.__('phoneRequired') }),
            body('image').optional().withMessage(() => { return i18n.__('phoneRequired') }),
            body('description').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async addsaOrder(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {...validatedBody};
            let band = await isBanded(query.userId)
            if(band){
                res.status(202).send({banded:true})
            }else{
            let ord = await saOrder.create(query)
            let user = await User.findOne({ deleted: false, _id: ord.userId });
            let ID = ord.id.toString().padStart(6,"0")
            let mdr = await tplaceModel.findOne({_id:user.city})
            ID = mdr.placeChar + '-' + ID
            ord.ID = ID
            await ord.save()
            notifyAdmin('SAORDER', ord.id.toString(), "تم اضافة  طلب شراء جديد", 'طلب شراء')
            res.status(200).send(ord)
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    async findAll(req, res, next) {
        try {
            let query = {deleted:false}
            if(req.query.userId){
                query.userId =req.query.userId
                query.latest =false
            }
            if(req.query.admin){
                query.canceled = false
                query.$or = [{booked:false},{booked:true,admin:req.query.admin}]
            }
            let dateQ = dateQuery(req.query.from,req.query.to)
            let saord = await saOrder.find({...query,...dateQ}).populate("userId")
            res.status(200).send(saord)
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    async latestSaOrders(req, res, next) {
        try {
            let query = {deleted:false,canceled:false}
            if(req.query.userId){
                query.userId =req.query.userId
                query.latest =false
            }
            await saOrder.updateMany(query,{latest:true})
            res.status(200).send()
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    async deletesaOrder(req, res, next) {
        try {
            let query = {}
            if(req.query.id){
                query._id =req.query.id
            }
            let saord = await saOrder.findOneAndUpdate(query,{deleted:true})
            res.status(200).send(saord)
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    validateUpdateStateOrderSA() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('status').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async setStatusOrderSA(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,_id:validatedBody.id,canceled:false}
            let saorder = await saOrder.findOne(query)
            if(!saorder){
                return next(new ApiError(400, 'تم ألغاء الطلب  مسبقاً'))
            }
            let user = await User.findOne({ deleted: false, _id: saorder.userId });
            saorder.status = validatedBody.status
            saorder.latest = false
            await saorder.save() 

            if(user.token){
              if(saorder.status == "ORD"){
                await notificationController.pushNotification(user, 'SAORDER', validatedBody.id.toString(), "حالة طلبك : في الإنتظار", 'طلب شراء')
              }
              else if(saorder.status == "ACPT"){
                await notificationController.pushNotification(user, 'SAORDER', validatedBody.id.toString(), "اصبحت شحنتك في يد المندوب", 'طلب شراء')
              }
              else if(saorder.status == "BUY"){
                await notificationController.pushNotification(user, 'SAORDER', validatedBody.id.toString(), "تم استلام شحنتك الى الحوش", 'طلب شراء')
              }
              else if(saorder.status == "LOAD"){
                await notificationController.pushNotification(user, 'SAORDER', validatedBody.id.toString(), "اصبحت شحنتك في الطريق", 'طلب شراء')
              }
              else if(saorder.status == "WSL"){
                await notificationController.pushNotification(user, 'SAORDER', validatedBody.id.toString(), "لقد وصلت طلبك الرجاء مراجعة مكان التسليم", 'طلب شراء')
              }
              else if(saorder.status == "SOLM"){
                await notificationController.pushNotification(user, 'SAORDER', validatedBody.id.toString(), "تم تسليم طلب شراء ، سعدنا بخدمتك", 'طلب شراء')
              }
            }

            res.status(200).send(saorder)
        }catch (err) {
            console.log(err)
            next(err);
        }
    },
    validateUpdatePriceOrderSA() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('cost').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async setPriceOrderSA(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,_id:validatedBody.id}
            let saorder = await saOrder.findOne(query)
            let user = await User.findOne({ deleted: false, _id: saorder.userId });
            await notificationController.pushNotification(user, 'SAORDER-PRICE', validatedBody.id.toString(), `لقد تم تسعير طلبك ، ادخل على الطلب لاعطاء موافقتك`, 'طلب شراء');
            saorder.price = validatedBody.cost
            saorder.priceStatus = "WAITTING"
            saorder.latest = false
            await saorder.save()
            res.status(200).send(saorder)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    validateAcceptPriceOrderSA() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async acceptPriceOrderSA(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,_id:validatedBody.id}
            let saorder = await saOrder.findOne(query)
            let user = await User.findOne({ deleted: false, _id: saorder.userId });
            notifyAdmin('SAORDER', validatedBody.id.toString(), `قام ${user.name} بالموافقة على سعر طلب شراء`, 'طلب شراء',saorder.admin)
            saorder.priceStatus = "ACCEPTED"
            saorder.latest = false
            await saorder.save()
            res.status(200).send(saorder)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    validateBookOrderSA() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('admin').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async BookOrderSA(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,_id:validatedBody.id}
            let saorder = await saOrder.findOne(query)
            saorder.booked = true
            saorder.admin = validatedBody.admin
            await saorder.save()
            res.status(200).send(saorder)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    validateunBookOrderSA() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('admin').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async unBookOrderSA(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,_id:validatedBody.id}
            let saorder = await saOrder.findOne(query)
            saorder.booked = false
            await saorder.save()
            res.status(200).send(saorder)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    validateRefusePriceOrderSA() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async refusePriceOrderSA(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,_id:validatedBody.id}
            let saorder = await saOrder.findOne(query)
            let user = await User.findOne({ deleted: false, _id: saorder.userId });
            notifyAdmin('SAORDER', validatedBody.id.toString(), `قام ${user.name} برفض سعر طلب شراء`, 'طلب شراء',saorder.admin)
            saorder.oldPrice = saorder.price
            saorder.price = 0
            saorder.priceStatus = "NONE"
            saorder.latest = false
            await saorder.save()
            res.status(200).send(saorder)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    async setCancelOrderSA(req, res, next) {
        try {
            let isAdmin = req.query.type == 'admin'
            let query = {deleted:false,_id:req.query.id}
            let saorder = await saOrder.findOne(query)
            let user = await User.findOne({ deleted: false, _id: saorder.userId });
            if(isAdmin){
                await notificationController.pushNotification(user, 'SAORDER', query._id.toString(), `قام المسؤل برفض طلب شراء`, 'طلب شراء');
            }else{
                notifyAdmin('SAORDER', query._id.toString(),`قام العميل ${user.name} بإلغاء طلب الشراء`, 'طلب شراء',saorder.booked?saorder.admin:false)
            }
            saorder.latest = false
            saorder.canceled = true
            await saorder.save()
            res.status(200).send(saorder)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },

};

