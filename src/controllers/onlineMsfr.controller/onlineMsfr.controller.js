import bcrypt from 'bcryptjs';
import { body } from 'express-validator/check';
import { checkValidations,fieldhandleImg,handleImg } from '../shared.controller/shared.controller';
import onlineMsfr from '../../models/onlineMsfr.model/onlineMsfr.model';
import order from '../../models/orders.model/orders.model';
import onlineCar from '../../models/onlineCar.model/onlineCar.model';
import tplaceModel from '../../models/places.model/tplace.model';
import UserModel from '../../models/user.model/user.model';
import ApiError from '../../helpers/ApiError';
import i18n from 'i18n'
import config from '../../config';
import notificationController from '../notif.controller/notif.controller'
import {dateQuery} from '../user.controller/user.controller'
import schedule from "node-schedule"

schedule.scheduleJob("*/10 * * * *",async ()=>{
    console.log("MSFR_SCHEDULE");
    let date = new Date()
    let query = {deleted:false,canceled:false,ToDate:{$lt:date},$or:[{AddedTo:{$exists:false}},{AddedTo:-1}]}
    let trips = await onlineMsfr.find(query,"userId")
    await UserModel.updateMany({_id:{$in:trips.map((it) => it.userId)}},{haveTrip:false})
    await onlineMsfr.updateMany(query,{finished:true})
})


const isBanded = async (id) => {
    let user = await UserModel.findOne({_id:id},"banded")
    return user.banded
}
const findMsfrsAction = (Q) => { 
    let {toT,fromT,fromC,toC} = Q
    console.log(Q);
    let query = {}
    if(toT){
        let to = new Date(toT)
        to.setHours(23,59,59,999)
        query.FromDate = {}
        query.FromDate.$lt = new Date(to)
    }
    if(fromT){
        let from = new Date(fromT)
        from.setHours(0,0,0,0)
        query.ToDate = {}
        query.ToDate.$gt = new Date(from)
    }
    if(toC){
        query["To.city"] = toC
    }
    if(fromC){
        query["From.city"] = fromC
    }
    return query
 }
export default {



    validateAddonlineMsfr() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('numPers').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('withTrans').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('transFrom').optional().not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('FromDate').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('ToDate').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('From').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('To').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async addonlineMsfr(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {...validatedBody}
            let band = await isBanded(query.userId)
            if(band){
            res.status(202).send({banded:true})
            }else{
            let oMsfr = await onlineMsfr.create(query)
            let user = await UserModel.findOne({_id:query.userId}).populate({path:"TripId",model:"onlineMsfr"})
            user.haveTrip = true
            user.isDriver = false
            user.TripId = oMsfr.id
            let ID = oMsfr.id.toString().padStart(6,"0")
            if(query.To.country == "YE"){
                let mdr = await tplaceModel.findOne({_id:query.To.MP})
                // console.log(mdr);
                ID = mdr.placeChar + '-' + ID
            }else{
                let mdn = await tplaceModel.findOne({_id:query.To.city})
                ID = mdn.placeChar + '-' + ID
            }
            oMsfr.ID = ID
            await user.save()
            await oMsfr.save()
            let Ruser = await UserModel.findOne({_id:query.userId}).populate({path:"TripId",model:"onlineMsfr"})
            res.status(200).send(Ruser)
            }
        } catch (err) {
            next(err);
        }
    },
    async getUseronlineMsfr(req, res, next) {
        try {
            let query = {deleted:false,canceled:false}
            let {userId} = req.query
            if(userId) {
                query.userId = userId
            }
            let oMsfr = await onlineMsfr.findOne(query)
            res.status(200).send(oMsfr)
        } catch (err) {
            next(err);
        }
    },
    async getAllonlineMsfr(req, res, next) {
        try {
            let query = {deleted:false,canceled:false,ordered:false,finished:false}
            // let {userId} = req.query
            // if(userId) {
            //     query.userId = userId
            // }
            let dateQ = dateQuery(req.query.from,req.query.to)
            let actionQ = findMsfrsAction(req.query)
            let oMsfr = await onlineMsfr.find({...query,...dateQ,...actionQ}).populate("userId")
            res.status(200).send(oMsfr)
        } catch (err) {
            next(err);
        }
    },
    async getTransonlineMsfr(req, res, next) {
        try {
            let query = {deleted:false,canceled:false,AddedTo:{$exists:true,$ne:-1},withTrans:true}
            let oMsfr = await onlineMsfr.find(query).populate("userId").populate("AddedTo")
            res.status(200).send(oMsfr)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    async cancelonlineMsfr(req, res, next) {
        try {
            let query = {deleted:false,canceled:false}
            let {userId} = req.query
            let band = await isBanded(userId)
            if(band){
            res.status(202).send({banded:true})
            }else{
            if(userId) {
                query.userId = userId
            }
            let oMsfr = await onlineMsfr.findOne(query).populate("userId")
            if(!oMsfr){
                return next(new ApiError(400, 'تم ألغاء الرحلة  مسبقاً'))
            }
            oMsfr.canceled = true
            let driver = await UserModel.findOne({_id:query.userId}).populate({path:"TripId",model:"onlineMsfr"})
            if(oMsfr.AddedTo > -1){
                console.log(oMsfr.AddedTo);
            let oCar = await onlineCar.findOne({deleted:false,canceled:false,_id:oMsfr.AddedTo}).populate("userId")
            oCar.isCompleted = false
            oCar.added -= oMsfr.numPers
            await oCar.save()
            }
            console.log(oMsfr.userId,"___ID");
            let notiOrders = await order.find({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,userId:oMsfr.userId._id})
            notiOrders.map(async (ord)=>{
                let msf = await UserModel.findOne({_id:ord.carId})
                if(ord.stat == "ACCEPTED"){
                    await notificationController.pushNotification(msf, 'TRIP', '',`قام الراكب ${driver.name} بإلغاء الرحلة` , 'إلغاء الرحلة');
                }else if(ord.orderOf == "DRIVER"){
                    await notificationController.pushNotification(msf, 'ORDER', '',`قام الراكب ${driver.name} بعدم قبول طلب الحجز الذي ارسلته اليه` , 'رفض طلب حجز');
                }else if(ord.orderOf == "CLIENT"){
                    await notificationController.pushNotification(msf, 'ORDER', '',`قام الراكب ${driver.name} بإلغاء طلب الحجز الذي ارسله اليك` , 'إلغاء طلب حجز');
                }
            })
            await order.updateMany({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,userId:oMsfr.userId._id,orderOf:"CLIENT"},{stat:"CANCELED"})
            await order.updateMany({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,userId:oMsfr.userId._id,orderOf:"DRIVER"},{stat:"REFUSED"})
            driver.haveTrip = false
            await driver.save()
            await oMsfr.save()
            let user = await UserModel.findOne({_id:query.userId})
            res.status(200).send(user)
            }
        } catch (err) {
            next(err);
        }
    },
    validateupDateonlineCardate() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('date').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async upDateonlineCardate(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,canceled:false}
            let {userId} = validatedBody
            if(userId) {
                query.userId = userId
            }
            let oCar = await onlineCar.findOne(query)
            oCar.date = validatedBody.date
            oCar.save()
            res.status(200).send(oCar)
        } catch (err) {
            next(err);
        }
    },

};
