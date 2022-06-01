"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _user = _interopRequireDefault(require("./user.route/user.route"));

var _shohnat = _interopRequireDefault(require("./shohnat.route/shohnat.route"));

var _commercial = _interopRequireDefault(require("./commercial.route/commercial.route"));

var _onlineCar = _interopRequireDefault(require("./onlineCar.route/onlineCar.route"));

var _order = _interopRequireDefault(require("./order.route/order.route"));

var _saOrder = _interopRequireDefault(require("./saOrder.route/saOrder.route"));

var _admin = _interopRequireDefault(require("./admin.route/admin.route"));

var _onlineMsfr = _interopRequireDefault(require("./onlineMsfr.route/onlineMsfr.route"));

var _places = _interopRequireDefault(require("./places.route/places.route"));

var _trucks = _interopRequireDefault(require("./trucks.route/trucks.route"));

var _words = _interopRequireDefault(require("./words.route/words.route"));

var _notif = _interopRequireDefault(require("./notif.route/notif.route"));

var _chatRoom = _interopRequireDefault(require("./chatRoom.route/chatRoom.route"));

var _blood = _interopRequireDefault(require("./blood.route/blood.route"));

var _office = _interopRequireDefault(require("./office.route/office.route"));

var _exchange = _interopRequireDefault(require("./exchange.route/exchange.route"));

var router = _express["default"].Router(); // import ruleRoute from './rule.route/rule.route';
// import assignRuleRoute from './assignRule.route/assignRule.route';
// // import contactUsRoute from './contactUs.route/contactUs.route';
// import adminRoute from './admin.route/admin.route';


// import advertismentsRoute from './advertisment.route/advertisment.route';
// import accountActionsRoute from './account-actions.route/account-actions.route';
// import offersRouter from './offers.route/offers.route';
// // import paymentRouter from './payment.route/payment.route';
router.use('/', _user["default"]);
router.use('/shohnat', _shohnat["default"]);
router.use('/commercial', _commercial["default"]);
router.use('/onlineCar', _onlineCar["default"]);
router.use('/onlineMsfr', _onlineMsfr["default"]);
router.use('/place', _places["default"]);
router.use('/truck', _trucks["default"]);
router.use('/word', _words["default"]);
router.use('/saOrder', _saOrder["default"]);
router.use('/order', _order["default"]);
router.use('/admin', _admin["default"]);
router.use('/notif', _notif["default"]);
router.use('/chatRoom', _chatRoom["default"]);
router.use('/blood', _blood["default"]);
router.use('/office', _office["default"]);
router.use('/exchange', _exchange["default"]); // router.use('/admin',adminRoute);
// router.use('/country',countryRouter)
// router.use('/city',cityRouter)
// router.use('/region',regionRouter)
// router.use('/companies',companyRoute);
// router.use('/appIntro',appIntroRouter);
// router.use('/rules',ruleRoute);
// router.use('/assigRule',assignRuleRoute);
// // router.use('/contactUs',contactUsRoute);
// // router.use('/images',imagesRoute);
// router.use('/category',categoryRouter)
// router.use('/sub-category',subcategoryRouter)
// router.use('/product',productRoute);
// router.use('/rate',rateRoute);
// router.use('/address',addressRoute);
// router.use('/favorites',favoriteRoute);
// router.use('/subscription',subscriptionRoute)
// router.use('/askStore',askStoreRoute)
// router.use('/follow',followRoute)
// router.use('/shippingCompany',shippingCompanyRoute);
// router.use('/comments',commentsRoute);
// router.use('/slider',sliderRoute);
// router.use('/promocode',promocodeRoute)
// router.use('/notif',notifRouter);
// router.use('/order', orderRouter);
// router.use('/advertisments',advertismentsRoute);
// router.use('/account-actions',accountActionsRoute);
// router.use('/offers',offersRouter);
// router.use('/data-reader',dataReaderRouter);
// ---
// // router.use('/dashboard',dashBoardRouter);
// // // router.use('/credit', creditRouter)
// // router.use('/payment',paymentRouter);

var _default = router;
exports["default"] = _default;