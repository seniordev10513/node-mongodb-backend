import bcrypt from 'bcryptjs';
import { body } from 'express-validator/check';
import { checkValidations,fieldhandleImg,handleImg } from '../shared.controller/shared.controller';
import Commercial from '../../models/commercial.model/commercial.model';
import User from '../../models/user.model/user.model';
import tplaceModel from '../../models/places.model/tplace.model';
import ApiError from '../../helpers/ApiError';
import i18n from 'i18n'
// import config from '../../config';
import notificationController from '../notif.controller/notif.controller'
import {notifyAdmin,dateQuery} from '../user.controller/user.controller'
const isBanded = async (id) => {
    let user = await User.findOne({_id:id},"banded")
    return user.banded
}

export default {



    validateAddCommercial() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('wholeTruck').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('truckType').optional().withMessage(() => { return i18n.__('phoneRequired') }),
            body('lugType').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('date').optional().not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('From').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('To').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async addCommercial(req, res, next) {
        try {
          console.log(req);
            const validatedBody = checkValidations(req);
            let query = {...validatedBody}
            let band = await isBanded(query.userId)
            if(band){
                res.status(202).send({banded:true})
            }else{
            query.CommercialStatus = "ORD"
            let commercial = await Commercial.create(query)
            let ID = commercial.id.toString().padStart(6,"0")
            if(query.To.country == "YE"){
                let mdr = await tplaceModel.findOne({_id:query.To.MDR})
                ID = mdr.placeChar + '-' + ID
            }else{
                let mdn = await tplaceModel.findOne({_id:query.To.city})
                ID = mdn.placeChar + '-' + ID
            }

            notifyAdmin('COMMERCIAL', ID.toString(), "تم اضافة  عفش تجاري جديد", 'عفش تجاري',query.From.country == "YE"?query.From.MDR:query.From.city)
            commercial.ID = ID
            await commercial.save()
            res.status(200).send(commercial)
            }
        } catch (err) {
            next(err);
        }
    },
    validateUpdateCommercial() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('wholeTruck').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('truckType').optional().withMessage(() => { return i18n.__('phoneRequired') }),
            body('lugType').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('date').optional().not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('From').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('To').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },

    async UpdateCommercial(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let {id,...query} = validatedBody
            let user = await User.findOne({_id:query.userId})
            let commercial = await Commercial.findOneAndUpdate({_id:id},{...query,latest:false},{new: true})
            // commercial = {...commercial,...query}
            // console.log({...commercial,...query});
            // console.log(commercial);
            // await commercial.save()
            notifyAdmin('COMMERCIAL', id.toString(), `قام ${user.name} بتعديل الطلب`, 'عفش تجاري',query.From.country == "YE"?query.From.MDR:query.From.city)
            res.status(200).send(commercial)
        } catch (err) {
            next(err);
        }
    },
    async getUserCommercial(req, res, next) {
        try {
            let query = {deleted:false}
            let {userId} = req.query
            if(userId) {
                query.userId = userId
                query.latest = false
            }
            let commercial = await Commercial.find(query)
            res.status(200).send(commercial)
        } catch (err) {
            next(err);
        }
    },
    async latestUserCommercial(req, res, next) {
        try {
            let query = {deleted:false}
            let {userId} = req.query
            if(userId) {
                query.userId = userId
                query.latest = false
            }
            await Commercial.updateMany(query,{latest:true})
            res.status(200).send()
        } catch (err) {
            next(err);
        }
    },
    async getAllCommercial(req, res, next) {
        try {
            let query = {deleted:false,canceled:false}
            let dateQ = dateQuery(req.query.from,req.query.to)
            let commercial = await Commercial.find({...query,...dateQ}).populate("userId")
            res.status(200).send(commercial)
        } catch (err) {
            next(err);
        }
    },
    // async getTransCommercial(req, res, next) {
    //     try {
    //         let query = {deleted:false,withTrans:true,shohnhStatus:"ORD"}
    //         let commercial = await Commercial.find(query).populate("userId")
    //         res.status(200).send(commercial)
    //     } catch (err) {
    //         next(err);
    //     }
    // },
    validateUpdateStateCommercial() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('status').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async setStatusCommercial(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,_id:validatedBody.id,canceled:false}
            let commercial = await Commercial.findOne(query)
            if(!commercial){
                return next(new ApiError(400, 'تم ألغاء الطلب  مسبقاً'))
            }
            let user = await User.findOne({ deleted: false, _id: commercial.userId });
            commercial.CommercialStatus = validatedBody.status
            commercial.latest = false
            
            // console.log(user);
            
            await commercial.save()
            if(user.token){
              if(commercial.CommercialStatus == "ORD"){
                await notificationController.pushNotification(user, 'COMMERCIAL', validatedBody.id.toString(), "حالة الشحنة : في الإنتظار", 'عفش تجاري')
              }
              else if(commercial.CommercialStatus == "LOAD"){
                await notificationController.pushNotification(user,  'COMMERCIAL', validatedBody.id.toString(), "تم إيجاد سيارة ادخل للشحنة للتفاصيل", 'عفش تجاري')
              }
              else if(commercial.CommercialStatus == "MNF"){
                await notificationController.pushNotification(user,  'COMMERCIAL', validatedBody.id.toString(), "تم تحميل الشحنة", 'عفش تجاري')
              }
              else if(commercial.CommercialStatus == "WSL"){
                await notificationController.pushNotification(user,  'COMMERCIAL', validatedBody.id.toString(), "وصلت الشحنة الى الوجهة", 'عفش تجاري')
              }
              else if(commercial.CommercialStatus == "SOLM"){
                await notificationController.pushNotification(user,  'COMMERCIAL', validatedBody.id.toString(), "تم تسليم الشحنة الى المستلم", 'عفش تجاري')
              }
            }

            res.status(200).send(commercial)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    validateUpdatePriceCommercial() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('cost').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async cancelCommercial(req, res, next) {
        try {
            let isAdmin = req.query.type == 'admin'
            let query = {deleted:false,_id:req.query.id}
            let commercial = await Commercial.findOne(query)
            let user = await User.findOne({ deleted: false, _id: commercial.userId });
            commercial.canceled = true
            commercial.latest = false
            if(isAdmin){
                await notificationController.pushNotification(user, 'COMMERCIAL', query._id.toString(), `قام المسؤل برفض طلب الشحنة التجارية`, 'عفش تجاري');
            }else{
                notifyAdmin('COMMERCIAL', query._id.toString(),`قام ${user.name} بإلغاء طلب الشحنة التجارية`, 'عفش تجاري',commercial.From.country == "YE"?commercial.From.MDR:query.From.city)
            }
            await commercial.save()
            res.status(200).send(commercial)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
};
