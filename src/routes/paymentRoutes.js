const express =  require('express');
const { createPaymentHandler } = require('../controller/paymentController.js');

const auth = require('../middlewares/auth.js');

const router = express.Router();
router.post('/recharge/:idDriver', auth,  ((req, res)=>{
  createPaymentHandler(req, res)
}) );

module.exports = router;