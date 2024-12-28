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

const getHistoryByDriver = async (idDriver, paid=null) => {
  try {
    let snapshot;
    if (paid) {
      snapshot = await db.collection(pathCollection)
      .where("id_driver", "==", idDriver)
      .where("paid", "==", paid)
      .orderBy("create_at", "desc")
      .get();
    }if (paid == false) {
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
const updateStatePaymentAll = async (driverId)=>{
  try {
    const history = await getHistoryByDriver(driverId, false)
    
    if (history.length === 0) {
      return false;
    }
    const updates = history.map(async (record) => {
      const docRef = db.collection(pathCollection).doc(record.id);
      return await docRef.update({ paid: true });
    });
    const updatedRecords = await Promise.all(updates);
    return history;
  } catch (error) {
    console.error('Error al actualizar los registros:', error);
    return false;
  }
}

module.exports = { createPromotionsHistory, getHistoryByDriver,updateStatePaymentAll }