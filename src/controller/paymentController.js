const dayjs = require("dayjs");
const admin  = require('firebase-admin');
const { createPayment, createRecharge } = require("../services/paymentService");
const { getPromotionsAvailable } = require("../services/promotionService");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const rechargeFromPromotionHandler = async (req, res) => {
  try {
    const uidDriver = req.params.idDriver;
    const body = req.body;
    console.log("BODY", body);

    const now = admin.firestore.Timestamp.now();


    const newPayment = {
      amount: 0,
      createAt: now,
      paymentMethod: "recarga",
      transaction: "recarga",
      userAdmin: uidDriver,
      paymentDate: now
    };

    //registra el pago del conductor  createPayment() del servicio  paymentService
    const resCreate = await createRecharge(uidDriver, newPayment, body);
    if (resCreate.error) {
      res
        .status(500)
        .json({ success: false, data: {}, message: resCreate.message });
      return;
    }

    const data = {
      userCredit: resCreate.data.credit,
      promotionalPercentage: resCreate.data.promotionalPercentage,
      totalUserCredit: resCreate.data.amount,
    };
    res
      .status(200)
      .json({ success: true, data: data, message: resCreate.message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPaymentHandler = async (req, res) => {
  try {
    const body = req.body;
    const uidDriver = body.idDriver;

    const now = admin.firestore.Timestamp.now();
    const isoString = body.paymentDate.replace(' ', 'T');  // "2025-08-27T12:12:12"
    const date = new Date(isoString);
    const paymentDate = admin.firestore.Timestamp.fromDate(date);
    const newPayment = {
      createAt: now,
      paymentMethod: body.paymentMethod,
      transaction: body.paymentTransaction,
      userAdmin: body.userAdmin,
      paymentDate: paymentDate,
      codPromo: "",
    };

    //registra el pago del conductor  createPayment() del servicio  paymentService
    const resCreate = await createPayment(uidDriver, newPayment, body);
    console.log("resCreate", resCreate);
    if (resCreate.error) {
      res
        .status(500)
        .json({ success: false, data: {}, message: resCreate.message });
      return;
    }

    const data = {
      userCredit: resCreate.data.credit,
      promotionalPercentage: resCreate.data.promotionalPercentage,
      totalUserCredit: resCreate.data.amount,
    };
    res
      .status(200)
      .json({ success: true, data: data, message: resCreate.message });
  } catch (error) {
    console.log("tryerror",error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPaymentHandler, rechargeFromPromotionHandler };
