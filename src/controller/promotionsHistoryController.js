const dayjs = require('dayjs');
const { createPromotionsHistory, getHistoryByDriver, createPromotionsHistoryPassenger } = require('../services/promoHistoryService');


const createHistoryHandler = async (req, res) => {
  try {
    const data = req.body;
    const todayTimestamp = {
      seconds: dayjs().unix(),
      nanoseconds: dayjs().millisecond() * 1e6,
    };
    const uid = data.idDriver;
    const idPassenger = data.idUser;
    
    const newData  = { ...data, paid:false, createAt:todayTimestamp, };
    const resDriver = await createPromotionsHistory(uid, adapterToDb(newData));

    await createPromotionsHistoryPassenger(idPassenger, data.uid);
    if (resDriver) {
      res.status(201).json({ success: true, data: resDriver });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * return the promotions history paid from driver
 */
const getHistoryByDriverHandler = async (req, res) => {
  try {
    const { driver } = req.params;
    
    const resGet = await getHistoryByDriver(driver);
    let response;
    //console.log("getHistoryByDriver",resGet )
    if (resGet) {
      const totalDiscountAmount = resGet.reduce((sum, item) => sum + item.discount, 0);
      response = {
        data: resGet,
        totalDiscountAmount: totalDiscountAmount,
      }
      res.status(200).json(response);
    }else
      res.status(204).json({ success: true, data: resGet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

function adapterToDb(data){
  let res = {
    cod_promo: data.codPromo,
    create_at: data.createAt,
    discount: data.discount,
    id_driver: data.idDriver,
    id_user: data.idUser,
    paid: data.paid,
    service_type: data.typeService,
    user_type:data.typeUser
  }
  return res;
}


module.exports = { createHistoryHandler, getHistoryByDriverHandler }