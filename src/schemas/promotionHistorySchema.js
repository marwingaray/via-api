const Joi = require('joi');

const promotionHistorySchema = Joi.object({
  uidPromotion: Joi.string().min(3).max(30).required().messages({
    'uid': 'incorrect value',
  }),
  uidService: Joi.string().min(10).max(40).required().messages({
    'min.case': 'incorrect value',
  }),
  codPromo: Joi.string().min(3).max(20).required().messages({
    "string.base": "El codigo de promocion debe ser un texto",
    "string.empty": "El codigo de promocion no puede estar vacío"
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
  isValid: Joi.boolean().messages({
    "boolean.base": "El campo 'isValid' debe ser verdadero o falso",
  }),
});

module.exports = promotionHistorySchema;