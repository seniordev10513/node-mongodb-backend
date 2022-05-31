var express = require('express');
var router = express.Router();
import categoryController from "../../controllers/category.controller/category.controller";
import { requireAuth } from '../../services/passport';
import { multerSaveTo } from '../../services/multer-service';
import { parseObject } from '../../controllers/shared.controller/shared.controller';

router.route('/')
    .get(categoryController.findAll)
    .post(requireAuth,
        categoryController.validateBody(), categoryController.create)


router.route('/:categoryId')
    .get(categoryController.findById)
    .put(requireAuth,
        categoryController.validateBody(true),
        categoryController.update)
    .delete(requireAuth, categoryController.delete)

export default router;