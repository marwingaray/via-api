const Joi = require('joi');

const rechargeFromPromotionSchema = Joi.object({
  paymentsList: Joi.array().required().messages({
    'paymentsList': 'incorrect value',
  }),
});

module.exports = rechargeFromPromotionSchema;