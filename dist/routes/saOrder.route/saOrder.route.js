"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _saOrder = _interopRequireDefault(require("../../controllers/saOrder.controller/saOrder.controller"));

// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';
var router = _express["default"].Router();

router.route('/').get(_saOrder["default"].findAll)["delete"](_saOrder["default"].deletesaOrder).post(_saOrder["default"].validateAddsaOrder(), _saOrder["default"].addsaOrder);
router.route('/latest').get(_saOrder["default"].latestSaOrders);
router.put("/cancel", _saOrder["default"].setCancelOrderSA);
router.put("/book", _saOrder["default"].validateBookOrderSA(), _saOrder["default"].BookOrderSA);
router.put("/unbook", _saOrder["default"].validateunBookOrderSA(), _saOrder["default"].unBookOrderSA);
router.put("/status", _saOrder["default"].validateUpdateStateOrderSA(), _saOrder["default"].setStatusOrderSA);
router.put("/cost", _saOrder["default"].validateUpdatePriceOrderSA(), _saOrder["default"].setPriceOrderSA);
router.put("/accept", _saOrder["default"].validateAcceptPriceOrderSA(), _saOrder["default"].acceptPriceOrderSA);
router.put("/refuse", _saOrder["default"].validateRefusePriceOrderSA(), _saOrder["default"].refusePriceOrderSA); // router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)

var _default = router;
exports["default"] = _default;