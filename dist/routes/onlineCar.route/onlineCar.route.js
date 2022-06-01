"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _AccessToken = require("twilio/lib/jwt/AccessToken");

var _onlineCar = _interopRequireDefault(require("../../controllers/onlineCar.controller/onlineCar.controller"));

// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';
var router = _express["default"].Router();

router.route('/').get(_onlineCar["default"].getUseronlineCar).post(_onlineCar["default"].validateAddonlineCar(), _onlineCar["default"].addonlineCar);
router.put("/cancel", _onlineCar["default"].cancelonlineCar);
router.put("/close", _onlineCar["default"].closeonlineCar);
router.put("/date", _onlineCar["default"].validateupDateonlineCardate(), _onlineCar["default"].upDateonlineCardate);
router.get("/all", _onlineCar["default"].getAllonlineCar); // router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)

var _default = router;
exports["default"] = _default;