import express from 'express';
const router = express.Router();

// import ruleRoute from './rule.route/rule.route';
// import assignRuleRoute from './assignRule.route/assignRule.route';
// // import contactUsRoute from './contactUs.route/contactUs.route';
// import adminRoute from './admin.route/admin.route';
import userRoute from './user.route/user.route';
import shohnatRoute from './shohnat.route/shohnat.route';
import commercialRoute from './commercial.route/commercial.route';
import onlineCarRoute from './onlineCar.route/onlineCar.route';
import orderRoute from './order.route/order.route';
import saOrderRoute from './saOrder.route/saOrder.route';
import adminRoute from './admin.route/admin.route';
import onlineMsfrRoute from './onlineMsfr.route/onlineMsfr.route';
import placeRoute from './places.route/places.route';
import truckRoute from './trucks.route/trucks.route';
import wordRoute from './words.route/words.route';
// import countryRouter from './country.route/country.route';
// import cityRouter from './city.route/city.route';
// import regionRouter from './region.route/region.route';
// import appIntroRouter from './appIntro.route/appIntro.route';
// // import imagesRoute from './images.route/images.route';
// // import tradeMarkRoute from './tradeMark.route/tradeMark.route';
// import categoryRouter from './category.route/category.route';
// import subcategoryRouter from './sub-category.route/sub-category.route';
// import companyRoute from './company.route/company.route';
// import productRoute from './product.route/product.route';
// import rateRoute from './rate.route/rate.route';
// import addressRoute from './address.route/address.route';
// import favoriteRoute from './favorites.route/favorites.route';
// import subscriptionRoute from './subscriptions.route/subscriptions.route';
// import askStoreRoute from './askStore.route/askStore.route';
// import followRoute from './follow.route/follow.route';
// import shippingCompanyRoute from './shippingCompany.route/shippingCompany.route';
// import dataReaderRouter from './data-uploader.route/data-uploader.route';

import notifRouter from './notif.route/notif.route';
// // import dashBoardRouter from './dashboard.route/dashboard.route';
// // import creditRouter from './credit.route/credit.route';
// import orderRouter from './order.route/order.route';
// import commentsRoute from './comments.route/comments.route';
// import sliderRoute from './slider.route/slider.route';
// import promocodeRoute from './promocode.route/promocode.route';
import chatRouter from './chatRoom.route/chatRoom.route';
import BloodRouter from './blood.route/blood.route';
import OfficeRouter from './office.route/office.route';
import ExchangeRouter from './exchange.route/exchange.route';
// import advertismentsRoute from './advertisment.route/advertisment.route';
// import accountActionsRoute from './account-actions.route/account-actions.route';
// import offersRouter from './offers.route/offers.route';
// // import paymentRouter from './payment.route/payment.route';

router.use('/',userRoute);
router.use('/shohnat',shohnatRoute);
router.use('/commercial',commercialRoute);
router.use('/onlineCar',onlineCarRoute);
router.use('/onlineMsfr',onlineMsfrRoute);
router.use('/place',placeRoute);
router.use('/truck',truckRoute);
router.use('/word',wordRoute);
router.use('/saOrder',saOrderRoute);
router.use('/order',orderRoute);
router.use('/admin',adminRoute);
router.use('/notif',notifRouter);
router.use('/chatRoom', chatRouter);
router.use('/blood', BloodRouter);
router.use('/office', OfficeRouter);
router.use('/exchange', ExchangeRouter);

// router.use('/admin',adminRoute);
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

export default router;
