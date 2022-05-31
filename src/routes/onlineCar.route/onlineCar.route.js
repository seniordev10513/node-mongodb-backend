import express from 'express';
import { TaskRouterGrant } from 'twilio/lib/jwt/AccessToken';
// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
import onlineCarController from '../../controllers/onlineCar.controller/onlineCar.controller';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';

const router = express.Router();


router.route('/')
    .get( onlineCarController.getUseronlineCar)
    .post( onlineCarController.validateAddonlineCar(), onlineCarController.addonlineCar)
router.put("/cancel",onlineCarController.cancelonlineCar)
router.put("/close",onlineCarController.closeonlineCar)
router.put("/date",onlineCarController.validateupDateonlineCardate(),onlineCarController.upDateonlineCardate)
router.get("/all",onlineCarController.getAllonlineCar)
// router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)
export default router;