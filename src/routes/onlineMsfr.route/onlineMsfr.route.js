import express from 'express';
import { TaskRouterGrant } from 'twilio/lib/jwt/AccessToken';
// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
import onlineMsfrController from '../../controllers/onlineMsfr.controller/onlineMsfr.controller';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';

const router = express.Router();


router.route('/')
    .get( onlineMsfrController.getUseronlineMsfr)
    .post( onlineMsfrController.validateAddonlineMsfr(), onlineMsfrController.addonlineMsfr)
router.put("/cancel",onlineMsfrController.cancelonlineMsfr)
// router.put("/date",onlineMsfrController.validateupDateonlineMsfrdate(),onlineMsfrController.upDateonlineMsfrdate)
router.get("/all",onlineMsfrController.getAllonlineMsfr)
router.get("/trans",onlineMsfrController.getTransonlineMsfr)
// router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)
export default router;