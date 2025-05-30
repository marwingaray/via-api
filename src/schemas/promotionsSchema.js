const Joi = require('joi');

const promotionSchema = Joi.object({
  codPromo: Joi.string().min(3).max(20).required().messages({
    'codPromo': 'incorrect value',
  }),
  conditions: Joi.object({
    type: Joi.string().required().messages({
      'typePromotion': 'incorrect value',
    }),
    maxAmount: Joi.number().required().messages({
      'maxAmount': 'incorrect value',
    }),
    perDay: Joi.number().required().messages({
      'perDay': 'incorrect value',
    }),
    promoPerUser: Joi.number().required().messages({
      'promoPerUser': 'incorrect value',
    }),
    list: Joi.array().default([])
  }).required(),
  discountAmount: Joi.number().required().messages({
    'discountAmount': 'incorrect value',
  }),
  discountType: Joi.string().max(20).required().messages({
    'discountType': 'incorrect value',
  }),
  endDate: Joi.date().iso().required().messages({
    'endDate': 'incorrect value',
  }),
  maxUse: Joi.number().messages({
    'maxUse': 'incorrect value',
  }),
  name: Joi.string().max(80).required().messages({
    'name': 'incorrect value',
  }),
  service: Joi.string().max(20).required().messages({
    'service': 'incorrect value',
  }),
  startDate: Joi.date().iso().required().messages({
    'startDate': 'incorrect value',
  }),
  status: Joi.boolean().required().messages({
    'status': 'incorrect value',
  }),
  terms: Joi.string().required().messages({
    'terms': 'incorrect value',
  }),
  useCount: Joi.number().messages({
    'useCount': 'incorrect value',
  }),
  userType: Joi.string().max(20).required().messages({
    'userType': 'incorrect value',
  }),
});

module.exports = promotionSchema;