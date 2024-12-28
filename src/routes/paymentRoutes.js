const express =  require('express');
const { createPaymentHandler } = require('../controller/paymentController.js');

const router = express.Router();
router.post('/recharge/:idDriver',  ((req, res)=>{
  createPaymentHandler(req, res)
}) );

module.exports = router;