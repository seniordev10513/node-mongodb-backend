import bcrypt from 'bcryptjs';
import { body } from 'express-validator/check';
import { checkValidations,fieldhandleImg,handleImg } from '../shared.controller/shared.controller';
import onlineCar from '../../models/onlineCar.model/onlineCar.model';
import onlineMsfr from '../../models/onlineMsfr.model/onlineMsfr.model';
import tplaceModel from '../../models/places.model/tplace.model';
import order from '../../models/orders.model/orders.model';
import UserModel from '../../models/user.model/user.model';
import ApiError from '../../helpers/ApiError';
import i18n from 'i18n'
import config from '../../config';
import notificationController from '../notif.controller/notif.controller'
import {dateQuery} from '../user.controller/user.controller'
import schedule from "node-schedule"
// "0 3 * * *"
schedule.scheduleJob("*/10 * * * *",async ()=>{
    console.log("CAR_SCHEDULE");
    let date = new Date()

    let queryC = {deleted:false,canceled:false,date:{$lt:date}}
    let trips = await onlineCar.find(queryC,"userId")
    let Cusers = await UserModel.updateMany({_id:{$in:trips.map((it) => it.userId)}},{haveTrip:false})

    let queryM = {canceled:false,deleted:false,finished:false,AddedTo:{$in:trips.map((it) => it._id)}}
    let msfrs = await onlineMsfr.find(queryM,"userId")
    let Musers = await UserModel.updateMany({_id:{$in:msfrs.map((it) => it.userId)}},{haveTrip:false})

    await onlineCar.updateMany(queryC,{finished:true})
    await onlineCar.updateMany(queryM,{finished:true})
})


const isBanded = async (id) => {
    let user = await UserModel.findOne({_id:id},"banded")
    return user.banded
}
const findCarAction = (Q) => { 
    let {toT,fromT,fromC,toC} = Q
    let query = {}
    if(toT){
        let to = new Date(toT)
        to.setHours(23,59,59,999)
        query.date = {}
        query.date.$lt = new Date(to)
    }
    if(fromT){
        let from = new Date(fromT)
        from.setHours(0,0,0,0)
        query.date = {}
        query.date.$gt = new Date(from)
    }
    if(fromC){
        query["From.city"] = fromC
    }
    if(toC){
        query["To.city"] = toC
    }
    return query
 }
export default {



    validateAddonlineCar() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('max').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('lefted').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('date').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('From').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('To').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('type').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('PassPrice').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async addonlineCar(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {...validatedBody}
            let band = await isBanded(query.userId)
            if(band){
            res.status(202).send({banded:true})
            }else{
            let oCar = await onlineCar.create(query)
            let ID = oCar.id.toString().padStart(6,"0")
            if(query.To.country == "YE"){
                let mdr = await tplaceModel.findOne({_id:query.To.MP})
                ID = mdr.placeChar + '-' + ID
            }else{
                let mdn = await tplaceModel.findOne({_id:query.To.city})
                ID = mdn.placeChar + '-' + ID
            }
            oCar.ID = ID
            await oCar.save()
            let driver = await UserModel.findOne({_id:query.userId})
            driver.haveTrip = true
            driver.isDriver = true
            driver.TripId = oCar.id
            await driver.save()
            let user = await UserModel.findOne({_id:query.userId}).populate({path:"TripId",model:"onlineCar"})
            res.status(200).send(user)
            }
        } catch (err) {
            next(err);
        }
    },
    async getUseronlineCar(req, res, next) {
        try {
            let query = {deleted:false,canceled:false}
            let {userId} = req.query
            if(userId) {
                query.userId = userId
            }
            let dateQ = dateQuery(req.query.from,req.query.to)
            let oCar = await onlineCar.findOne({...query,...dateQ})
            res.status(200).send(oCar)
        } catch (err) {
            next(err);
        }
    },
    async getAllonlineCar(req, res, next) {
        try {
            let query = {$or:[{deleted:false,canceled:false,isCompleted:{$exists:true,$in:[false]}},{deleted:false,canceled:false,isCompleted:{$exists:false}}]}
            // let {userId} = req.query
            // if(userId) {
            //     query.userId = userId
            // }
            let type = req.query.type
            if(type) {
                query.type = type
            }
            let dateQ = dateQuery(req.query.from,req.query.to)
            let actionQ = findCarAction(req.query)
            let oCar = await onlineCar.find({...query,...dateQ,...actionQ}).populate("userId")
            res.status(200).send(oCar)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    async cancelonlineCar(req, res, next) {
        try {
            let query = {deleted:false,canceled:false}
            let {userId} = req.query
            if(userId) {
                query.userId = userId
            }
            let band = await isBanded(req.query.userId)
            if(band){
            res.status(202).send({banded:true})
            }else{
            let driver = await UserModel.findOne({_id:query.userId}).populate({path:"TripId",model:"onlineCar"})
            driver.haveTrip = false
            let oCar = await onlineCar.findOne(query).populate("userId")
            if(!oCar){
                return next(new ApiError(400, 'تم ألغاء الطلب  مسبقاً'))
            }
            oCar.canceled = true
            await onlineMsfr.updateMany({canceled:false,deleted:false,AddedTo:oCar.id},{AddedTo:-1,ordered:false})
            let notiOrders = await order.find({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,carId:oCar.userId._id})
            notiOrders.map(async (ord)=>{
                let msf = await UserModel.findOne({_id:ord.userId})
                if(ord.stat == "ACCEPTED"){
                    await notificationController.pushNotification(msf, 'TRIP', '',`قام السائق ${driver.name} بإلغاء الرحلة التي حجزت فيها` , 'إلغاء الرحلة');
                }else if(ord.orderOf == "DRIVER"){
                    await notificationController.pushNotification(msf, 'ORDER', '',`قام السائق ${driver.name} بإلغاء طلب الحجز المرسل منك اليه` , 'إلغاء طلب الحجز');
                }else if(ord.orderOf == "CLIENT"){
                    await notificationController.pushNotification(msf, 'ORDER', '',`قام السائق ${driver.name} بعدم قبول طلب الحجز المرسل منك اليه` , 'رفض طلب الحجز');
                }
            })
            await order.updateMany({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,carId:oCar.userId._id,orderOf:"DRIVER"},{stat:"CANCELED"})
            await order.updateMany({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,carId:oCar.userId._id,orderOf:"CLIENT"},{stat:"REFUSED"})
            await driver.save()
            await oCar.save()
            res.status(200).send(driver)
            }
        } catch (err) {
            next(err);
        }
    },
    async closeonlineCar(req, res, next) {
        try {
            let query = {deleted:false,canceled:false}
            let {userId} = req.query
            if(userId) {
                query.userId = userId
            }
            let band = await isBanded(req.query.userId)
            if(band){
            res.status(202).send({banded:true})
            }else{
            let driver = await UserModel.findOne({_id:query.userId})
            let oCar = await onlineCar.findOne(query).populate("userId")
            oCar.isCompleted = true
            oCar.added = oCar.lefted
            if(!oCar){
                return next(new ApiError(400, 'تم ألغاء الطلب  مسبقاً'))
            }
            let notiOrders = await order.find({stat:{$in:["WAITTING"]},deleted:false,carId:oCar.userId._id})
            notiOrders.map(async (ord)=>{
                let msf = await UserModel.findOne({_id:ord.userId})
                if(ord.orderOf == "DRIVER"){
                    await notificationController.pushNotification(msf, 'ORDER', '',`قام السائق ${driver.name} بإلغاء طلب الحجز المرسل منك اليه` , 'إلغاء طلب الحجز');
                }else if(ord.orderOf == "CLIENT"){
                    await notificationController.pushNotification(msf, 'ORDER', '',`قام السائق ${driver.name} بعدم قبول طلب الحجز المرسل منك اليه` , 'رفض طلب الحجز');
                }
            })
            await order.updateMany({stat:{$in:["WAITTING"]},deleted:false,carId:oCar.userId._id,orderOf:"DRIVER"},{stat:"CANCELED"})
            await order.updateMany({stat:{$in:["WAITTING"]},deleted:false,carId:oCar.userId._id,orderOf:"CLIENT"},{stat:"REFUSED"})
            await driver.save()
            await oCar.save()
            let tDriver = await UserModel.findOne({_id:query.userId}).populate({path:"TripId",model:"onlineCar"})
            res.status(200).send(tDriver)
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
            let band = await isBanded(userId)
            if(band){
            res.status(202).send({banded:true})
            }else{
            if(userId) {
                query.userId = userId
            }
            let oCar = await onlineCar.findOne(query)
            let driver = await UserModel.findOne({_id:query.userId})
            const showDate = (date) => {
                let ndate = new Date(date)
                let y = ndate.getFullYear()
                let m = ndate.getMonth() + 1
                let d = ndate.getDate()
                return `${y}/${m}/${d}`
            }
            let msfrs = onlineMsfr.find({canceled:false,deleted:false,AddedTo:oCar.id}).populate("userId")
            msfrs.map(async (msf) => {
                await notificationController.pushNotification(msf.userId, 'TRIP', '',`قام السائق ${driver.name} بتعديل تاريخ الرحلة التي حجزت فيها إالى ${showDate(validatedBody.date)}` , 'تعديل تاريخ الرحلة');
            })
            oCar.date = validatedBody.date
            await oCar.save()
            res.status(200).send(oCar)
            }
        } catch (err) {
            next(err);
        }
    },

};
