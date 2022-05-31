import bcrypt from 'bcryptjs';
import { body } from 'express-validator/check';
import { checkValidations,fieldhandleImg,handleImg } from '../shared.controller/shared.controller';
import Exchange from '../../models/exchange.model/exchange.model';
import User from '../../models/user.model/user.model';
import tplaceModel from '../../models/places.model/tplace.model';
import ApiError from '../../helpers/ApiError';
import i18n from 'i18n'
// import config from '../../config';
import notificationController from '../notif.controller/notif.controller'
import { notifyAdmin , dateQuery} from '../user.controller/user.controller';



export default {



    validateAddExchange() {
        let validations = [
            body('name').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('place').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('price').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async addExchange(req, res, next) {
        try {
          console.log(req);
            const validatedBody = checkValidations(req);
            let query = {...validatedBody}
            let office = await Exchange.create(query)
            res.status(200).send(office)
        } catch (err) {
            next(err);
        }
    },
    validateUpdateExchange() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('name').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('place').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('price').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async updateExchange(req, res, next) {
        try {
          console.log(req);
            const {id,...validatedBody} = checkValidations(req);
            await Exchange.updateOne({_id:id},validatedBody,{new:true})
            res.status(200).send("done")
        } catch (err) {
            next(err);
        }
    },
    async getExchanges(req, res, next) {
        try {
            let query = {deleted:false,canceled:false}
            let {id,place} = req.query
            if(id) {
                query._id = id
            }
            if(place) {
                query.place = place
            }
            let shohnat = await Exchange.find(query)
            res.status(200).send(shohnat)
        } catch (err) {
            next(err);
        }
    },
    async setCancelExchange(req, res, next) {
        try {
            // let isAdmin = req.query.type == 'admin'
            let query = {deleted:false,_id:req.query.id}
            let exchange = await Exchange.findOne(query)
            // if(isAdmin){
            //     await notificationController.pushNotification(user, 'SHOHNAT', query._id.toString(), `قام المسؤل برفض الشحنة`, 'عفش شخصي');
            // }else{
            //     notifyAdmin('SHOHNAT', query._id.toString(),`قام العميل ${user.name} بإلغاء الشحنة`, 'عفش شخصي',shohnat.trnsFrom.country == "YE"?shohnat.trnsFrom.MDR:shohnat.trnsFrom.city)
            // }
            exchange.canceled = true
            await exchange.save()
            res.status(200).send(exchange)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
};
