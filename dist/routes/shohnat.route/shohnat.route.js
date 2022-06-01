"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _shohnat = _interopRequireDefault(require("../../controllers/shohnat.controller/shohnat.controller"));

// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';
var router = _express["default"].Router();

router.route('/').get(_shohnat["default"].getUserShohnat).post(_shohnat["default"].validateAddShohnat(), _shohnat["default"].addShohnat).put(_shohnat["default"].validateUpdateShohnat(), _shohnat["default"].UpdateShohnat);
router.route('/latest').get(_shohnat["default"].latestShohnat);
router.get("/all", _shohnat["default"].getAllShohnat);
router.get("/trans", _shohnat["default"].getTransShohnat);
router.put("/cancel", _shohnat["default"].setCancelShohnat);
router.put("/status", _shohnat["default"].validateUpdateStateShohnat(), _shohnat["default"].setStatusShohnat);
router.put("/cost", _shohnat["default"].validateUpdatePriceShohnat(), _shohnat["default"].setPriceShohnat);
router.put("/accept", _shohnat["default"].validateAcceptPriceShohnat(), _shohnat["default"].acceptPriceShohnat);
router.put("/refuse", _shohnat["default"].validateRefusePriceShohnat(), _shohnat["default"].refusePriceShohnat); // router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)

var _default = router;
exports["default"] = _default;