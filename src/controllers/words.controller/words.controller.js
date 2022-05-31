import { body } from 'express-validator/check';
import { checkValidations } from '../shared.controller/shared.controller';
import i18n from 'i18n'
import wordsModel from '../../models/words.model/words.model'
export default {
    async findAll(req, res, next) {
        try {
            let query = {}
            let Trucks = await wordsModel.find(query)
            res.status(200).send(Trucks)
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    validateAddWord() {
        let validations = [
            body('text').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
            body('key').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async addWord(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {...validatedBody};
            let newTruck = await wordsModel.create(query)
            res.status(200).send(newTruck)
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

};
