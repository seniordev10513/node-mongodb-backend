import express from 'express';
// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
import saOrderController from '../../controllers/saOrder.controller/saOrder.controller';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';

const router = express.Router();


router.route('/')
    .get( saOrderController.findAll)
    .delete( saOrderController.deletesaOrder)
    .post( saOrderController.validateAddsaOrder(),saOrderController.addsaOrder);
router.route('/latest')
    .get( saOrderController.latestSaOrders)
router.put("/cancel",saOrderController.setCancelOrderSA)
router.put("/book",saOrderController.validateBookOrderSA(),saOrderController.BookOrderSA)
router.put("/unbook",saOrderController.validateunBookOrderSA(),saOrderController.unBookOrderSA)
router.put("/status",saOrderController.validateUpdateStateOrderSA(),saOrderController.setStatusOrderSA)
router.put("/cost",saOrderController.validateUpdatePriceOrderSA(),saOrderController.setPriceOrderSA)
router.put("/accept",saOrderController.validateAcceptPriceOrderSA(),saOrderController.acceptPriceOrderSA)
router.put("/refuse",saOrderController.validateRefusePriceOrderSA(),saOrderController.refusePriceOrderSA)
// router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)
export default router;