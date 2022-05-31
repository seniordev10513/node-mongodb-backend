import express from 'express';
// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
import bloodController from '../../controllers/blood.controller/blood.controller';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';

const router = express.Router();


router.route('/')
    .get( bloodController.getBloods)
    .post( bloodController.validateAddBlood(), bloodController.addBlood)
router.put("/cancel",bloodController.setCancelBlood)
// router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)
export default router;