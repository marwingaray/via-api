const express =  require('express');
const { createPaymentHandler, rechargeFromPromotionHandler } = require('../controller/paymentController.js');
const rechargeFromPromotionSchema = require('../schemas/rechargePromotionSchema.js');
const payPromotionSchema = require('../schemas/payPromotionSchema.js');
const auth = require('../middlewares/auth.js');
const {validate} = require('../middlewares/validate.js');

const router = express.Router();
router.post('/', auth, validate(payPromotionSchema),  ((req, res)=>{
  createPaymentHandler(req, res)
}) );

router.post('/recharge/:idDriver', auth, validate(rechargeFromPromotionSchema),  ((req, res)=>{
  rechargeFromPromotionHandler(req, res)
}) );

module.exports = router;