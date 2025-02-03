const dayjs = require('dayjs');
const { createPayment } = require('../services/paymentService');
const { getPromotionsAvailable } = require("../services/promotionService");
//const { message } = require('../schemas/promotionHistorySchema');


const createPaymentHandler = async (req, res) => {
  let response = {};
  try {   
    const uidDriver = req.params.idDriver;
    const todayTimestamp = {
      seconds: dayjs().unix(),
      nanoseconds: dayjs().millisecond() * 1e6,
    };

    const newPayment = {
      amount: 1,
      createAt: todayTimestamp,
      paymentMethod: 'recarga',
      transaction: '',
      uidUser:uidDriver,
      paymentDate:'',
      codPromo: ''
    }

    const resCreate = await createPayment(uidDriver, newPayment)
    console.log('resCreate', resCreate);
    if (resCreate.error == true) {
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