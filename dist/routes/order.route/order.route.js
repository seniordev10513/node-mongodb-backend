"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _AccessToken = require("twilio/lib/jwt/AccessToken");

var _order = _interopRequireDefault(require("../../controllers/order.controller/order.controller"));

// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';
var router = _express["default"].Router();

router.route('/').get(_order["default"].getUserorder).post(_order["default"].validateAddorder(), _order["default"].addorder);
router.put("/cancel", _order["default"].validateCancelorder(), _order["default"].cancelorder);
router.put("/accept", _order["default"].validateAcceptorder(), _order["default"].acceptorder);
router.put("/refuse", _order["default"].validateRefuseorder(), _order["default"].refuseorder); // router.put("/date",orderController.validateupDateorderdate(),orderController.upDateorderdate)
// router.get("/all",orderController.getAllorder)
// router.post( '/carSignUp',userController.validateCarCreateBody(), userController.carSignUp);
// router.get( '/getUserInfo',userController.validateUserInfo(), userController.getUserInfo);
// router.post('/signin', userController.validateUserSignin(), userController.signIn);
// router.post('/verify-signin', userController.validateVerifySign(), userController.verifySignIn);
// router.route('/verify-phone').put(userController.validateVerifyPhone(), userController.verifyPhone)
// router.route('/resend-code').post(userController.validateResendCode(), userController.resendCode)

var _default = router;
exports["default"] = _default;