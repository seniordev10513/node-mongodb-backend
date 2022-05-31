import bcrypt from 'bcryptjs';
import { body } from 'express-validator/check';
import { checkValidations,fieldhandleImg,handleImg } from '../shared.controller/shared.controller';
import ApiError from '../../helpers/ApiError';
import i18n from 'i18n'
// import config from '../../config';

// import PPlace from '../../models/places.model/places.model';
// import PPlace from '../../models/places.model/tt'
import tPlace from '../../models/places.model/tplace.model'
export default {
    async findAll(req, res, next) {
        try {
            let query = {}
            const {type} = req.query
            if(type)
            query.type = type
            let PPlace = await tPlace.find(query)
            res.status(200).send(PPlace)
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

};
