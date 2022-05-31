import express from 'express';
import chatController from '../../controllers/chat.controller/chat.controller';

const router = express.Router();

router.route('/recent').get( chatController.getRecentConversation)
router.route('/initiate').post(chatController.validateInitiate(),chatController.initiate);
router.route('/conversation').get(chatController.getConversationByRoomId);
router.route('/post').post(chatController.validatePostMessage(),chatController.postMessage);
router.route('/markMessageRead').post(chatController.markConversationReadByRoomId);

  //  .post( chatController.validate(), messageController.create);


export default router;
