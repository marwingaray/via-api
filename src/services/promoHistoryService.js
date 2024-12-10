//const getDatabase = require('../database/index');
const db = require("../database/firestoreDb")
const { getFirestore, collection, query, where, orderBy, getDocs } = require("firebase/firestore");



const pathCollection = "promotionsHistory";

const createPromotionsHistory = async (data) => {
  try {
    const docRef = await db.collection(pathCollection).add(data);
    return { id: docRef.id, ...data };
  } catch (error) {
    throw new Error(`Error al obtener promociones: ${(error).message}`);
  }
};

const getHistoryByDriver = async (idDriver, paid=false) => {
  try {
    let snapshot;

    if (paid) {
      snapshot = await db.collection(pathCollection)
      .where("id_driver", "==", idDriver)
      .where("paid", "==", paid)
      .orderBy("create_at", "desc")
      .get();
    }else{
      snapshot = await db.collection(pathCollection)
      .where("id_driver", "==", idDriver)
      .orderBy("create_at", "desc")
      .get();
    }
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));


  } catch (error) {
    throw new Error(`Error al obtener historial de promociones usadas: ${(error).message}`);
  }
};

/*const getHistoryByDriver = async (idDriver, paid=false) => {
  try {
    const docRef = await db.collection(pathCollection).where(data);
    return { id: docRef.id, ...data };
  } catch (error) {
    throw new Error(`Error al obtener promociones: ${(error).message}`);
  }
};*/


module.exports = { createPromotionsHistory, getHistoryByDriver }