"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _AccessToken = require("twilio/lib/jwt/AccessToken");

var _onlineMsfr = _interopRequireDefault(require("../../controllers/onlineMsfr.controller/onlineMsfr.controller"));

// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';
var router = _express["default"].Router();

router.route('/').get(_onlineMsfr["default"].getUseronlineMsfr).post(_onlineMsfr["default"].validateAddonlineMsfr(), _onlineMsfr["default"].addonlineMsfr);
router.put("/cancel", _onlineMsfr["default"].cancelonlineMsfr); // router.put("/date",onlineMsfrController.validateupDateonlineMsfrdate(),onlineMsfrController.upDateonlineMsfrdate)

router.get("/all", _onlineMsfr["default"].getAllonlineMsfr);
router.get("/trans", _onlineMsfr["default"].getTransonlineMsfr); // router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)

var _default = router;
exports["default"] = _default;