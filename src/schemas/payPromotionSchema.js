const Joi = require('joi');

const payPromotionSchema = Joi.object({
  idDriver: Joi.string().required().messages({
    'idDriver': 'incorrect value',
  }),
  paymentsList: Joi.array().required().messages({
    'paymentsList': 'incorrect value',
  }),
  paymentDate: Joi.string().required().messages({
    'paymentDate': 'incorrect value',
  }),
  paymentTransaction: Joi.string().required().messages({
    'paymentTransaction': 'incorrect value',
  }),
  userAdmin: Joi.string().required().messages({
    'userAdmin': 'incorrect value',
  }),
  paymentMethod: Joi.string().required().messages({
    'paymentMethod': 'incorrect value',
  }),
}).unknown(false);

module.exports = payPromotionSchema;
