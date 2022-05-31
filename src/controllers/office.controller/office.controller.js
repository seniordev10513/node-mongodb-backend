import bcrypt from 'bcryptjs';
import { body } from 'express-validator/check';
import { checkValidations,fieldhandleImg,handleImg } from '../shared.controller/shared.controller';
import Office from '../../models/office.model/office.model';
import OfficeClicks from '../../models/officeClicks.model/officeClicks.model';
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



    validateAddOffice() {
        let validations = [
            body('initDate').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('name').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('From').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('services').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async addOffice(req, res, next) {
        try {
          console.log(req);
            const validatedBody = checkValidations(req);
            let query = {...validatedBody}
            let office = await Office.create(query)
            res.status(200).send(office)
        } catch (err) {
            next(err);
        }
    },
    async getOffices(req, res, next) {
        try {
            let query = {deleted:false,canceled:false}
            let {id,city,mdr,service} = req.query
            if(id) {
                query._id = id
            }
            if(city) {
                query["From.city"] = city
            }
            if(mdr) {
                query["From.MDR"] = mdr
            }
            if(service) {
                query.services = service
            }
            let shohnat = await Office.find(query)
            res.status(200).send(shohnat)
        } catch (err) {
            next(err);
        }
    },
    async setCancelOffice(req, res, next) {
        try {
            // let isAdmin = req.query.type == 'admin'
            let query = {deleted:false,_id:req.query.id}
            let office = await Office.findOne(query)
            // if(isAdmin){
            //     await notificationController.pushNotification(user, 'SHOHNAT', query._id.toString(), `قام المسؤل برفض الشحنة`, 'عفش شخصي');
            // }else{
            //     notifyAdmin('SHOHNAT', query._id.toString(),`قام العميل ${user.name} بإلغاء الشحنة`, 'عفش شخصي',shohnat.trnsFrom.country == "YE"?shohnat.trnsFrom.MDR:shohnat.trnsFrom.city)
            // }
            office.canceled = true
            await office.save()
            res.status(200).send(office)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    async setOfficeClick(req, res, next) {
        try {
            const {office, user} = req.query
            await OfficeClicks.create({office:office,userId: user})
            res.status(200).send("office clicked")
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
};
