import express from 'express';
// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
import commercialController from '../../controllers/commercial.controller/commercial.controller';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';

const router = express.Router();


router.route('/')
.get( commercialController.getUserCommercial)
.post( commercialController.validateAddCommercial(), commercialController.addCommercial)
.put( commercialController.validateUpdateCommercial(), commercialController.UpdateCommercial)
router.route('/latest')
    .get( commercialController.latestUserCommercial)

router.get("/all",commercialController.getAllCommercial)
router.put("/status",commercialController.validateUpdateStateCommercial(),commercialController.setStatusCommercial)
router.put("/cancel",commercialController.cancelCommercial)

// router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)
export default router;