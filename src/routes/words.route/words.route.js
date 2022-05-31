import express from 'express';
// import { requireAuth } from '../../services/passport';
// import { multerSaveTo } from '../../services/multer-service';
import wordsController from '../../controllers/words.controller/words.controller';
// import { parseObject } from '../../controllers/shared.controller/shared.controller';

const router = express.Router();


router.route('/')
    .get( wordsController.findAll)
    .post( wordsController.validateAddWord(),wordsController.addWord)
    
export default router;