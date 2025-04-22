const Joi = require('joi');

const promotionHistorySchema = Joi.object({
  uid: Joi.string().min(3).required().messages({
    'uid': 'incorrect value',
  }),
  codPromo: Joi.string().min(3).max(20).required().messages({
    'codPromo': 'incorrect value',
  }),
  discount: Joi.number().required().messages({
    'discount': 'incorrect value',
  }),
  typeService: Joi.string().max(20).required().messages({
    'typeService': 'incorrect value',
  }),
  typeUser: Joi.string().max(20).required().messages({
    'typeUser': 'incorrect value',
  }),
  idDriver: Joi.string().max(30).required().messages({
    'idDriver': 'incorrect value',
  }),
  idUser: Joi.string().max(30).required().messages({
    'idUser': 'incorrect value',
  }),
});

module.exports = promotionHistorySchema;