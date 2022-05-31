import bcrypt from 'bcryptjs';
import { body } from 'express-validator/check';
import { checkValidations,fieldhandleImg,handleImg } from '../shared.controller/shared.controller';
import Shohnat from '../../models/shohnat.model/shohnat.model';
import User from '../../models/user.model/user.model';
import tplaceModel from '../../models/places.model/tplace.model';
import ApiError from '../../helpers/ApiError';
import i18n from 'i18n'
// import config from '../../config';
import notificationController from '../notif.controller/notif.controller'
import { notifyAdmin , dateQuery} from '../user.controller/user.controller';


const isBanded = async (id) => {
    let user = await User.findOne({_id:id},"banded")
    return user.banded
}
export default {



    validateAddShohnat() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('count').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('images').optional().withMessage(() => { return i18n.__('phoneRequired') }),
            body('withTrans').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('trnsFrom').optional().not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('tasleemAdress').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('toperson').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('isMostajal').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async addShohnat(req, res, next) {
        try {
          console.log(req);
            const validatedBody = checkValidations(req);
            let query = {...validatedBody}
            let band = await isBanded(query.userId)
            if(band){
                res.status(202).send({banded:true})
            }else{
            let shohnat = await Shohnat.create(query)
            let code = Math.floor(Math.random() * 100000000).toString().padStart(8,"0")
            let ID = shohnat.id.toString().padStart(6,"0")
            if(query.tasleemAdress.country == "YE"){
                let mdr = await tplaceModel.findOne({_id:query.tasleemAdress.MDR})
                ID = mdr.placeChar + '-' + ID
            }else{
                let mdn = await tplaceModel.findOne({_id:query.tasleemAdress.city})
                ID = mdn.placeChar + '-' + ID
            }
            notifyAdmin('SHOHNAT', ID.toString(), "تم اضافة  عفش جديد", 'عفش شخصي',query.trnsFrom.country == "YE"?query.trnsFrom.MDR:query.trnsFrom.city)
            shohnat.ID = ID
            shohnat.code = code
            await shohnat.save()
            
                res.status(200).send(shohnat)
            }
        } catch (err) {
            next(err);
        }
    },
    validateUpdateShohnat() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('count').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('images').optional().withMessage(() => { return i18n.__('phoneRequired') }),
            body('withTrans').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('trnsFrom').optional().not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('tasleemAdress').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('toperson').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('isMostajal').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async UpdateShohnat(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let {id,...query} = validatedBody
            let user = await User.findOne({_id:query.userId})
            let shohnat = await Shohnat.findOneAndUpdate({_id:id},{...query,latest:false},{new: true})
            notifyAdmin('SHOHNAT', id.toString(), `قام ${user.name} بتعديل الطلب`, 'عفش شخصي',query.trnsFrom.country == "YE"?query.trnsFrom.MDR:query.trnsFrom.city)
            res.status(200).send(shohnat)
        } catch (err) {
            next(err);
        }
    },
    async getUserShohnat(req, res, next) {
        try {
            let query = {}
            let {userId} = req.query
            if(userId) {
                query.userId = userId
                query.latest = false
            }
            let shohnat = await Shohnat.find(query)
            res.status(200).send(shohnat)
        } catch (err) {
            next(err);
        }
    },
    async latestShohnat(req, res, next) {
        try {
            let query = {}
            let {userId} = req.query
            if(userId) {
                query.userId = userId
                query.latest = false
            }
            await Shohnat.updateMany(query,{latest:true})
            res.status(200).send()
        } catch (err) {
            next(err);
        }
    },
    async getAllShohnat(req, res, next) {
        try {
            let query = {deleted:false,canceled:false}
            let dateQ = dateQuery(req.query.from,req.query.to)
            let shohnat = await Shohnat.find({...query,...dateQ}).populate("userId")
            res.status(200).send(shohnat)
        } catch (err) {
            next(err);
        }
    },
    async getTransShohnat(req, res, next) {
        try {
            let query = {deleted:false,withTrans:true,shohnhStatus:"ORD"}
            let dateQ = dateQuery(req.query.from,req.query.to)
            let shohnat = await Shohnat.find({...query,...dateQ}).populate("userId")
            res.status(200).send(shohnat)
        } catch (err) {
            next(err);
        }
    },
    validateUpdateStateShohnat() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('status').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async setStatusShohnat(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,_id:validatedBody.id,canceled:false}
            let shohnat = await Shohnat.findOne(query)
            if(!shohnat){
                return next(new ApiError(400, 'تم ألغاء الطلب  مسبقاً'))
            }
            let user = await User.findOne({ deleted: false, _id: shohnat.userId });
            shohnat.shohnhStatus = validatedBody.status
            shohnat.latest = false
            await shohnat.save()
            if(user.token){
              if(shohnat.shohnhStatus == "ORD"){
                await notificationController.pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "حالة الشحنة: في الإنتظار", 'عفش شخصي')
              }
              else if(shohnat.shohnhStatus == "MND"){
                await notificationController.pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "اصبحت شحنتك في يد المندوب", 'عفش شخصي')
              }
              else if(shohnat.shohnhStatus == "HOSH"){
                await notificationController.pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "تم استلام شحنتك الى الحوش", 'عفش شخصي')
              }
              else if(shohnat.shohnhStatus == "CAR"){
                await notificationController.pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "اصبحت شحنتك في الطريق", 'عفش شخصي')
              }
              else if(shohnat.shohnhStatus == "WSL"){
                await notificationController.pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "لقد وصلت شحنتك ، الرجاء مراجعة مكان التسليم", 'عفش شخصي')
              }
              else if(shohnat.shohnhStatus == "SOLM"){
                await notificationController.pushNotification(user, 'SHOHNAT', validatedBody.id.toString(), "تم تسليم الشحنة", 'عفش شخصي')
              }
            }

            res.status(200).send(shohnat)
        }catch (err) {
            console.log(err)
            next(err);
        }
    },
    validateUpdatePriceShohnat() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('cost').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async setPriceShohnat(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,_id:validatedBody.id}
            let shohnat = await Shohnat.findOne(query)
            let user = await User.findOne({ deleted: false, _id: shohnat.userId });
            await notificationController.pushNotification(user, 'SHOHNAT-PRICE', validatedBody.id.toString(), `تم تسعير الشحنة`, 'عفش شخصي');
            shohnat.price = validatedBody.cost
            shohnat.priceStatus = "WAITTING"
            shohnat.latest = false
            await shohnat.save()
            res.status(200).send(shohnat)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    validateAcceptPriceShohnat() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async acceptPriceShohnat(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,_id:validatedBody.id}
            let shohnat = await Shohnat.findOne(query)
            let user = await User.findOne({ deleted: false, _id: shohnat.userId });
            notifyAdmin('SHOHNAT', validatedBody.id.toString(), `قام ${user.name} بالموافقة على سعر الشحنة`, 'عفش شخصي',shohnat.trnsFrom.country == "YE"?shohnat.trnsFrom.MDR:shohnat.trnsFrom.city)
            shohnat.priceStatus = "ACCEPTED"
            shohnat.latest = false
            await shohnat.save()
            res.status(200).send(shohnat)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    validateRefusePriceShohnat() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async refusePriceShohnat(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,_id:validatedBody.id}
            let shohnat = await Shohnat.findOne(query)
            let user = await User.findOne({ deleted: false, _id: shohnat.userId });
            notifyAdmin('SHOHNAT', validatedBody.id.toString(), `قام العميل ${user.name} برفض سعر الشحنة`, 'عفش شخصي',shohnat.trnsFrom.country == "YE"?shohnat.trnsFrom.MDR:shohnat.trnsFrom.city)
            shohnat.oldPrice = shohnat.price
            shohnat.price = 0
            shohnat.priceStatus = "NONE"
            shohnat.latest = false
            await shohnat.save()
            res.status(200).send(shohnat)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    async setCancelShohnat(req, res, next) {
        try {
            let isAdmin = req.query.type == 'admin'
            let query = {deleted:false,_id:req.query.id}
            let shohnat = await Shohnat.findOne(query)
            let user = await User.findOne({ deleted: false, _id: shohnat.userId });
            if(isAdmin){
                await notificationController.pushNotification(user, 'SHOHNAT', query._id.toString(), `قام المسؤل برفض الشحنة`, 'عفش شخصي');
            }else{
                notifyAdmin('SHOHNAT', query._id.toString(),`قام العميل ${user.name} بإلغاء الشحنة`, 'عفش شخصي',shohnat.trnsFrom.country == "YE"?shohnat.trnsFrom.MDR:shohnat.trnsFrom.city)
            }
            shohnat.latest = false
            shohnat.canceled = true
            await shohnat.save()
            res.status(200).send(shohnat)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
};
