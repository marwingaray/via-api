const dayjs = require("dayjs");
const admin = require("firebase-admin");
const {
  createPromotionsHistory,
  getHistoryByDriver,
  createPromotionsHistoryPassenger,
  getPromotionsByIds,
} = require("../services/promoHistoryService");

const createHistoryHandler = async (req, res) => {
  try {
    const data = req.body;
    const todayTimestamp = admin.firestore.Timestamp.now();
    const uidDriver = data.idDriver;
    const uidTrip = data.uidService;
    const idPassenger = data.idUser;

    const newData = { ...data, paid: false, createAt: todayTimestamp };
    const resDriver = await createPromotionsHistory(
      uidDriver,
      uidTrip,
      adapterToDb(newData)
    );

    await createPromotionsHistoryPassenger(idPassenger, data.uidPromotion);
    if (resDriver) {
      res.status(201).json({ success: true, data: resDriver });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
      const totalDiscountAmount = resGet.reduce(
        (sum, item) => sum + item.discount,
        0
      );
      // const create_at = {
      //   seconds: resGet.create_at?._seconds ?? resGet.create_at?.seconds,
      //   nanoseconds: 276000000,
      // };
      // const data = resGet.forEach((obj) => {
      //   obj.create_at = {
      //     seconds: obj.create_at._seconds ?? '',
      //     nanoseconds: obj.create_at._nanoseconds ?? '',
      //   };
      // });
      const data = resGet.map(obj => {
        
        
        return {
        ...obj,
        create_at: {
          seconds: obj.create_at._seconds,
          nanoseconds: obj.create_at._nanoseconds
        }
      }
      });
      response = {
        success: true,
        data: data,
        totalDiscountAmount: totalDiscountAmount,
      };
      res.status(200).json(response);
    } else res.status(204).json({ success: true, data: resGet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * return the promotions history by id
 */
const getHistoryByIdHandler = async (req, res) => {
  try {
    const { driver, idHistoryPayment } = req.params;

    const resGet = await getPromotionsByIds(driver, [idHistoryPayment]);
    if (resGet) {
      res.status(200).json({ success: true, data: resGet, message: "" });
    } else
      res
        .status(204)
        .json({
          success: true,
          data: resGet,
          message: "No se encontararon coincidencias",
        });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function adapterToDb(data) {
  let res = {
    id_trip: data.uidService,
    id_Promotion: data.uidPromotion,
    cod_promo: data.codPromo,
    create_at: data.createAt,
    discount: data.discount,
    id_driver: data.idDriver,
    id_user: data.idUser,
    paid: data.paid,
    service_type: data.typeService,
    user_type: data.typeUser,
    isValid: data.isValid,
  };
  return res;
}

module.exports = {
  createHistoryHandler,
  getHistoryByDriverHandler,
  getHistoryByIdHandler,
};
