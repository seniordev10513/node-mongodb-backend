import { body } from 'express-validator/check';
import { checkValidations } from '../shared.controller/shared.controller';
import i18n from 'i18n'
import trucksModel from '../../models/trucks.model/trucks.model'
export default {
    async findAll(req, res, next) {
        try {
            let query = {}
            let Trucks = await trucksModel.find(query)
            res.status(200).send(Trucks)
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    validateAddTruck() {
        let validations = [
            body('name').not().isEmpty().withMessage(() => { return i18n.__('phoneRequired') }),
        ];
        return validations;
    },
    async addTruck(req, res, next) {
        try {
            const validatedBody = checkValidations(req);
            let query = {...validatedBody};
            let newTruck = await trucksModel.create(query)
            res.status(200).send(newTruck)
        } catch (err) {
            console.log(err);
            next(err);
        }
    },

};
