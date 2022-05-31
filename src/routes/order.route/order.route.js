import express from 'express';
import { TaskRouterGrant } from 'twilio/lib/jwt/AccessToken';
// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
import orderController from '../../controllers/order.controller/order.controller';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';

const router = express.Router();


router.route('/')
    .get( orderController.getUserorder)
    .post( orderController.validateAddorder(), orderController.addorder)
router.put("/cancel",orderController.validateCancelorder(),orderController.cancelorder)
router.put("/accept",orderController.validateAcceptorder(),orderController.acceptorder)
router.put("/refuse",orderController.validateRefuseorder(),orderController.refuseorder)
// router.put("/date",orderController.validateupDateorderdate(),orderController.upDateorderdate)
// router.get("/all",orderController.getAllorder)
// router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)
export default router;