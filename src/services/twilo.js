import { generateToken } from '../utils/token';
// import reportController from '../controllers/report.controller/report.controller'
import ApiError from '../helpers/ApiError';
import i18n from 'i18n';
import 'dotenv/config'

// import config from '../config';
// import ConfirmationCode from '../models/confirmationsCodes.model/confirmationscodes.model';
 // remove this after you've confirmed it working
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
let verifyServiceId = process.env.TWILIO_SERVICE_SID;

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);


let twilioSend = (number, ar = 'ar',res,next) => {
    console.log("TWL",number);
    try {
        client.verify.services(verifyServiceId)
            .verifications
            .create({ to: number, channel: 'sms', locale: ar })
            .then(verification => {
                res.status(200).send("send code successfuly")
                console.log('Twilio verification Sent');
            }).catch(error => {console.log("TWIL",error);next(new ApiError(400, 'فشل إرسال الكود'))});
    } catch (error) {
        next(new ApiError(400, 'فشل إرسال الكود'))
        console.log('error in twilio ==> ', error)
    }
}

let twilioVerify = (phone, code, user = {}, res, next,Data) => {
    try {
        client.verify.services(verifyServiceId)
            .verificationChecks
            .create({ to: phone, code: code })
            .then(async (verification_check) => {
                console.log("tdone!");
                if (verification_check.valid == true) {

                    if (Object.keys(user).length) {
                    //     // user.phoneVerified = true;
                    //     // await user.save();
                    //     // console.log('llllllllllllllllllllll');
                    //     // res.status(200).send({
                    //     //     user: user,
                    //     //     token: generateToken(user.id)
                    //     // });
                        res.status(200).send(user)
                    } else {
                    //     // let confirmCode = await ConfirmationCode.findOne({ phone: originPhone, type: 'PHONE' });
                    //     // if (confirmCode) {
                    //     //     confirmCode.verified = true;
                    //     //     await confirmCode.save();
                    //     //     res.status(200).send(i18n.__('CodeSuccess'));
                    //     // }else{
                    //     //     let confirmCode = new ConfirmationCode({ phone: originPhone, type: 'PHONE',verified:true });
                    //     //     await confirmCode.save();
                    //     //     res.status(200).send(i18n.__('CodeSuccess'));
                    //     // }
                    let User = await Data.Model.create(Data.query)
                    res.status(200).send(User)
                    }
                } else {

                    next(new ApiError(400, i18n.__('invalid_code')));
                }
            }).catch(error => {
                console.log(phone);
                console.log(error);
                next(new ApiError(400, i18n.__('expired_code')));
            })
    } catch (error) {
        next(error)
    }
}

export { twilioVerify, twilioSend };
