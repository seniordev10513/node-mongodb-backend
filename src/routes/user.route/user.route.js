import express from 'express';
// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
import userController from '../../controllers/user.controller/user.controller';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';

const router = express.Router();

let images = [{ name: 'image', maxCount: 1 }, { name: 'commercialRecord', maxCount: 1 }, { name: 'taxCard', maxCount: 1 }, { name: 'newSlider', maxCount: 15 }]

//router.route('/activate-phone').put(requireAuth,userController.validateResendCode(),userController.sendActivateCode)
//router.route('/confirm-activate-phone').put(requireAuth,userController.validateVerifyPhone(),userController.confirmActivateCode)
//router.route('/addTrader')
//.post(multerSaveTo('users').fields([{ name: 'image', maxCount: 1 }, { name: 'commercialRecord', maxCount: 1 }, { name: 'taxCard', maxCount: 1 }]),
//parseObject([ 'workPeriods', 'workDays' , 'location', 'username', 'socialLinks', 'phones', 'slider', 'searchKeys', 'subCategories', 'storeEmployees', 'region']),
//        requireAuth, userController.validateDriverAddTrader(), userController.addTrader)

// router.route('/addMarket')
//     .post(multerSaveTo('users').single('image'),
//         parseObject(['categories','location', 'username', 'socialLinks', 'phones', 'slider', 'searchKeys', 'subCategories', 'storeEmployees', 'region']),
//         requireAuth, userController.validateDriverAddMarket(), userController.addMarket)

// router.route('/increaseViews').post(userController.validateIncreaseViews(), userController.increaseViews)
// router.route('/traderStatistics').get(requireAuth, userController.traderGetStatistics)

// router.route('/user/openActiveChatHead').put(requireAuth, userController.openActiveChatHead)
// router.route('/user/closeActiveChatHead').put(requireAuth, userController.closeActiveChatHead)

//router.route('/visitor/signup').post(userController.validateVisitorSignUp(), userController.visitorSignUp)
router.route('/signup')
    //.post(multerSaveTo('users').fields(images), parseObject(['subCategories'])  , userController.validateUserCreateBody(), userController.userSignUp);
    .post( userController.validateUserCreateBody(), userController.userSignUp);


router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
router.post( '/refuseCar',userController.validateRefuseCar(), userController.refuseCar);

router.post( '/address',userController.validateAddAddress(), userController.addAddress);
// router.post( '/location',userController.validateAddAddress(), userController.addAddress);
router.post( '/location',userController.validateUsersetLocation(), userController.setLocation);
router.get( '/getUserInfo', userController.getUserInfo);
router.put( '/updateToken', userController.validateUpdateToken(), userController.updateToken);

// router.route('/socialMedia')
//     .post(userController.validateSocialMediaLogin(), userController.socialMedialLogin);

// router.route('/deleteAccount').delete(requireAuth, userController.validateDeleteUserAccount(), userController.deleteUserAccount);

router.post('/verify-device', userController.validateDeviceId(), userController.CheckDeviceId);
router.post('/signin', userController.validateUserSignin(), userController.signIn);
router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)

// router.get('/allUsers', userController.findAll);

// router.get('/userInfo', userController.userInformation)

// router.route('/addToken').post(requireAuth, userController.validateAddToken(), userController.addToken);

// router.route('/logout').post(requireAuth, userController.validateLogout(), userController.logout);


// router.post('/checkExistPhone', userController.validateCheckPhone(), userController.checkExistPhone);
// router.post('/checkExistEmail', userController.validateCheckEmail(), userController.checkExistEmail);


// router.put('/user/updateInfo',
//     requireAuth,
//     multerSaveTo('users').fields(images),
//     parseObject(['categories','workPeriods', 'workDays' , 'location', 'socialLinks', 'phones', 'slider', 'searchKeys', 'subCategories', 'storeEmployees', 'region']),
//     userController.validateUserUpdate(true),
//     userController.updateInfo);

// router.put('/user/changePassword',
//     requireAuth,
//     userController.validateUpdatedPassword(),
//     userController.updatePasswordFromProfile);


// router.post('/reset-password',
//     userController.validateResetPassword(),
//     userController.resetPassword);

// // forgetpassword by mail
// router.post('/forgetPassword', userController.validateForgetPassword(), userController.forgetPassword);
// router.put('/confirmationCode', userController.validateConfirmCode(), userController.verifyForgetPasswordCode);
// router.put('/confirmationchange', userController.validateResetPassword(), userController.updatePassword);

// // forgetpassword by phone number
// router.post('/phoneForgetPassword', userController.validateForgetPasswordByPhone(), userController.forgetPasswordByPhone);
// router.put('/phoneConfirmationCode', userController.validateVerifyForgetPasswordByPhone(), userController.verifyForgetPasswordByPhone);
// router.put('/phonePasswordChange', userController.validateUpdatePasswordByPhone(), userController.updatePasswordByPhone);

// router.route('/account').delete(requireAuth, userController.deleteAccount);
// router.post('/image', multerSaveTo('users').single('image'), userController.uploadImage)

export default router;
