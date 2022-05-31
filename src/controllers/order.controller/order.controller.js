import bcrypt from 'bcryptjs';
import { body } from 'express-validator/check';
import { checkValidations,fieldhandleImg,handleImg } from '../shared.controller/shared.controller';
import order from '../../models/orders.model/orders.model';
import UserModel from '../../models/user.model/user.model';
import tplaceModel from '../../models/places.model/tplace.model';
import carModel from '../../models/onlineCar.model/onlineCar.model';
import MsfrModel from '../../models/onlineMsfr.model/onlineMsfr.model';
import ApiError from '../../helpers/ApiError';
import i18n from 'i18n'
// import config from '../../config';
import notifyController from '../notif.controller/notif.controller';


const isBanded = async (id) => {
    let user = await UserModel.findOne({_id:id},"banded")
    return user.banded
}

export default {



    validateAddorder() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('carId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('orderOf').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async addorder(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {...validatedBody,stat:"WAITTING"};
            let oldOrder = await order.exists({...validatedBody,stat:{$in:["ACCEPTED","WAITTING"]}})
            if(oldOrder){
                return res.status(200).send(oldOrder)
            }
            let band = await isBanded(query.orderOf == "CLIENT" ? query.userId : query.carId)
            if(band){
                res.status(202).send({banded:true})
            }else{
            let msfr = await MsfrModel.findOne({userId:validatedBody.userId,canceled:false,deleted:false}).populate("userId")
            let car = await carModel.findOne({userId:validatedBody.carId,canceled:false,deleted:false})
            if(!msfr || msfr.ordered){
                return next(new ApiError(400, 'الراكب المراد حجزه لم يعد متاحاً'))
            }
            if(!car){
                return next(new ApiError(400, 'الرحلة المراد الحجز فيها لم تعد متاحة'))
            }
            if(validatedBody.orderOf == "CLIENT"){
                msfr.ordered = true
                let notiOrders = await order.find({stat:{$in:["WAITTING"]},deleted:false,userId:msfr.userId._id})
                notiOrders.map(async (ord)=>{
                let drive = await UserModel.findOne({_id:ord.carId})
                if(ord.orderOf == "DRIVER"){
                    await notifyController.pushNotification(drive, 'ORDER', '',`قام السائق ${msfr.userId.name} بعدم قبول طلب الحجز لديه` , 'رفض الطلب');
                }
                })
                await order.updateMany({stat:{$in:["WAITTING"]},deleted:false,userId:validatedBody.userId,orderOf:"DRIVER"},{stat:"REFUSED"})
                await msfr.save()
            }
            let ord = await order.create(query)
            // let user = await UserModel.findOne({id: validatedBody.userId})
            if(validatedBody.orderOf == "DRIVER"){
                let sender = await UserModel.findOne({_id: validatedBody.carId}).populate([{path:"TripId",model: "onlineCar"}])
                let user = await UserModel.findOne({_id: validatedBody.userId})
                await notifyController.pushNotification(user, 'ORDER', ord.id.toString(), `يرغب السائق ${sender.name} ان تحجز لديه في رحلته ، هل توافق ؟`, 'رحلة');
            }else{
                let sender = await UserModel.findOne({_id: validatedBody.userId}).populate([{path:"TripId",model: "onlineMsfr"}])
                let user = await UserModel.findOne({_id: validatedBody.carId})
                await notifyController.pushNotification(user, 'ORDER', ord.id.toString(), `يرغب  ${sender.TripId.numPers} ركاب ان يحجزو في رحلتك ، هل توافق ؟`, 'رحلة');
            }
            // if(query.orderOf == "CLIENT"){
            // user.ordered = true;
            // }
            // await user.save();
            res.status(200).send(ord)
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    async getUserorder(req, res, next) {
        try {
            let query = {deleted:false,stat:{$in:["WAITTING","ACCEPTED"]}}
            let {userId,carId} = req.query
            if(userId >= 0){
                query.userId = userId
            }
            if(carId >= 0){
                query.carId = carId
            }
            let ordr = await order.find(query).populate([{path:userId ?  'carId' : 'userId',populate:{path:"TripId",model:carId ? "onlineMsfr" : "onlineCar"}}])
            res.status(200).send(ordr)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    // async getAllonlineCar(req, res, next) {
    //     try {
    //         let query = {deleted:false,canceled:false}
    //         // let {userId} = req.query
    //         // if(userId) {
    //         //     query.userId = userId
    //         // }
    //         let oCar = await onlineCar.find(query).populate("driver").exec()
    //         res.status(200).send(oCar)
    //     } catch (err) {
    //         next(err);
    //     }
    // },
    validateCancelorder() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('carId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('orderOf').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async cancelorder(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,stat:{$in:["WAITTING","ACCEPTED","REFUSED"]},...validatedBody}
            // let user = await UserModel.findOne({id:query.userId})
            // if(query.orderOf == "CLIENT")
            // user.ordered = false
            let band = await isBanded(query.orderOf == "CLIENT" ? query.userId : query.carId)
            if(band){
                res.status(202).send({banded:true})
            }else{
            let ord = await order.findOne(query)
            if(!ord){
                next(new ApiError(400, 'تم ألغاء الطلب  مسبقاً'))
            }
            let msfr = await MsfrModel.findOne({userId:validatedBody.userId,canceled:false,deleted:false}).populate("userId")
            let driver = await carModel.findOne({userId:validatedBody.carId,canceled:false,deleted:false}).populate("userId")
            if(ord.orderOf == "CLIENT"){
                msfr.ordered = false
            }
            if(ord.stat == "ACCEPTED"){
                msfr.AddedTo = -1
                msfr.ordered = false
                driver.added = driver.added - msfr.numPers
                driver.isCompleted = false
            }
            if(validatedBody.orderOf == "DRIVER"){
                await notifyController.pushNotification(msfr.userId, 'ORDER', '',`قام السائق ${driver.userId.name} بإلغاء طلب الحجز` , 'إلغاء الطلب');
            }else{
                await notifyController.pushNotification(driver.userId, 'ORDER', '',`قام الراكب ${msfr.userId.name} بإلغاء طلب الحجز` , 'إلغاء الطلب');
            }
            ord.stat = "CANCELED"
            // user.save()
            await msfr.save()
            await driver.save()
            await ord.save()
            res.status(200).send(ord)
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    validateAcceptorder() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('carId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('orderOf').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async acceptorder(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {deleted:false,stat:"WAITTING",...validatedBody}
            // let user = await UserModel.findOne({id:query.userId})
            // if(query.orderOf == "CLIENT")
            // user.ordered = false
            let band = await isBanded(query.orderOf == "CLIENT" ? query.userId : query.carId)
            if(band){
                res.status(202).send({banded:true})
            }else{
            let ord = await order.findOne(query)
            if(!ord){
                next(new ApiError(400, 'تم ألغاء الطلب  مسبقاً'))
            }
            ord.stat = "ACCEPTED"
            let msfr = await MsfrModel.findOne({userId:validatedBody.userId,canceled:false,deleted:false}).populate("userId")
            let driver = await carModel.findOne({userId:validatedBody.carId,canceled:false,deleted:false}).populate("userId")
            if((driver.added + msfr.numPers) > driver.lefted){
                next(new ApiError(400, 'أكتمل العدد'))
            }
            msfr.AddedTo = driver.id
            msfr.ordered = true
            driver.added = driver.added + msfr.numPers || msfr.numPers
            if(driver.lefted <= driver.added){
                driver.isCompleted = true
                let notiOrders = await order.find({stat:{$in:["WAITTING"]},deleted:false,userId:driver.userId._id})
                notiOrders.map(async (ord)=>{
                let msf = await UserModel.findOne({_id:ord.userId})
                if(ord.orderOf == "DRIVER"){
                    await notifyController.pushNotification(msf, 'ORDER', '',`قام السائق ${driver.userId.name} بعدم قبول طلب الحجز` , 'رفض الطلب');
                }else if(ord.orderOf == "CLIENT"){
                    await notifyController.pushNotification(msf, 'ORDER', '',`قام السائق ${driver.userId.name} بإلغاء طلب الحجز` , 'إلغاء الطلب');
                }
                })
                await order.updateMany({stat:{$in:["WAITTING"]},deleted:false,carId:validatedBody.carId,orderOf:"DRIVER"},{stat:"CANCELED"})
                await order.updateMany({stat:{$in:["WAITTING"]},deleted:false,carId:validatedBody.carId,orderOf:"CLIENT"},{stat:"REFUSED"})
            }
            await ord.save()
            await msfr.save()
            await driver.save()
            if(validatedBody.orderOf == "DRIVER"){
                await notifyController.pushNotification(driver.userId, 'ORDER', ord.id.toString(), `قام الراكب ${msfr.userId.name} بقبول طلب الحجز الذي أرسلته`, 'رحلة');
                let notiOrders = await order.find({stat:{$in:["WAITTING"]},deleted:false,userId:msfr.userId._id})
                notiOrders.map(async (ord)=>{
                let msf = await UserModel.findOne({_id:ord.carId})
                if(ord.orderOf == "DRIVER"){
                    await notifyController.pushNotification(msf, 'ORDER', '',`قام الراكب ${msfr.userId.name} بعدم قبول طلب الحجز لديه` , 'رفض الطلب');
                }
                })
                await order.updateMany({stat:{$in:["WAITTING"]},deleted:false,userId:validatedBody.userId,orderOf:"DRIVER"},{stat:"REFUSED"})
                res.status(200).send(msfr)
            }else{
                //-Mo?
                await notifyController.pushNotification(msfr.userId, 'ORDER', ord.id.toString(), `قام السائق ${driver.userId.name} بقبول طلب الحجز الذي أرسلته`, 'رحلة', 'رحلة');
                res.status(200).send(driver)
            }
            }
            // user.save()
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    validateRefuseorder() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('carId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('orderOf').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async refuseorder(req, res, next) {
        try {
            let tripQuery = {canceled:false,deleted:false}
            const validatedBody = checkValidations(req);
            let query = {deleted:false,stat:{$in:["WAITTING","ACCEPTED"]},...validatedBody}
            let band = await isBanded(query.orderOf == "CLIENT" ? query.userId : query.carId)
            if(band){
                res.status(202).send({banded:true})
            }else{
            let ord = await order.findOne(query)
            if(!ord){
                next(new ApiError(400, 'تم إلغاء الطلب مسبقاً'))
            }
            let msfr = await MsfrModel.findOne({userId:validatedBody.userId,...tripQuery}).populate("userId")
            let driver = await carModel.findOne({userId:validatedBody.carId,...tripQuery}).populate("userId")
            if(ord.orderOf == "CLIENT"){
                msfr.ordered = false
            }
            console.log(ord.stat)
            if(ord.stat == "ACCEPTED"){
                msfr.AddedTo = -1
                msfr.ordered = false
                console.log(driver.added,msfr.numPers)
                driver.added = driver.added - msfr.numPers
                console.log(driver.added,msfr.numPers)
                driver.isCompleted = false
            }
            ord.stat = "REFUSED"
            await msfr.save()
            await driver.save()
            await ord.save()
            //-Mo?
            if(validatedBody.orderOf == "DRIVER"){
                await notifyController.pushNotification(driver.userId, 'ORDER', '',`قام الراكب ${msfr.userId.name} بعدم قبول طلب الحجز` , 'رفض الطلب');
            }else{
                await notifyController.pushNotification(msfr.userId, 'ORDER', '',`قام السائق ${driver.userId.name} بعدم قبول طلب الحجز` , 'رفض الطلب');
            }
            res.status(200).send(ord)
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

};
