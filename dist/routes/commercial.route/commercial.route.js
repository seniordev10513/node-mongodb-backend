"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _commercial = _interopRequireDefault(require("../../controllers/commercial.controller/commercial.controller"));

// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';
var router = _express["default"].Router();

router.route('/').get(_commercial["default"].getUserCommercial).post(_commercial["default"].validateAddCommercial(), _commercial["default"].addCommercial).put(_commercial["default"].validateUpdateCommercial(), _commercial["default"].UpdateCommercial);
router.route('/latest').get(_commercial["default"].latestUserCommercial);
router.get("/all", _commercial["default"].getAllCommercial);
router.put("/status", _commercial["default"].validateUpdateStateCommercial(), _commercial["default"].setStatusCommercial);
router.put("/cancel", _commercial["default"].cancelCommercial); // router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)

var _default = router;
exports["default"] = _default;