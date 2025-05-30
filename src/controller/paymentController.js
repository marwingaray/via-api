const dayjs = require('dayjs');
const { createPayment } = require('../services/paymentService');
const { getPromotionsAvailable } = require("../services/promotionService");



/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createPaymentHandler = async (req, res) => {
  
  try {
    const uidDriver = req.params.idDriver;
    const body = req.body;
    console.log('BODY', body);
    
    const todayTimestamp = {
      seconds: dayjs().unix(),
      nanoseconds: dayjs().millisecond() * 1e6,
    };

    const newPayment = {
      amount: 0,
      createAt: todayTimestamp,
      paymentMethod: 'recarga',
      transaction: '',
      uidUser:uidDriver,
      paymentDate:'',
      codPromo: ''
    }

    //registra el pago del conductor  createPayment() del servicio  paymentService
    const resCreate = await createPayment(uidDriver, newPayment, body)
    console.log('resCreate', resCreate);
    if (resCreate.error) {
      res.status(500).json({ success: false, data: {}, message: resCreate.message});
      return;
    }

    const data = {
      userCredit: resCreate.data.credit,
      promotionalPercentage: resCreate.data.promotionalPercentage,
      totalUserCredit: resCreate.data.amount
    }
    res.status(200).json({ success: true, data: data, message: resCreate.message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { createPaymentHandler };