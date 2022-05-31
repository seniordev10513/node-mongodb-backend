import bcrypt from 'bcryptjs';
import { body } from 'express-validator/check';
import { checkValidations,fieldhandleImg,handleImg } from '../shared.controller/shared.controller';
import Blood from '../../models/blood.model/blood.model';
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



    validateAddBlood() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('age').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('name').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('From').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('groub').not().isEmpty().not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('contact').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async addBlood(req, res, next) {
        try {
          console.log(req);
            const validatedBody = checkValidations(req);
            let query = {...validatedBody}
            let band = await isBanded(query.userId)
            if(band){
                res.status(202).send({banded:true})
            }else{
                let blood = await Blood.create(query)
                res.status(200).send(blood)
            }
        } catch (err) {
            next(err);
        }
    },
    async getBloods(req, res, next) {
        try {
            let query = {deleted:false,canceled:false}
            let {userId,city,mdr,groub,NuserId,relative} = req.query
            if(userId) {
                query.userId = userId
            }
            if(NuserId) {
                query.userId = {$ne:NuserId}
            }
            if(city) {
                query["From.city"] = city
            }
            if(mdr) {
                query["From.MDR"] = mdr
            }
            if(groub) {
                let groubs = ["A+","B+","O+","AB+","A-","B-","O-","AB-"]
                if(relative){
                    if(!groub.includes("A")){
                        groubs = groubs.filter((g)=>!g.includes("A"))
                    }
                    if(!groub.includes("B")){
                        groubs = groubs.filter((g)=>!g.includes("B"))
                    }
                    if(!groub.includes("+")){
                        groubs = groubs.filter((g)=>!g.includes("+"))
                    }
                    query.groub = {$in:groubs}
                }else{
                    query.groub = groub
                }
            }
            let shohnat = await Blood.find(query)
            res.status(200).send(shohnat)
        } catch (err) {
            next(err);
        }
    },
    async setCancelBlood(req, res, next) {
        try {
            // let isAdmin = req.query.type == 'admin'
            let query = {deleted:false,_id:req.query.id}
            let blood = await Blood.findOne(query)
            // if(isAdmin){
            //     await notificationController.pushNotification(user, 'SHOHNAT', query._id.toString(), `قام المسؤل برفض الشحنة`, 'عفش شخصي');
            // }else{
            //     notifyAdmin('SHOHNAT', query._id.toString(),`قام العميل ${user.name} بإلغاء الشحنة`, 'عفش شخصي',shohnat.trnsFrom.country == "YE"?shohnat.trnsFrom.MDR:shohnat.trnsFrom.city)
            // }
            blood.canceled = true
            await blood.save()
            res.status(200).send(blood)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
};
