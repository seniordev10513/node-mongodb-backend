import express from 'express';
// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
import shohnatController from '../../controllers/shohnat.controller/shohnat.controller';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';

const router = express.Router();


router.route('/')
    .get( shohnatController.getUserShohnat)
    .post( shohnatController.validateAddShohnat(), shohnatController.addShohnat)
    .put( shohnatController.validateUpdateShohnat(), shohnatController.UpdateShohnat);
router.route('/latest')
    .get( shohnatController.latestShohnat)

router.get("/all",shohnatController.getAllShohnat)
router.get("/trans",shohnatController.getTransShohnat)
router.put("/cancel",shohnatController.setCancelShohnat)
router.put("/status",shohnatController.validateUpdateStateShohnat(),shohnatController.setStatusShohnat)
router.put("/cost",shohnatController.validateUpdatePriceShohnat(),shohnatController.setPriceShohnat)
router.put("/accept",shohnatController.validateAcceptPriceShohnat(),shohnatController.acceptPriceShohnat)
router.put("/refuse",shohnatController.validateRefusePriceShohnat(),shohnatController.refusePriceShohnat)
// router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)
export default router;