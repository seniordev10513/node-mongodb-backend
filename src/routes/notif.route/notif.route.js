import express from 'express';
import notifController from '../../controllers/notif.controller/notif.controller';

const router = express.Router();

router.route('/').get( notifController.getLastNotifications);
router.route('/markAsRead').put( notifController.markAsRead);
router.route('/delete').get(notifController.delete);


export default router;
