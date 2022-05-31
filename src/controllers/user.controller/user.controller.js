import bcrypt from 'bcryptjs';
import { body } from 'express-validator/check';
import User from '../../models/user.model/user.model';
import Mand from '../../models/admin.model/admin.model';
import MsfrModel from '../../models/onlineMsfr.model/onlineMsfr.model';
import CarModel from '../../models/onlineCar.model/onlineCar.model';
import order from '../../models/orders.model/orders.model';
import Shohnat from '../../models/shohnat.model/shohnat.model';
import saOrder from '../../models/saOrder.model/saOrder.model';
import Commercial from '../../models/commercial.model/commercial.model';
import ApiError from '../../helpers/ApiError';
import i18n from 'i18n'
import ApiResponse from '../../helpers/ApiResponse'
import moment from 'moment'
import socketEvents from '../../socketEvents'
import { twilioSend, twilioVerify } from '../../services/twilo'
import config from '../../config';
import { checkValidations,fieldhandleImg,handleImg } from '../shared.controller/shared.controller';
import bandedModel from '../../models/banded.model/banded.model';
import notificationController from '../notif.controller/notif.controller'


const getCountryCode = (phone) => {
            let tphone = phone.trim();
            let tCountryCode = ""
            if (tphone.substring(0,5) === "00966") {
                tCountryCode = "+966"
                tphone= "0" + tphone.slice(5)

            } else if ( tphone.substring(0,4) === "+966" ) {
                tCountryCode = "+966"
                tphone= "0" + tphone.slice(4)
            } else if ( tphone.substring(0,3) === "966" ) {
                tCountryCode = "+966"
                tphone= "0" + tphone.slice(3)
            } else if ( tphone.substring(0,2) === "05") {
                tCountryCode = "+966"
                tphone= tphone
            } else if ( tphone.substring(0,1) === "5" ) {
                tCountryCode = "+966"
                tphone= "0" + tphone
            } else if ( tphone.substring(0,5) === "00967") {
                tCountryCode = "+967"
                tphone= tphone.slice(5)
            } else if ( tphone.substring(0,4) === "+967") {
                tCountryCode = "+967"
                tphone= tphone.slice(4)
            } else if ( tphone.substring(0,3) === "967" ) {
                tCountryCode = "+967"
                tphone= tphone.slice(3)
            } else if ( tphone.substring(0,1) === "7" ) {
                tCountryCode = "+967"
                tphone
            }
            return {
                phone : tphone,
            countryCode : tCountryCode}
}
let testNumber = [
    "771234567",
    "77123456789",
    "777819817",
    "770700718",
"0556639898",
"713263323",
"778153683",
"05512345",
"055123456",
"0551234567",
"05512345678",
"777123456",
"7771234567",
"771234568",
"77712345678",
"777123456789",
"0531392567",
"771237135",
"713305554",
"711557120",
"735347124",
"715719718",
"770800234",
"711557120",
"771837718",
"771847718",
"770000",
"771111",
"772222",
"773333",
"774444",
"775555",
"776666",
"778888",
"779999",
"778463",
"776721",
"777532",
"776299",
"778263",
"778263",
"771234",
"12345678",
"0554738814",
"0537281356",
"0555805696",
"0507626184"
]

export const notifyAdmin = async (subjectName,subjectId,text,title,place) => { 
    let query = { deleted: false, type: 'ADMIN' }
    if(place){
        if(subjectName == "SAORDER"){
            query._id = place
        }else{
            query.places = place
        }
    }
    let admins = await User.find(query);
    admins.map(async admin=>{
    await notificationController.pushNotification(admin,subjectName,subjectId,text,title)
    })
 }
const dateOfday = () => { 
    let d = new Date()
    d.setHours(0,0,0,0)
    return d

 }
export const dateQuery = (f,t) => {
    if(!f && !t) return
    let query = {createdAt:{}}
    if(f){
        let from = new Date(f)
        from.setHours(0,0,0,0)
        query.createdAt.$gt = new Date(from)
    }
    if(t){
        let to = new Date(t)
        to.setHours(23,59,59,999)
        query.createdAt.$lt = new Date(to)
    }
    return query
}

 const carSignUpQuery = (f,t) => {
    if(!f && !t) return
    let query = {"car.signUpDate":{}}
    if(f){
        let from = new Date(f)
        from.setHours(0,0,0,0)
        query["car.signUpDate"].$gt = new Date(from)
    }
    if(t){
        let to = new Date(t)
        to.setHours(23,59,59,999)
        query["car.signUpDate"].$lt = new Date(to)
    }
    return query
}
 const carAcceptQuery = (f,t) => {
    if(!f && !t) return
    let query = {"car.acceptDate":{}}
    if(f){
        let from = new Date(f)
        from.setHours(0,0,0,0)
        query["car.acceptDate"].$gt = new Date(from)
    }
    if(t){
        let to = new Date(t)
        to.setHours(23,59,59,999)
        query["car.acceptDate"].$lt = new Date(to)
    }
    return query
}
// const checkUserExistByEmail = async (email) => {
//     let user = await User.findOne({ email, deleted: false });
//     if (!user)
//         throw new ApiError.BadRequest('email Not Found');
//     return user;
// }
// let populateQuery = [
//     // { path:'categories',model:'category'},
//     { path:'subCategories',model:'category',populate:[{path:'parent',model:'category'}]},
//     { path:'driver',model:'user'},
//     { path:'market',model:'user',populate:[
//         { path: 'region', model: 'region', populate: [{ path: 'city', model: 'city', populate: [{ path: 'country', model: 'country' }] }] },
//     ]},
//     { path:'subscription',model:'subscription'},
//     { path: 'rules', model: 'assignRule' },
//     { path: 'region', model: 'region', populate: [{ path: 'city', model: 'city', populate: [{ path: 'country', model: 'country' }] }] },
// ];

let createPromise = (query) => {
    let newPromise = new Promise(async (resolve, reject) => {
        try {
            const result = await query;
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
    return newPromise;
}

// let checkFollow = async (list,userId)=>{
//     try {
//         let promises = [];
//         let length = list.length;
//         let query = { deleted: false, user: userId }
//         for (let index = 0; index < length; index++) {
//             query.trader = list[index].id;
//             let promis = Follow.findOne(query);
//             if (promis)
//                 promises.push(createPromise(promis));
//         }
//         let finalResult = await Promise.all(promises);
//         for (let index = 0; index < finalResult.length; index++) {
//             if (finalResult[index]) {
//                 list[index].follow = true;
//             }
//         }
//         return list;
//     } catch (error) {
//         throw error;
//     }
// }

// let checkinFavorites = async (list, userId) => {
//     try {
//         let promises = [];
//         let query = { deleted: false, user: userId }
//         for (let index = 0; index < list.length; index++) {
//             query.trader = list[index].id;
//             let promis = Favorites.findOne(query);
//             if (promis)
//                 promises.push(createPromise(promis));
//         }
//         let finalResult = await Promise.all(promises);
//         for (let index = 0; index < finalResult.length; index++) {
//             if (finalResult[index]) {
//                 list[index].favorite = true;
//             } else {
//                 list[index].favorite = false;
//             }
//         }
//         return list;
//     } catch (error) {
//         throw error;
//     }

// }

export default {

    // async findAll(req, res, next) {
    //     try {
    //         let page = +req.query.page || 1,
    //             limit = +req.query.limit || 20;
    //         var { all, name, type, fromDate, toDate, phone, email, activated, countryKey, countryCode,market,region,
    //             month, year, day, archive , country, categoryName ,removeLanguage,
    //             tradersByMarketName,userId,marketsByCategory,marketsBySubCategories,
    //             marketsByCategoryName,marketByCountry , marketsByRegions,productName,marketsByCity,
    //             subCategory,category,tradersByRegion,driver,mostRated,similarTraders,shopType
    //          } = req.query;

    //         let sortQuery = { Order: 1 };
    //         var query = { deleted: false, type: { $ne: 'VISITOR' } ,phoneVerified:true};
    //         if (archive) query.deleted = true;
    //         if (name) query.$or = [{name:{ '$regex': name, '$options': 'i' }},{$or:[{'username.ar':{ '$regex': name, '$options': 'i' }},{'username.en':{ '$regex': name, '$options': 'i' }}]}];
    //         if (phone) query.phone = { '$regex': phone, '$options': 'i' };
    //         if (email) query.email = { '$regex': email, '$options': 'i' };
    //         if (type) query.type = type;
    //         if (activated) query.activated = activated;
    //         if (countryKey) query.countryKey = countryKey;
    //         if (region) query.region = region;
    //         if (countryCode) query.countryCode = countryCode;
    //         if (driver) query.driver = driver;
    //         if (shopType) query.shopType = shopType;
    //         if (country) {
    //             let userCountries = await Address.find({deleted:false , country :  country }).distinct('user');
    //             query._id = {$in : userCountries}
    //         }
    //         if (categoryName) { // get traders by category name
    //             let nameQuery = [{ 'name.en': { '$regex': categoryName, '$options': 'i' } }, { 'name.ar': { '$regex': categoryName, '$options': 'i' } }]
    //             let catetgories = await SubCategory.find({deleted:false, $or:nameQuery , parent:null }).distinct('_id');
    //             let subCategories = await SubCategory.find({deleted:false, parent : {$in:catetgories}  }).distinct('_id');
    //             query.subCategories = {$in:subCategories} ;
    //         }
    //         if (tradersByMarketName) {
    //             let markets = await User.find({deleted:false,type:'MARKET',name:{ '$regex': tradersByMarketName, '$options': 'i' } }).distinct('_id');
    //             query.market = {$in:markets};
    //         }
    //         if (market) {
    //             query.market = market;
    //         }

    //         if (marketsByCategory) {
    //             if (Array.isArray(marketsByCategory)) {
    //                 let subIds = await categoryModel.find({deleted:false,parent:{$in:marketsByCategory}}).distinct('_id');
    //                 let marketIds = await User.find({deleted:false,subCategories:{$in:subIds}}).distinct('market');
    //                 query._id = {$in:marketIds}
    //             } else if (!isNaN(marketsByCategory)) {
    //                 let subIds = await categoryModel.find({deleted:false,parent:marketsByCategory}).distinct('_id');
    //                 let marketIds = await User.find({deleted:false,subCategories:{$in:subIds}}).distinct('market');
    //                 query._id = {$in:marketIds}
    //             }
    //         }
    //         if (marketsBySubCategories) {
    //             if (Array.isArray(marketsBySubCategories)) {
    //                 let marketIds = await User.find({deleted:false,subCategories:{$in:marketsBySubCategories}}).distinct('market');
    //                 query._id = {$in:marketIds}
    //             } else if (!isNaN(marketsBySubCategories)) {
    //                 let marketIds = await User.find({deleted:false,subCategories:marketsBySubCategories}).distinct('market');
    //                 query._id = {$in:marketIds}
    //             }
    //         }

    //         if (subCategory) {
    //             if (Array.isArray(subCategory)) {
    //                 query.subCategories = {$in:subCategory}
    //             } else if (!isNaN(subCategory)) {
    //                 query.subCategories = subCategory
    //             }
    //         }

    //         if (category) {
    //             if (Array.isArray(category)) {
    //                 let subIds = await categoryModel.find({deleted:false,parent:{$in:category}}).distinct('_id');
    //                 // query.subCategories = {$in:subIds}
    //                 // query.categories = {$in:category}
    //                 query.$or = [{categories :{$in:category}},{subCategories : {$in:subIds}}]
    //             } else if (!isNaN(category)) {
    //                 let subIds = await categoryModel.find({deleted:false,parent:category}).distinct('_id');
    //                 // if(subIds.length != 0) query.subCategories = {$in:subIds}
    //                 // query.categories = {$in:[category]};
    //                 query.$or = [{categories : {$in:[category]}},{subCategories : {$in:subIds}}]
    //             }
    //         }

    //         if (tradersByRegion) {
    //             if (Array.isArray(tradersByRegion)) {
    //                 let marketIds = await User.find({deleted:false,region:{$in:tradersByRegion},type:'MARKET'}).distinct('_id');
    //                 query.market = {$in:marketIds};
    //             } else if (!isNaN(tradersByRegion)) {
    //                 let marketIds = await User.find({deleted:false,region:tradersByRegion,type:'MARKET'}).distinct('_id');
    //                 query.market = {$in:marketIds};
    //             }
    //         }
    //         if(mostRated){
    //             sortQuery = {rate:-1}
    //         }
    //         if(similarTraders){
    //             let currentTrader = await User.findById(similarTraders);
    //             query.$or = [{region: currentTrader.region},{market:currentTrader.market},{market:currentTrader.market},{subCategories:{$in:currentTrader.subCategories}}];
    //             query._id = {$ne:similarTraders};
    //             query.type = 'TRADER'
    //         }
    //         if (marketsByCategoryName) {
    //             let categories = await categoryModel.find({ deleted: false, $or : [{ 'name.en': { '$regex': marketsByCategoryName, '$options': 'i' } }, { 'name.ar': { '$regex': marketsByCategoryName, '$options': 'i' } }], parent: { $eq: null }}).distinct('_id');
    //             let subIds = await categoryModel.find({deleted:false,parent:{$in:categories}}).distinct('_id');
    //             let marketIds = await User.find({deleted:false,subCategories:{$in:subIds}}).distinct('market');
    //             query._id = {$in:marketIds};
    //         }
    //         if (marketsByRegions) {
    //             if (Array.isArray(marketsByRegions)) {
    //                 query.region = {$in:marketsByRegions}
    //             } else if (!isNaN(marketsByRegions)) {
    //                 query.region = marketsByRegions
    //             }
    //         }
    //         if (marketsByCity) {
    //             let regions = [];
    //             if (Array.isArray(marketsByCity)) {
    //                 regions = await Region.find({deleted:false,city:{$in:marketsByCity}}).distinct('_id');
    //             } else if (!isNaN(marketsByCity)) {
    //                 regions = await Region.find({deleted:false,city:marketsByCity}).distinct('_id');
    //             }
    //             query.region = {$in:regions};
    //         }
    //         if (productName) {
    //             let traders = await Product.find({deleted:false,$or: [{ 'name.en': { '$regex': productName, '$options': 'i' } }, { 'name.ar': { '$regex': productName, '$options': 'i' } }]}).distinct('trader');
    //             let marketIds = await User.find({deleted:false,_id:{$in:traders}}).distinct('market');
    //             if (query._id) {
    //                 query.$and = [{_id:query._id},{_id:{$in:marketIds}}];
    //                 delete query._id;

    //             }else{
    //                 query._id = {$in:marketIds};
    //             }
    //         }



    //         if (fromDate && toDate) {
    //             let startOfDate = moment(fromDate).startOf('day');
    //             let endOfDate = moment(toDate).endOf('day');
    //             query.createdAt = { $gte: new Date(startOfDate), $lte: new Date(endOfDate) };
    //         } else if (toDate && !fromDate) {
    //             let endOfDate = moment(toDate).endOf('day');
    //             query.createdAt = { $lte: new Date(endOfDate) };
    //         } else if (fromDate && !toDate) {
    //             let startOfDate = moment(fromDate).startOf('day');
    //             query.createdAt = { $gte: new Date(startOfDate) };
    //         }

    //         let date = new Date();
    //         if (month && year && !day) {
    //             month = month - 1;
    //             date.setMonth(month);
    //             date.setFullYear(year);
    //             let startOfDate = moment(date).startOf('month');
    //             let endOfDate = moment(date).endOf('month');
    //             query.createdAt = { $gte: new Date(startOfDate), $lte: new Date(endOfDate) }
    //         }
    //         if (year && !month) {
    //             date.setFullYear(year);
    //             let startOfDate = moment(date).startOf('year');
    //             let endOfDate = moment(date).endOf('year');
    //             query.createdAt = { $gte: new Date(startOfDate), $lte: new Date(endOfDate) }
    //         }
    //         if (month && year && day) {
    //             month = month - 1;
    //             date.setMonth(month);
    //             date.setFullYear(year);
    //             date.setDate(day);
    //             let startOfDay = moment(date).startOf('day');
    //             let endOfDay = moment(date).endOf('day');
    //             query.createdAt = { $gte: new Date(startOfDay), $lte: new Date(endOfDay) }
    //         }
    //         console.log(query)
    //         let users;
    //         let pageCount;
    //         const userCount = await User.count(query);
    //         if (all) {
    //             users = await User.find(query).populate(populateQuery).sort(sortQuery);
    //             pageCount = 1;
    //         } else {
    //             users = await User.find(query).populate(populateQuery).sort(sortQuery).limit(limit).skip((page - 1) * limit);
    //             pageCount = Math.ceil(userCount / limit);
    //         }
    //         if (userId) {
    //             await checkFollow(users,userId);
    //         }

    //         if (!removeLanguage) {
    //             users = User.schema.methods.toJSONLocalizedOnly(users, i18n.getLocale());
    //         }
    //         res.send(new ApiResponse(users, page, pageCount, limit, userCount, req));
    //     } catch (error) {
    //         next(error)
    //     }
    // },
    validateBandUser() {
        return [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('codeRequired') }),
        ];
    },
    async bandUser(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            let user = await User.findOne({_id:validatedBody.userId})
            if(user.haveTrip){
                if(user.type == 'DRIVER'){
                    CarModel.updateOne({_id:user.TripId},{canceled:true})
                    MsfrModel.updateMany({canceled:false,deleted:false,AddedTo:user.TripId},{AddedTo:-1})
                    let notiOrders = await order.find({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,carId:user.id})
                    notiOrders.map(async (ord)=>{
                        let msf = await UserModel.findOne({_id:ord.userId})
                        //-Mo?
                        if(ord.stat == "ACCEPTED"){
                            await notificationController.pushNotification(msf, 'TRIP', '',`قام السائق ${user.name} بإلغاء الرحلة` , 'إلغاء الرحلة');
                        }else if(ord.orderOf == "DRIVER"){
                            await notificationController.pushNotification(msf, 'ORDER', '',`قام السائق ${user.name} بإلغاء طلب الحجز` , 'إلغاء الطلب');
                        }else if(ord.orderOf == "CLIENT"){
                            await notificationController.pushNotification(msf, 'ORDER', '',`قام السائق ${user.name} بعدم قبول طلب الحجز` , 'رفض الطلب');
                        }
                    })
                    await order.updateMany({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,carId:user.id,orderOf:"DRIVER"},{stat:"CANCELED"})
                    await order.updateMany({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,carId:user.id,orderOf:"CLIENT"},{stat:"REFUSED"})
                }else{
                    let msfr =await MsfrModel.findOneAndUpdate({_id:user.TripId},{canceled:true})
                    let car = await CarModel.findOne({_id:msfr.AddedTo})
                    let notiOrders = await order.find({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,userId:user.id})
                    notiOrders.map(async (ord)=>{
                        let msf = await UserModel.findOne({_id:ord.carId})
                        if(ord.stat == "ACCEPTED"){
                            await notificationController.pushNotification(msf, 'TRIP', '',`قام الراكب${user.name} بإلغاء الرحلة` , 'إلغاء الرحلة');
                        }else if(ord.orderOf == "DRIVER"){
                            await notificationController.pushNotification(msf, 'ORDER', '',`قام الراكب ${user.name} بإلغاء طلب الحجز` , 'إلغاء الطلب');
                        }else if(ord.orderOf == "CLIENT"){
                            await notificationController.pushNotification(msf, 'ORDER', '',`قام الراكب ${user.name} بعدم قبول طلب الحجز` , 'رفض الطلب');
                        }
                    })
                    //-Mo? why many ?
                    await order.updateMany({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,userId:user.id,orderOf:"CLIENT"},{stat:"CANCELED"})
                    await order.updateMany({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,userId:user.id,orderOf:"DRIVER"},{stat:"REFUSED"})
                    car.isCompleted = false
                    car.added -= msfr.numPers
                    await car.save()
                }
            }
            user.haveTrip = false
            user.banded = true
            let band = await bandedModel.create({userId:validatedBody.userId,deviceId:user.deviceId})
            await user.save()
            res.status(200).send("تم الحظر" + user.name)
        } catch (err) {
            next(err);
        }
    },
    
    validateDeviceId() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('deviceId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },
    async CheckDeviceId(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            var query = { deleted: false}
            query = {...query,_id: validatedBody.id}
            let user = await User.findOne(query) //.populate(populateQuery);
                if (user) {
                    let isDevice = user.deviceId != validatedBody.deviceId
                    res.status(200).send({isDevice:isDevice})
                }
        } catch (err) {
            next(err);
        }
    },
    validateUserSignin() {
        let validations = [
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            // body('deviceId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
        return validations;
    },

    async signIn(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            var query = { deleted: false} //, type: validatedBody.type };
            query = {...query,...getCountryCode(validatedBody.phone)}
            let user = await User.findOne(query) //.populate(populateQuery);
            if (user) {
                await Commercial.updateMany({userId:user.id},{latest:false})
                await saOrder.updateMany({userId:user.id},{latest:false})
                await Shohnat.updateMany({userId:user.id},{latest:false})
                // user.deviceId = validatedBody.deviceId
                await user.save()
                let band = await bandedModel.findOne({deviceId:validatedBody.deviceId})
                if(band && user.banded){
                    res.status(200).send({user:user,band:band})
                }else{
                    
                    if( !testNumber.includes(query.phone) ){
                      twilioSend(query.countryCode  + query.phone,'ar',res, next);
                    }else{
                       res.status(200).send("send code successfuly");
                    }
                }



                // await user.isValidPassword(validatedBody.password, async function (err, isMatch) {
                //     if (err) {
                //         next(err)
                //     } else if (isMatch) {
                //         if (!user.activated) {
                //             return next(new ApiError(403, i18n.__('accountStop')));
                //         }
                //         if (!user.phoneVerified) {
                //             twilioSend(config.countryCode  + user.phone, user.language || 'ar');
                //             return res.status(200).send({ user});
                //         }
                //         return res.status(200).send({ user, token: generateToken(user.id) });
                //     } else {
                //         return next(new ApiError(400, i18n.__('passwordInvalid')));
                //     }
                // })
            } else {
                return next(new ApiError(403, i18n.__('userNotFound')));
            }
        } catch (err) {
            next(err);
        }
    },
    validateAdminSignin() {
        let validations = [
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
//            body('password').not().isEmpty().withMessage(() => { return i18n.__('passwordRequired') }),
            // body('type').not().isEmpty().withMessage(() => { return i18n.__('typeIsRequired') })
                // .isIn(['CLIENT','MARKET','TRADER','DRIVER']).withMessage(() => { return i18n.__('userTypeWrong') }),
        ];
        return validations;
    },

    async AdminsignIn(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            var query = { deleted: false,type:{$in:["ADMIN"]}} //, type: validatedBody.type };
            query = {...query,...getCountryCode(validatedBody.phone)}
            let user = await User.findOne(query)
            if (user) {
                // res.status(200).send("send code successfuly")
                if( !testNumber.includes(query.phone) ){
                    twilioSend(query.countryCode  + query.phone,'ar',res, next);
                  }else{
                     res.status(200).send("send code successfuly");
                  }
            } else {
                return next(new ApiError(403, i18n.__('userNotFound')));
            }
        } catch (err) {
            next(err);
        }
    },


    validateUsersetLocation() {
        let validations = [
            body('city').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('country').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('id').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
//            body('password').not().isEmpty().withMessage(() => { return i18n.__('passwordRequired') }),
            // body('type').not().isEmpty().withMessage(() => { return i18n.__('typeIsRequired') })
                // .isIn(['CLIENT','MARKET','TRADER','DRIVER']).withMessage(() => { return i18n.__('userTypeWrong') }),
        ];
        return validations;
    },

    async setLocation(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            var query = { deleted: false , _id:validatedBody.id} //, type: validatedBody.type };
            let temp = await User.findOne(query) //.populate(populateQuery);
            let user = await User.findOne(query).populate({path:"TripId",model:temp.isDriver?  "onlineCar" : "onlineMsfr"});
            if (user) {
                user.city = validatedBody.city
                user.country = validatedBody.country
                user.save()
                res.status(200).send(user)
            } else {
                return next(new ApiError(403, i18n.__('userNotFound')));
            }
        } catch (err) {
            next(err);
        }
    },


    validateUserCreateBody() {
        let validations = [

            //body('subCategories').optional().isArray().withMessage(() => { return i18n.__('subCategoriesRequired') }),
            //body('subCategories.*').optional().not().isEmpty().withMessage(() => { return i18n.__('subCategoryRequired') })
            // .custom(async(value)=>{
            //     await checkExist(value,SubCategory,{deleted:false});
            //     return true;
            // }),
            // body('traderMarketAddress').optional().not().isEmpty().withMessage(() => { return i18n.__('traderMarketAddressRequired') }),

            // body('type').not().isEmpty().withMessage(() => { return i18n.__('typeRequired') })
            //     .isIn(['CLIENT','TRADER']).withMessage(() => { return i18n.__('invalidType') }),

            // body('shopType').optional().not().isEmpty().withMessage(() => { return i18n.__('shopTypeRequired') })
            //     .isIn(['RETAIL','WHOLESALE','ALL']).withMessage(() => { return i18n.__('invalidShopType') }),

            // body('name').not().isEmpty().withMessage(() => { return i18n.__('nameRequired') })
            // .custom(async (value, { req }) => {
            //     value = (value.trim());
            //     let userQuery = { username: value, deleted: false };
            //     if (await User.findOne(userQuery))
            //         throw new Error(i18n.__('usernameDuplicated'));
            //     return true;
            // })

            // body('email').optional().trim().not().isEmpty().withMessage(() => { return i18n.__('emailRequired') })
            //     .isEmail().withMessage(() => { return i18n.__('EmailNotValid') })
            //     .custom(async (value, { req }) => {
            //         value = (value.trim()).toLowerCase();
            //         await User.updateMany({email: value,deleted:false,phoneVerified:false},{$set:{deleted:true}});
            //         let userQuery = { email: value, deleted: false };
            //         if (await User.findOne(userQuery))
            //             throw new Error(i18n.__('emailDuplicated'));
            //         return true;
            //     }),
            // body('password').not().isEmpty().withMessage(() => { return i18n.__('passwordRequired') }),
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }).custom(async (value, { req }) => {
                value = (value.trim()).toLowerCase();
                await User.updateMany({phone: value,deleted:false,phoneVerified:false},{$set:{deleted:true}});
                let userQuery = { phone: value, deleted: false };
                if (await User.findOne(userQuery))
                    throw new Error(i18n.__('phoneDuplicated'));
                return true;
            }),
            // body('countryCode').optional().not().isEmpty().withMessage(() => { return i18n.__('countryCodeRequired') }),
            // body('countryKey').optional().not().isEmpty().withMessage(() => { return i18n.__('countryKeyRequired') }),
            // body('region').optional().not().isEmpty().withMessage(() => { return i18n.__('regionRequired') }).custom(async (val, { req }) => {
            //     await checkExist(val, Region, { deleted: false });
            //     return true;
            // }),
            // body('market').optional().not().isEmpty().withMessage(() => { return i18n.__('marketRequired') }).custom(async (val, { req }) => {
            //     await checkExist(val, User, { deleted: false , type:'MARKET'});
            //     return true;
            // }),
            // body('storeEmployees').optional().not().isEmpty().withMessage(() => { return i18n.__('storeEmployeesRequired') }).isArray().withMessage('must be an array'),

        ];
        return validations;
    },

    async userSignUp(req, res, next) {
        try {
            const validatedBody = checkValidations(req);

            // if (validatedBody.email) {
            //     validatedBody.email = (validatedBody.email.trim()).toLowerCase();
            // }

            // if (req.files && req.files['image'] && (req.files['image'].length > 0)) {
            //     validatedBody.image = fieldhandleImg(req, { attributeName: 'image', isUpdate: false })[0];
            // }
            // if (req.files && req.files['commercialRecord'] && (req.files['commercialRecord'].length > 0)) {
            //     validatedBody.commercialRecord = fieldhandleImg(req, { attributeName: 'commercialRecord', isUpdate: false })[0];
            // }
            // if (req.files && req.files['taxCard'] && (req.files['taxCard'].length > 0)) {
            //     validatedBody.taxCard = fieldhandleImg(req, { attributeName: 'taxCard', isUpdate: false })[0];
            // }


            // if ((validatedBody.type ==  'CLIENT') && (!validatedBody.email) ) {
            //     return next(new ApiError(404,i18n.__('emailRequired')) );
            // }
            // if ((validatedBody.type == 'TRADER') && (!(validatedBody.shopType && validatedBody.market  )) ) {
            //     return next(new ApiError(404,i18n.__('shopTypeAndMarketRequired')) );
            // }

            // if(validatedBody.type == 'TRADER'){
            //     let subscription = await Subscription.findOne({deleted: false,type:'FREE'});
            //     if(subscription) validatedBody.subscription = subscription.id;
            // }


             let query = {...validatedBody,...getCountryCode(validatedBody.phone)}
            // let createdUser = await User.create(query);
            // createdUser = await User.populate(createdUser,populateQuery);
            // createdUser = User.schema.methods.toJSONLocalizedOnly(createdUser, i18n.getLocale());

            //adminNSP.to('room-admin').emit(socketEvents.NewSignup, { user: createdUser });

            
            // res.status(200).send("send code successfuly")
            if( !testNumber.includes(query.phone) ){
                twilioSend(query.countryCode  + query.phone,'ar',res,next);
              }else{
                 res.status(200).send("send code successfuly");
              }
                // twilioSend(query.countryCode  + query.phone,'ar',res,next);
                //  res.status(200).send("send code successfuly");
            // twilioSend(query.countryCode  + query.phone,'ar',res,next);


        } catch (err) {
            next(err);
        }
    },
    validateAddAddress() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('geoLocation').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('name').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('address').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('type').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('address.country').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('address.city').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') })
            // body('address.region').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
        ];
        return validations;
    },

    async addAddress(req, res, next) {
        try {
            const validatedBody = checkValidations(req);

            let {id,type,...address} = validatedBody
            console.log(address);
            if(address.address.city?.id){
                address.address.city = address.address.city.id
            }
            let temp = await User.findOne({_id: id})
            let user = await User.findOne({_id: id, deleted: false }).populate({path:"TripId",model:temp.isDriver?  "onlineCar" : "onlineMsfr"});
            if(type == "To"){
                let index = user.toaddresses.findIndex((item)=> item.name == address.name)
                if(index == -1){
                    user.toaddresses.push(address)
                }else{
                    user.toaddresses[index] = address
                }
            }else if(type == "From"){
                let index = user.fromaddresses.findIndex((item)=> item.name == address.name)
                if(index == -1){
                    user.fromaddresses.push(address)
                }else{
                    user.fromaddresses[index] = address
                }
            }
            // user.type = "DRIVER"
            await user.save();

            res.status(200).send(user)


        } catch (err) {
            next(err);
        }
    },
    validateCarCreateBody() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('image').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('carClass').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('carModel').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('carType').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('carID').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            // body('fromCity').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            // body('toCity').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('isTrav').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('isPers').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('isTrade').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') })
        ];
        return validations;
    },
    
    async carSignUp(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            
            let {id,...car} = validatedBody
            //Mo?
            let user = await User.findOne({_id: id})
            notifyAdmin('CAR', validatedBody.id.toString(), "تم تسجيل سيارة جديدة في إنتظار المعاينة", 'تسجيل سيارة')
            user.car = {...car,signUpDate:new Date()}
            user.haveTrip = false
            let msfr = await MsfrModel.findOne({_id: user.TripId,deleted: false,canceled:false})
            if(msfr){
                msfr.canceled = true
                if(msfr.AddedTo >= 0){
                    let car = await CarModel.findOne({_id:msfr.AddedTo, deleted: false , canceled : false})
                    if(car){
                        car.isCompleted = false
                        car.added -= msfr.numPers
                        await car.save()
                    }
                }
                await msfr.save()
            }
            // user.type = "DRIVER"
            await user.save();

            res.status(200).send(user)
            
            
        } catch (err) {
            next(err);
        }
    },
    validateRefuseCar() {
        let validations = [
            body('id').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
        ];
        return validations;
    },
    async refuseCar(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            
            let {id} = validatedBody
            
            let user = await User.findOne({_id: id})
            await notificationController.pushNotification(user, 'CAR', validatedBody.id.toString(), "تم رفض طلبك لتسجيل السيارة سيتم التواصل معك لابداء الاسباب", 'تسجيل سيارة')
            let car = {
                fromCity:user.fromCity,
                toCity:user.toCity
            }
            user.car = {...car}
            await user.save();
            res.status(200).send(user)
        } catch (err) {
            console.log(err)
            next(err);
        }
    },
    validateVerifyPhone() {
        return [
            body('code').not().isEmpty().withMessage(() => { return i18n.__('codeRequired') }),
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('name').not().isEmpty().withMessage(() => { return i18n.__('nameRequired') }),
            body('deviceId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })

        ];
    },
    validateVerifySign() {
        return [
            body('code').not().isEmpty().withMessage(() => { return i18n.__('codeRequired') }),
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('deviceId').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })

        ];
    },
    async verifySignIn(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            // var phone = validatedBody.phone;
            // phone = phone.trim()
            validatedBody = {...validatedBody,...getCountryCode(validatedBody.phone)}
            var temp = await User.findOne({ phone: validatedBody.phone, deleted: false });
            let user = await User.findOne({ phone: validatedBody.phone, deleted: false }).populate({path:"TripId",model:temp.isDriver?  "onlineCar" : "onlineMsfr"});
            user.deviceId = validatedBody.deviceId
            await user.save()
            if (!user)
                return next(new ApiError(403, i18n.__('userNotFound')));
            //
            if( !testNumber.includes(validatedBody.phone) ){
              twilioVerify( validatedBody.countryCode + validatedBody.phone, validatedBody.code, user, res, next);
            }else{
              console.log(user);
              res.status(200).send(user);
            }
        } catch (err) {
            next(err);
        }
    },
    validateVerifyAdminSign() {
        return [
            body('code').not().isEmpty().withMessage(() => { return i18n.__('codeRequired') }),
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })

        ];
    },
    async verifyAdminSignIn(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            // var phone = validatedBody.phone;
            // phone = phone.trim()
            validatedBody = {...validatedBody,...getCountryCode(validatedBody.phone)}
            var user = await User.findOne({ phone: validatedBody.phone, deleted: false });

            if (!user)
                return next(new ApiError(403, i18n.__('userNotFound')));

            if( !testNumber.includes(validatedBody.phone) ){
            twilioVerify( validatedBody.countryCode + validatedBody.phone, validatedBody.code, user, res, next);
            }else{
            res.status(200).send(user);
            }
            // res.status(200).send(user)

        } catch (err) {
            next(err);
        }
    },

    async getUserInfo (req, res, next) {
        try {
            var temp = await User.findOne({ _id: req.query.userId || -1, deleted: false });
            let user = await User.findOne({ _id: req.query.userId || -1, deleted: false }).populate({path:"TripId",model:temp.isDriver?  "onlineCar" : "onlineMsfr"});
            if (!user){
                return next(new ApiError(403, i18n.__('userNotFound')));
            }
            let band = await bandedModel.findOne({deviceId:user.deviceId})
            user
            res.status(200).send({user: user,band: band});
        } catch (err) {
            next(err);
        }
    },
    async getCarSign (req, res, next) {
        try {
            let dateQ = carSignUpQuery(req.query.from,req.query.to)
            var cars = await User.find({"car.carID":{$exists:true}, "deleted": false, "type":"CLIENT" ,...dateQ});
            res.status(200).send(cars)
        } catch (err) {
            next(err);
        }
    },
    async getCars (req, res, next) {
        try {
            let dateQ = carAcceptQuery(req.query.from,req.query.to)
            var cars = await User.find({type:"DRIVER",...dateQ});
            
            res.status(200).send(cars)
        } catch (err) {
            next(err);
        }
    },
    async getMands (req, res, next) {
        try {
            var mands = await Mand.find({deleted: false}).populate("userId");
            res.status(200).send(mands)
        } catch (err) {
            next(err);
        }
    },
    async acceptCarSign (req, res, next) {
        try {
            let {userId} = req.query
            var temp = await User.findOne({_id:userId});
            await notificationController.pushNotification(temp, 'CAR', '',`مبروك ,, تم قبول تسجيل سيارتك بالتطبيق ، تستطيع الآن تسجيل رحلاتك ` , 'طلب التسجيل');
            temp.type = "DRIVER"
            temp.car.acceptDate = new Date()
            // if(temp.haveTrip){
            //     let oMsfr = await MsfrModel.findOne({_id:temp.TripId}).populate("userId")
            //     oMsfr.canceled = true
            //     let oCar = await CarModel.findOne({deleted:false,canceled:false,_id:oMsfr.AddedTo})
            //     if(oCar){
            //         oCar.isCompleted = false
            //         oCar.added -= oMsfr.numPers
            //         await oCar.save()
            //     }
            //     let driver = await User.findOne({_id:userId}).populate({path:"TripId",model:"onlineMsfr"})
            //     let notiOrders = await order.find({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,userId:temp.id})
            //     notiOrders.map(async (ord)=>{
            //         let msf = await UserModel.findOne({_id:ord.carId})
            //         //-Mo?
            //         if(ord.stat == "ACCEPTED"){
            //             await notificationController.pushNotification(msf, 'TRIP', '',`قام ${temp.name} بإلغاء الرحلة` , 'إلغاء الرحلة');
            //         }else if(ord.orderOf == "DRIVER"){
            //             await notificationController.pushNotification(msf, 'ORDER', '',`قام ${temp.name} بإلغاء طلب الحجز` , 'إلغاء الطلب');
            //         }else if(ord.orderOf == "CLIENT"){
            //             await notificationController.pushNotification(msf, 'ORDER', '',`قام ${temp.name} بعدم قبول طلب الحجز` , 'رفض الطلب');
            //         }
            //     })
            //     await order.updateMany({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,userId:temp.id,orderOf:"CLIENT"},{stat:"CANCELED"})
            //     await order.updateMany({stat:{$in:["WAITTING","ACCEPTED"]},deleted:false,userId:temp.id,orderOf:"DRIVER"},{stat:"REFUSED"})
            //     driver.haveTrip = false
            //     await driver.save()
            //     await oMsfr.save()
            // }
            temp.haveTrip = false
            await temp.save();
            let user = await User.findOne({ _id:userId, deleted: false }).populate({path:"TripId",model:temp.isDriver?  "onlineCar" : "onlineMsfr"});
            res.status(200).send(user)
        } catch (err) {
            next(err);
        }
    },
    async verifyPhone(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            // var phone = validatedBody.phone;
            // phone = phone.trim()
            validatedBody = {...validatedBody,...getCountryCode(validatedBody.phone)}
            // var user = await User.findOne({ phone: phone, deleted: false });
            // if (!user)
            //     return next(new ApiError(403, i18n.__('userNotFound')));
            validatedBody.country = validatedBody.countryCode == "+967" ? "YE" : "SA"
            
            // res.status(200).send(user)
            if( !testNumber.includes(validatedBody.phone) ){
                twilioVerify( validatedBody.countryCode + validatedBody.phone, validatedBody.code, {}, res, next ,{ Model : User ,query :validatedBody})
                }else{
                let user = await User.create(validatedBody)
                res.status(200).send(user);
                }
        } catch (err) {
            next(err);
        }
    },


    validateResendCode() {
        return [
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
        ];
    },

    async resendCode(req, res, next) {
        try {
            let validatedBody = checkValidations(req);

            // var phone = validatedBody.phone;
            // phone = phone.trim()

            // var user = await User.findOne({ phone: phone, deleted: false });
            // if (!user)
            //     return next(new ApiError(403, i18n.__('userNotFound')));
            let query = {...validatedBody,...getCountryCode(validatedBody.phone)}
            if( !testNumber.includes(query.phone) ){
                twilioSend(query.countryCode  + query.phone, 'ar',res,next);
              }else{
                 res.status(200).send("send code successfuly");
              }
            


            // twilioSend(validatedBody.countryCode  + validatedBody.phone, 'ar');
            // res.status(200).send()

        } catch (err) {
            next(err);
        }
    },

    ///////////////////////////////////////////////////////// in update profile
    validateUpdateToken() {
      let validation = [
          body('token').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
          body('user').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') })
      ];
      return validation;
    },
    async updateToken(req, res, next) {
      try {
          let userId = req.user;
          if(userId !== null){
            let validatedBody = checkValidations(req);
            console.log(validatedBody);
            let data = {};
            let user = await User.findOne({ deleted: false, _id: validatedBody.user });
            user.token = validatedBody.token;
            await user.save();
            res.status(200).send();
          }else{
            next('user_error');

          }
      } catch (err) {
        console.log(err)

          next(err);
      }
    },
    async sendActivateCode(req, res, next) {
        try {
            let user = req.user;
            let validatedBody = checkValidations(req);
            var phone = validatedBody.phone;
            phone = phone.trim();

            // twilioSend(config.countryCode  + phone, user.language || 'ar');
            res.status(200).send();
        } catch (err) {
            next(err);
        }
    },
    async confirmActivateCode(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            var phone = validatedBody.phone;
            phone = phone.trim();
            // twilioVerify( config.countryCode  + phone, validatedBody.code, null, res, next);
        } catch (err) {
            next(err);
        }
    },

    /////////////////////////////////////////////////////////

    validateCheckPhone() {
        return [
            body('phone').trim().not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') })
        ]
    },
    async checkExistPhone(req, res, next) {
        try {
            let phone = checkValidations(req).phone;
            let exist = await User.findOne({ phone: phone, deleted: false });
            return res.status(200).send({ duplicated: exist ? true : false });
        } catch (error) {
            next(error);
        }
    },

    validateCheckEmail() {
        return [
            body('email').trim().not().isEmpty().withMessage(() => { return i18n.__('emailRequired') })
        ]
    },
    async checkExistEmail(req, res, next) {
        try {
            let email = checkValidations(req).email.toLowerCase();
            let exist = await User.findOne({ email: email, deleted: false });
            return res.status(200).send({ duplicated: exist ? true : false });
        } catch (error) {
            next(error);
        }
    },

    validateUserUpdate() {
        let validations = [
            body('categories').optional().isArray().withMessage(() => { return i18n.__('categoriesRequired') }),
            body('categories.*.en').optional().not().isEmpty().withMessage(() => { return i18n.__('categoryRequired') }),
            body('categories.*.ar').optional().not().isEmpty().withMessage(() => { return i18n.__('categoryRequired') }),

            body('traderMarketAddress').optional(),

            body('storeEmployees').optional().isArray().withMessage('must be an array'),

            // body('workTimes').optional(),
            body('workDays').optional().isArray().withMessage(() => { return i18n.__('invalidWorkDays') }),
            body('workPeriods').optional().isArray().withMessage(() => { return i18n.__('invalidWorkPeriods') }),
            body('workPeriods.*.from').optional().not().isEmpty().withMessage(() => { return i18n.__('fromRequired') }),
            body('workPeriods.*.to').optional().not().isEmpty().withMessage(() => { return i18n.__('toRequired') }),

            body('subCategories').optional().isArray().withMessage(() => { return i18n.__('subCategoriesRequired') }),
            body('subCategories.*').optional().not().isEmpty().withMessage(() => { return i18n.__('subCategoryRequired') })
            .custom(async(value)=>{
                await checkExist(value,SubCategory,{deleted:false});
                return true;
            }),
            body('slider').optional().isArray().withMessage(() => { return i18n.__('sliderRequired') }),
            body('searchKeys').optional().isArray().withMessage(() => { return i18n.__('searchKeysRequired') }),

            body('phones').optional()
            .isArray().withMessage(() => { return i18n.__('invalidPhonesValue') }),
            // .not().isEmpty().withMessage(() => { return i18n.__('phonesRequired') })
            body('socialLinks').optional()
                    .isArray().withMessage(() => { return i18n.__('socialLinksValueError') }),
            body('socialLinks.*.key').optional().not().isEmpty().withMessage(() => { return i18n.__('socialLinksRequired') }),
            body('socialLinks.*.value').optional().not().isEmpty().withMessage(() => { return i18n.__('socialLinksRequired') }),


            body('location.address').optional().not().isEmpty().withMessage(() => { return i18n.__('addressRequired') }),
            body('location.longitude').optional().not().isEmpty().withMessage(() => { return i18n.__('longitudeRequired') }),
            body('location.latitude').optional().not().isEmpty().withMessage(() => { return i18n.__('latitudeRequired') }),

            body('market').optional().not().isEmpty().withMessage(() => { return i18n.__('marketRequired') }).custom(async (val, { req }) => {
                await checkExist(val, User, { deleted: false , type:'MARKET'});
                return true;
            }),
            body('shopType').optional().not().isEmpty().withMessage(() => { return i18n.__('shopTypeRequired') })
                .isIn(['RETAIL','WHOLESALE','ALL']).withMessage(() => { return i18n.__('invalidShopType') }),

            body('name').optional().not().isEmpty().withMessage(() => { return i18n.__('nameRequired') }),
            body('email').optional().trim().not().isEmpty().withMessage(() => { return i18n.__('emailRequired') })
                .isEmail().withMessage(() => { return i18n.__('Email Not Valid') })
                .custom(async (value, { req }) => {
                    value = (value.trim()).toLowerCase();
                    await User.updateMany({email: value,deleted:false,phoneVerified:false},{$set:{deleted:true}});
                    let userQuery = { _id: { $ne: req.user.id }, email: value, deleted: false };
                    if (await User.findOne(userQuery))
                        throw new Error(i18n.__('emailDuplicated'));
                    else
                        return true;
                }),
            body('phone').optional().not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') })
                .custom(async (value, { req }) => {
                    value = (value.trim()).toLowerCase();
                    await User.updateMany({phone: value,deleted:false,phoneVerified:false},{$set:{deleted:true}});
                    let userQuery = { _id: { $ne: req.user.id }, phone: value, deleted: false };
                    if (await User.findOne(userQuery))
                        throw new Error(i18n.__('phoneDuplicated'));
                    else
                        return true;
                }),
            body('language').optional().not().isEmpty().withMessage(() => { return i18n.__('languageRequired') }).isIn(['ar', 'en']),
            body('notification').optional().not().isEmpty().withMessage(() => { return i18n.__('notificationRequired') }),
            body('newPassword').optional().not().isEmpty().withMessage(() => { return i18n.__('newPasswordRequired') }),
            body('currentPassword').optional().not().isEmpty().withMessage(() => { return i18n.__('CurrentPasswordRequired') }),
            body('countryCode').optional().not().isEmpty().withMessage(() => { return i18n.__('countryCodeRequired') }),
            body('countryKey').optional().not().isEmpty().withMessage(() => { return i18n.__('countryKeyRequired') }),
            body('streetNumber').optional().not().isEmpty().withMessage(() => { return i18n.__('streetNumberRequired') }),
            body('region').optional().not().isEmpty().withMessage(() => { return i18n.__('regionRequired') }).custom(async (val, { req }) => {
                await checkExist(val, Region, { deleted: false });
                return true;
            }),
            body('subscription').optional().not().isEmpty().withMessage(() => { return i18n.__('subscriptionRequired') }).custom(async (val, { req }) => {
                await checkExist(val, Subscription, { deleted: false });
                return true;
            })
        ];

        return validations;
    },
    async updateInfo(req, res, next) {
        try {
            let userId = req.user.id;
            let validatedBody = checkValidations(req);
            let data = {};
            let user = await checkExistThenGet(userId, User, { deleted: false });


            if (validatedBody.categories) {
                data.categories = validatedBody.categories;
                delete validatedBody.categories;

            }

            if (validatedBody.subCategories) {
                data.subCategories = validatedBody.subCategories;
                delete validatedBody.subCategories;
            }

            if (validatedBody.location && validatedBody.location.address && validatedBody.location.longitude && validatedBody.location.latitude) {
                validatedBody.geoLocation = { type: 'Point', coordinates: [validatedBody.location.longitude, validatedBody.location.latitude] }
                validatedBody.address = validatedBody.location.address
            }
            if (validatedBody.email) {
                validatedBody.email = (validatedBody.email.trim()).toLowerCase();
            }
            if (req.files && req.files['image'] && (req.files['image'].length > 0)) {
                validatedBody.image = fieldhandleImg(req, { attributeName: 'image', isUpdate: false })[0];
            }
            if (req.files && req.files['commercialRecord'] && (req.files['commercialRecord'].length > 0)) {
                validatedBody.commercialRecord = fieldhandleImg(req, { attributeName: 'commercialRecord', isUpdate: false })[0];
            }
            if (req.files && req.files['taxCard'] && (req.files['taxCard'].length > 0)) {
                validatedBody.taxCard = fieldhandleImg(req, { attributeName: 'taxCard', isUpdate: false })[0];
            }

            if ((validatedBody.slider) && req.files && req.files['newSlider'] && (req.files['newSlider'].length > 0)) {
                let newSlider = fieldhandleImg(req, { attributeName: 'newSlider', isUpdate: false });
                validatedBody.slider = validatedBody.slider.concat(newSlider);
            }
            else if (req.files && req.files['newSlider'] && (req.files['newSlider'].length > 0)) {
                validatedBody.slider = fieldhandleImg(req, { attributeName: 'newSlider', isUpdate: false });
            }

            if (validatedBody.newPassword) {

                if (validatedBody.currentPassword) {
                    if (bcrypt.compareSync(validatedBody.currentPassword, user.password)) {
                        const salt = bcrypt.genSaltSync();
                        var hash = await bcrypt.hash(validatedBody.newPassword, salt);
                        validatedBody.password = hash;
                        delete validatedBody.newPassword;
                        delete validatedBody.currentPassword;
                        user = await User.findOneAndUpdate({ deleted: false, _id: userId }, {...validatedBody,...data}, { new: true }).populate(populateQuery);
                        res.status(200).send(user);
                    } else {
                        return next(new ApiError(403, i18n.__('currentPasswordInvalid')))
                    }
                } else {
                    return res.status(400).send({
                        error: [{
                            location: 'body',
                            param: 'currentPassword',
                            msg: i18n.__('CurrentPasswordRequired')
                        }]
                    });
                }
            } else {
                user = await User.findOneAndUpdate({ deleted: false, _id: userId }, {...validatedBody,...data}, { new: true }).populate(populateQuery);
                res.status(200).send(user);
            }

        } catch (error) {
            next(error);
        }
    },

    validateUpdatedPassword() {
        let validation = [
            body('newPassword').not().isEmpty().withMessage(() => { return i18n.__('newPasswordRequired') }),
            body('currentPassword').not().isEmpty().withMessage(() => { return i18n.__('CurrentPasswordRequired') }),
        ];
        return validation;
    },
    async updatePasswordFromProfile(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            let user = req.user;
            if (bcrypt.compareSync(validatedBody.currentPassword, user.password)) {
                const salt = bcrypt.genSaltSync();
                var hash = await bcrypt.hash(validatedBody.newPassword, salt);
                validatedBody.password = hash;
                delete validatedBody.newPassword;
                delete validatedBody.currentPassword;
                user = await User.findOneAndUpdate({ deleted: false, _id: user.id }, validatedBody, { new: true }).populate(populateQuery);
                res.status(200).send({ user: user });
            } else {
                return next(new ApiError(403, i18n.__('currentPasswordInvalid')))
            }
        } catch (error) {
            next(error);
        }
    },

    /////////////////////////////////////////////////////////////////////////////////////////// forget password by email
    validateForgetPassword() {
        return [
            body('email').not().isEmpty().withMessage(() => { return i18n.__('emailRequired') }),
            body('type').not().isEmpty().withMessage(() => { return i18n.__('typeIsRequired') })
                .isIn(['ADMIN','SUB_ADMIN','CLIENT','VISITOR','MARKET','TRADER','DRIVER']).withMessage(() => { return i18n.__('userTypeWrong') }),
        ];
    },
    async forgetPassword(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            var email = validatedBody.email;
            email = (email.trim()).toLowerCase();

            var user = await User.findOne({ email: email, deleted: false, type: validatedBody.type });
            if (!user)
                return next(new ApiError(403, i18n.__('EmailNotFound')));
            var randomCode = '' + (Math.floor(1000 + Math.random() * 9000));
            var code = new ConfirmationCode({ email: email, code: randomCode });
            await code.save();
            var text = 'Enter This Code To Change Your Password ' + randomCode + ' .';
            await sendEmail(email, text);

            res.status(200).send(i18n.__('checkYourMail'));
        } catch (err) {
            next(err);
        }
    },

    validateConfirmCode() {
        return [
            body('email').not().isEmpty().withMessage(() => { return i18n.__('emailRequired') }),
            body('code').not().isEmpty().withMessage(() => { return i18n.__('codeRequired') }),
            body('type').not().isEmpty().withMessage(() => { return i18n.__('typeIsRequired') })
                .isIn(['ADMIN','SUB_ADMIN','CLIENT','VISITOR','MARKET','TRADER','DRIVER']).withMessage(() => { return i18n.__('userTypeWrong') }),
        ];
    },
    async verifyForgetPasswordCode(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            var email = validatedBody.email;
            var code = validatedBody.code;
            email = (email.trim()).toLowerCase();
            var user = await ConfirmationCode.findOne({ code, email });

            if (user) {
                await ConfirmationCode.remove({ code, email });
                res.status(200).send(i18n.__('CodeSuccess'));
            } else
                res.status(400).send(i18n.__('CodeFail'));
        } catch (err) {
            next(err);
        }
    },

    async updatePassword(req, res, next) {
        try {
            let validatedBody = checkValidations(req)
            validatedBody.email = (validatedBody.email.trim()).toLowerCase();
            const salt = bcrypt.genSaltSync();
            var hash = await bcrypt.hash(validatedBody.newPassword, salt);
            var password = hash;
            var user = await User.findOneAndUpdate({ email: validatedBody.email, deleted: false, type: validatedBody.type }, { password: password }, { new: true }).populate(populateQuery);
            if (user) {
                res.status(200).send({
                    user,
                    token: generateToken(user.id)
                });
            } else
                res.status(404).send(i18n.__('EmailNotFound'));
        } catch (err) {
            next(err);
        }
    },
    ////////////////////////////////////////////////////////////////////////// forget password by phone
    validateForgetPasswordByPhone() {
        return [
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
    },
    async forgetPasswordByPhone(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            var phone = validatedBody.phone;
            phone = phone.trim()
            var user = await User.findOne({ phone: phone, deleted: false });
            if (!user)
                return next(new ApiError(403, i18n.__('userNotFound')));
            // twilioSend(config.countryCode  + phone, user.language || 'ar');
            res.status(200).send(i18n.__('checkYourPhone'));
        } catch (err) {
            next(err);
        }
    },

    validateVerifyForgetPasswordByPhone() {
        return [
            body('code').not().isEmpty().withMessage(() => { return i18n.__('codeRequired') }),
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
    },
    async verifyForgetPasswordByPhone(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            var phone = validatedBody.phone;
            phone = phone.trim()
            var user = await User.findOne({ phone: phone, deleted: false });
            if (!user)
                return next(new ApiError(403, i18n.__('userNotFound')));
            // twilioVerify( /*user.countryCode*/ config.countryCode  + phone, validatedBody.code, user, res, next);
            // twilioVerify('+' + user.countryCode + phone, validatedBody.code, user, res, next);
        } catch (err) {
            next(err);
        }
    },

    validateUpdatePasswordByPhone() {
        return [
            body('password').not().isEmpty().withMessage(() => { return i18n.__('passwordRequired ') }),
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
    },
    async updatePasswordByPhone(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            validatedBody.phone = validatedBody.phone.trim();
            let user = await User.findOne({ deleted: false, phone: validatedBody.phone });
            if (!user) {
                return next(new ApiError(403, i18n.__('userNotFound')));
            }
            user.password = validatedBody.password;
            await user.save();
            res.status(200).send({   user,   token: generateToken(user.id)  });
        } catch (err) {
            next(err);
        }
    },
    ////////////////////////////////////////////////////////////////////////////////////////// reset password

    validateResetPassword() {
        return [
            body('email').not().isEmpty().withMessage(() => { return i18n.__('emailRequired') }),
            body('newPassword').not().isEmpty().withMessage(() => { return i18n.__('newPasswordRequired') }),
            body('type').not().isEmpty().withMessage(() => { return i18n.__('typeIsRequired') })
                .isIn(['ADMIN','SUB_ADMIN','CLIENT','VISITOR','MARKET','TRADER']).withMessage(() => { return i18n.__('userTypeWrong') }),
        ];
    },

    async resetPassword(req, res, next) {
        try {

            let validatedBody = checkValidations(req);
            let user = await checkUserExistByEmail(validatedBody.email);

            user.password = validatedBody.newPassword;

            await user.save();

            await reportController.create({ "ar": 'تغير الرقم السري لمستخدم ', "en": "Change Password" }, 'UPDATE', req.user.id);

            res.status(200).send();

        } catch (err) {
            next(err);
        }
    },

    //////////////////////////////////////////////////////////////////////////////////////////
    validateAddToken() {
        let validations = [
            body('token').not().isEmpty().withMessage(() => { return i18n.__('token is required') }),
            body('type').not().isEmpty().withMessage(() => { return i18n.__('type is required') })
                .isIn(['ios', 'android', 'web']).withMessage(() => { return i18n.__('wrong type') })
        ];
        return validations;
    },
    async addToken(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            let user = await checkExistThenGet(req.user.id, User, { deleted: false });
            let tokens = user.tokens;
            let found = false;
            for (let index = 0; index < tokens.length; index++) {
                if (tokens[index].token == validatedBody.token) {
                    found = true
                }
            }
            if (!found) {
                user.tokens.push(validatedBody);
                var q = {
                    token: validatedBody.token,
                    deleted: false
                }
                var doc = await Hash.findOne(q);
                if (doc) {
                    if (req.user.id != doc.user) {
                        var newdoc = await Hash.findOneAndUpdate(q, { user: req.user.id });
                        var newUser = await User.findByIdAndUpdate(doc.user, { $pull: { tokens: { token: validatedBody.token } } }, { new: true });
                    }
                } else {
                    await Hash.create({ token: validatedBody.token, user: req.user.id });
                }
                await user.save();
            }
            res.status(200).send({ user });
        } catch (err) {
            next(err);
        }
    },

    validateLogout() {
        return [
            body('token').not().isEmpty().withMessage('tokenRequired')
        ];
    },
    async logout(req, res, next) {
        try {
            let token = req.body.token;
            let user = await checkExistThenGet(req.user._id, User, { deleted: false });

            let tokens = [];
            for (let i = 0; i < user.tokens.length; i++) {
                if (user.tokens[i].token != token) {
                    tokens.push(user.tokens[i]);
                }
            }
            user.tokens = tokens;

            await user.save();
            res.status(200).send(await checkExistThenGet(req.user._id, User, { deleted: false }));
        } catch (err) {
            next(err)
        }
    },

    async userInformation(req, res, next) {
        try {
            let {userId,currentUser} = req.query;
            let user = await checkExistThenGet(userId, User, { deleted: false, populate: populateQuery });
            let rate;
            if (currentUser) {
                 await checkFollow([user],currentUser);
                 await checkinFavorites([user], currentUser);
                rate = await Rate.findOne({deleted: false,trader:userId,user:currentUser});
            }
            user = User.schema.methods.toJSONLocalizedOnly(user, i18n.getLocale());
            res.status(200).send({ user: user ,rate:rate});
        } catch (error) {
            next(error);
        }
    },
    async deleteAccount(req, res, next) {
        try {
            var user = await checkExistThenGet(req.user.id, User, { deleted: false });
            user.deleted = true;
            await user.save();
            await ConfirmationCode.deleteMany({ email: user.email });
            res.status(200).send('Deleted Successfully');
        } catch (error) {
            next(error);
        }
    },

    async openActiveChatHead(req, res, next) {
        try {
            let user = req.user;
            let newUser = await User.findByIdAndUpdate(user.id, { activeChatHead: true }, { new: true });
            res.status(200).send({ user: newUser });
        } catch (error) {
            next(error);
        }
    },

    async closeActiveChatHead(req, res, next) {
        try {
            let user = req.user;
            let newUser = await User.findByIdAndUpdate(user.id, { activeChatHead: false }, { new: true });
            res.status(200).send({ user: newUser });

        } catch (error) {
            next(error);
        }
    },

    validateDeleteUserAccount() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('userIdRequired') }),
        ];
        return validations;
    },
    async deleteUserAccount(req, res, next) {
        try {
            let userId = checkValidations(req).userId;
            var user = await checkExistThenGet(userId, User, { deleted: false });
            await ConfirmationCode.deleteMany({ email: user.email });
            user.deleted = true;
            await user.save();
            res.status(200).send('Deleted Successfully');
        } catch (error) {
            next(error);
        }
    },

    validateSocialMediaLogin() {
        let validations = [
            body('email').optional().not().isEmpty().withMessage(() => { return i18n.__('emailRequired') }),
            body('phone').optional().not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') }),
            body('name').not().isEmpty().withMessage(() => { return i18n.__('nameRequired') }),
            body('image').optional().not().isEmpty().withMessage(() => { return i18n.__('imageRequired') }),
            body('socialId').not().isEmpty().withMessage(() => { return i18n.__('socialIdRequired') }),
            body('socialMediaType').not().isEmpty().withMessage(() => { return i18n.__('socialMediaTypeRequired') }).isIn(['FACEBOOK', 'TWITTER', 'INSTAGRAM', 'GOOGLE', 'APPLE']).withMessage(() => { return i18n.__('socialMediaTypeWrong') })
        ];
        return validations;
    },
    async socialMedialLogin(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            let query = { deleted: false, type: 'CLIENT', socialId: validatedBody.socialId };

            // if (validatedBody.email) {
            //     validatedBody.email = (validatedBody.email.trim()).toLowerCase();
            //     query.email = validatedBody.email;
            // }
            let user = await User.findOne(query);
            if (user) {
                res.status(200).send({ user, token: generateToken(user.id) });
            }
            else {
                let createdUser = await User.create(validatedBody);
                res.status(200).send({ user: createdUser, token: generateToken(createdUser.id) });
            }
        } catch (err) {
            next(err);
        }
    },

    validateVisitorSignUp() {
        let validations = [
            body('token').optional().not().isEmpty().withMessage(() => { return i18n.__('token is required') }),
            body('type').optional().not().isEmpty().withMessage(() => { return i18n.__('type is required') })
                .isIn(['ios', 'android', 'web']).withMessage(() => { return i18n.__('wrong type') })
        ];
        return validations;
    },

    async visitorSignUp(req, res, next) {
        try {
            const validatedBody = checkValidations(req);

            let oldUser ;
            if (!oldUser) {
                let tokens = [];
                if (validatedBody.token && validatedBody.type ) {
                    tokens = [{token:validatedBody.token, type: validatedBody.type}] ;
                }
                oldUser = await User.create({
                    tokens: tokens,
                    type : 'VISITOR'
                });
            }
            res.status(200).send({ user: oldUser, token: generateToken(oldUser.id) })
        } catch (error) {
            next(error);
        }
    },

    validateIncreaseViews() {
        let validations = [
            body('userId').not().isEmpty().withMessage(() => { return i18n.__('userIdRequired') }).custom(async (value,{req}) => {
                req.trader = await checkExistThenGet(value, User, { deleted: false, type: 'TRADER' })
            })
        ];
        return validations;
    },
    async increaseViews(req, res, next) {
        try {
            let validatedBody = checkValidations(req);
            let trader = req.trader;
            trader.views = trader.views + 1;
            await trader.save();
            res.status(200).send('Done');
        } catch (error) {
            next(error);
        }
    },

    async traderGetStatistics(req, res, next) {
        try {
            let user = req.user;
            let followers = createPromise(Follow.count({deleted: false,trader: user.id}));
            let numberOfOrders = createPromise(Order.count({ deleted: false, traders: { $elemMatch: { trader: user.id } } }));
            let waitingOrders = createPromise(Order.count({ deleted: false, traders: { $elemMatch: { trader: user.id  } },'traders.$.status':'WAITING' }));
            let acceptedOrders = createPromise(Order.count({ deleted: false, traders: { $elemMatch: { trader: user.id  } },'traders.$.status':'ACCEPTED' }));
            let rejectedOrders = createPromise(Order.count({ deleted: false, traders: { $elemMatch: { trader: user.id  } } ,'traders.$.status':'REJECTED'}));

            let counts = [followers,numberOfOrders,waitingOrders,acceptedOrders,rejectedOrders];
            let result = await Promise.all(counts);

            res.status(200).send({
                views: user.views,
                followers: result[0],
                numberOfOrders: result[1],
                waitingOrders: result[2],
                acceptedOrders: result[3],
                rejectedOrders: result[4],
            });
        } catch (error) {
            next(error);
        }
    },
    async uploadImage(req, res, next) {
        try {
            let Image = await handleImg(req, { attributeName: 'image', isUpdate: false });
            res.status(200).send({ link: Image });
        } catch (error) {
            next(error);
        }
    },


    /////////////////////////////////////////////////////////////////////////////////////////
    validateDriverAddTrader() {
        return [
            body('image').not().isEmpty().withMessage(() => { return i18n.__('imageRequired') }),
            body('name').not().isEmpty().withMessage(() => { return i18n.__('nameRequired') }),
            body('email').optional().trim().not().isEmpty().withMessage(() => { return i18n.__('emailRequired') })
                .isEmail().withMessage(() => { return i18n.__('EmailNotValid') })
                .custom(async (value, { req }) => {
                    value = (value.trim()).toLowerCase();
                    let userQuery = { email: value, deleted: false };
                    if (await User.findOne(userQuery))
                        throw new Error(i18n.__('emailDuplicated'));
                    else
                        return true;
                }),
            body('password').not().isEmpty().withMessage(() => { return i18n.__('passwordRequired') }),
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') })
                .custom(async (value, { req }) => {
                    value = (value.trim()).toLowerCase();
                    let userQuery = { phone: value, deleted: false };
                    if (await User.findOne(userQuery))
                        throw new Error(i18n.__('phoneIsDuplicated'));
                    else
                        return true;
                }),
            body('countryCode').not().isEmpty().withMessage(() => { return i18n.__('countryCodeRequired') }),
            body('countryKey').not().isEmpty().withMessage(() => { return i18n.__('countryKeyRequired') }),
            body('shopType').not().isEmpty().withMessage(() => { return i18n.__('shopTypeRequired') })
                .isIn(['RETAIL', 'WHOLESALE', 'ALL']).withMessage(() => { return i18n.__('invalidShopType') }),

            body('region').not().isEmpty().withMessage(() => { return i18n.__('regionRequired') }).custom(async (val, { req }) => {
                await checkExist(val, Region, { deleted: false });
                return true;
            }),
            body('market').optional().not().isEmpty().withMessage(() => { return i18n.__('marketRequired') }).custom(async (val, { req }) => {
                await checkExist(val, User, { deleted: false, type: 'MARKET' });
                return true;
            }),
            body('storeEmployees').optional().not().isEmpty().withMessage(() => { return i18n.__('storeEmployeesRequired') }).isArray().withMessage('must be an array'),
            // body('workTimes').optional().not().isEmpty().withMessage(() => { return i18n.__('workTimesRequired') }),
            body('workDays').optional().isArray().withMessage(() => { return i18n.__('invalidWorkDays') }),
            body('workPeriods').optional().isArray().withMessage(() => { return i18n.__('invalidWorkPeriods') }),
            body('workPeriods.*.from').optional().not().isEmpty().withMessage(() => { return i18n.__('fromRequired') }),
            body('workPeriods.*.to').optional().not().isEmpty().withMessage(() => { return i18n.__('toRequired') }),

            body('subCategories').optional().isArray().withMessage(() => { return i18n.__('subCategoriesRequired') }),
            body('subCategories.*').optional().not().isEmpty().withMessage(() => { return i18n.__('subCategoryRequired') })
            .custom(async(value)=>{
                await checkExist(value,SubCategory,{deleted:false});
                return true;
            }),
            body('slider').optional().isArray().withMessage(() => { return i18n.__('sliderRequired') }),
            body('searchKeys').optional().isArray().withMessage(() => { return i18n.__('searchKeysRequired') }),
            body('phones').optional().not().isEmpty().withMessage(() => { return i18n.__('phonesRequired') })
            .isArray().withMessage(() => { return i18n.__('invalidPhonesValue') }),
            body('socialLinks').optional().not().isEmpty().withMessage(() => { return i18n.__('socialLinksRequired') })
                    .isArray().withMessage(() => { return i18n.__('socialLinksValueError') }),
            body('socialLinks.*.key').optional().not().isEmpty().withMessage(() => { return i18n.__('socialLinksRequired') }),
            body('socialLinks.*.value').optional().not().isEmpty().withMessage(() => { return i18n.__('socialLinksRequired') }),

            body('streetNumber').optional().not().isEmpty().withMessage(() => { return i18n.__('streetNumberRequired') }),
            body('location.address').optional().not().isEmpty().withMessage(() => { return i18n.__('addressRequired') }),
            body('location.longitude').optional().not().isEmpty().withMessage(() => { return i18n.__('longitudeRequired') }),
            body('location.latitude').optional().not().isEmpty().withMessage(() => { return i18n.__('latitudeRequired') }),


        ]
    },

    async addTrader(req, res, next) {
        try {
            let user = req.user;
            if (user.type != 'DRIVER') {
                return next(new ApiError(401, 'غير مسموح'))
            }
            let validatedBody = checkValidations(req);
            validatedBody.driver = user.id;
            validatedBody.type = 'TRADER';
            if (validatedBody.email) {
                validatedBody.email = (validatedBody.email.trim()).toLowerCase();

            }

            // if (req.files && req.files['image'] && (req.files['image'].length > 0)) {
            //     validatedBody.image = fieldhandleImg(req, { attributeName: 'image', isUpdate: false })[0];
            // }
            // if (req.files && req.files['commercialRecord'] && (req.files['commercialRecord'].length > 0)) {
            //     validatedBody.commercialRecord = fieldhandleImg(req, { attributeName: 'commercialRecord', isUpdate: false })[0];
            // }
            // if (req.files && req.files['taxCard'] && (req.files['taxCard'].length > 0)) {
            //     validatedBody.taxCard = fieldhandleImg(req, { attributeName: 'taxCard', isUpdate: false })[0];
            // }
            let subscription = await Subscription.findOne({deleted: false,type:'FREE'});
            if(subscription) validatedBody.subscription = subscription.id;
            validatedBody.phoneVerified = true;

            if (validatedBody.location && validatedBody.location.address && validatedBody.location.longitude && validatedBody.location.latitude) {
                validatedBody.geoLocation = { type: 'Point', coordinates: [validatedBody.location.longitude, validatedBody.location.latitude] }
                validatedBody.address = validatedBody.location.address
            }
            let createdUser = await User.create(validatedBody);
            createdUser = await User.schema.methods.toJSONLocalizedOnly(createdUser, i18n.getLocale());
            res.status(200).send({ user: createdUser });
        } catch (error) {
            next(error)
        }
    },

    validateDriverAddMarket() {
        return [
            body('categories').optional().isArray().withMessage(() => { return i18n.__('categoriesRequired') }),
            body('categories.*.en').optional().not().isEmpty().withMessage(() => { return i18n.__('categoryRequired') }),
            body('categories.*.ar').optional().not().isEmpty().withMessage(() => { return i18n.__('categoryRequired') }),

            body('name').optional().not().isEmpty().withMessage(() => { return i18n.__('nameRequired') }),
            body('username.ar').optional().not().isEmpty().withMessage(() => { return i18n.__('nameRequired') }),
            body('username.en').optional().not().isEmpty().withMessage(() => { return i18n.__('nameRequired') }),
            body('email').optional().trim().not().isEmpty().withMessage(() => { return i18n.__('emailRequired') })
                .isEmail().withMessage(() => { return i18n.__('EmailNotValid') })
                .custom(async (value, { req }) => {
                    value = (value.trim()).toLowerCase();
                    let userQuery = { email: value, deleted: false };
                    if (await User.findOne(userQuery))
                        throw new Error(i18n.__('emailDuplicated'));
                    else
                        return true;
                }),
            body('password').not().isEmpty().withMessage(() => { return i18n.__('passwordRequired') }),
            body('phone').not().isEmpty().withMessage(() => { return i18n.__('PhoneIsRequired') })
                .custom(async (value, { req }) => {
                    value = (value.trim()).toLowerCase();
                    let userQuery = { phone: value, deleted: false };
                    if (await User.findOne(userQuery))
                        throw new Error(i18n.__('phoneIsDuplicated'));
                    else
                        return true;
                }),
            body('countryCode').not().isEmpty().withMessage(() => { return i18n.__('countryCodeRequired') }),
            body('countryKey').not().isEmpty().withMessage(() => { return i18n.__('countryKeyRequired') }),
            body('slider').not().isEmpty().isArray().withMessage(() => { return i18n.__('sliderRequired') }),
            body('region').not().isEmpty().withMessage(() => { return i18n.__('regionRequired') }).custom(async (val, { req }) => {
                await checkExist(val, Region, { deleted: false });
                return true;
            }),
            body('location.address').optional().not().isEmpty().withMessage(() => { return i18n.__('addressRequired') }),
            body('location.longitude').optional().not().isEmpty().withMessage(() => { return i18n.__('longitudeRequired') }),
            body('location.latitude').optional().not().isEmpty().withMessage(() => { return i18n.__('latitudeRequired') }),
            body('shopType').not().isEmpty().withMessage(() => { return i18n.__('shopTypeRequired') })
                .isIn(['RETAIL', 'WHOLESALE', 'ALL']).withMessage(() => { return i18n.__('invalidShopType') }),
            body('image').not().isEmpty().withMessage(() => { return i18n.__('imageRequired') }),

        ]
    },

    async addMarket(req, res, next) {
        try {
            let user = req.user;
            // if (user.type != 'DRIVER') {
            //     return next(new ApiError(401, 'غير مسموح'))
            // }
            let validatedBody = checkValidations(req);
            validatedBody.driver = user.id;
            validatedBody.type = 'MARKET';
            if (validatedBody.email) {
                validatedBody.email = (validatedBody.email.trim()).toLowerCase();
            }

            if (req.file) {
                let image = handleImg(req, { attributeName: 'image', isUpdate: false });
                validatedBody.image = image;
            }
            validatedBody.phoneVerified = true;
            if (validatedBody.location && validatedBody.location.address && validatedBody.location.longitude && validatedBody.location.latitude) {
                validatedBody.geoLocation = { type: 'Point', coordinates: [validatedBody.location.longitude, validatedBody.location.latitude] }
                validatedBody.address = validatedBody.location.address
            }
            let createdUser = await User.create(validatedBody);
            createdUser = await User.schema.methods.toJSONLocalizedOnly(createdUser, i18n.getLocale());
            res.status(200).send({ user: createdUser });
        } catch (error) {
            next(error)
        }
    },
};
