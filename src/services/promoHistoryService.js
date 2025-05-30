const db = require("../database/firestoreDb");
const admin = require("firebase-admin");
const { getFirestore, collection, query, where, orderBy, getDocs } = require("firebase/firestore");

const pathCollectionDriver = "drivers";
const pathCollectionPassenger = "passengers";

const createPromotionsHistory = async (uid, data) => {
  try {
    const docRef = await db.collection(`${pathCollectionDriver}/${uid}/promotionsHistory`).add(data);
    return { id: docRef.id, ...data };
  } catch (error) {
    throw new Error(`Error al registrar historial: ${(error).message}`);
  }
};

// TODO Move to service passenger. exist in passenger service setUsagePromotion
const createPromotionsHistoryPassenger = async (uidPassenger, uidPromo) => {
  try {
    const ref = db.collection(pathCollectionPassenger).doc(uidPassenger).collection("promotionsHistory").doc(uidPromo);
    const promoDoc = await ref.get();
    await ref.set({
      uidPromo,
      usage: admin.firestore.FieldValue.increment(1),
      date_modified: new Date(),
      create_at: promoDoc.exists ? promoDoc.data().create_at : new Date()
    },{
      merge: true
    }
  )
    return { id: ref.id };
  } catch (error) {
    throw new Error(`Error al registrar historial de pasajero: ${(error).message}`);
  }
};


/**
 * Retorna lista de historial, todos o solo pagados o pendiente de pago
 * @param {String} idDriver 
 * @param {boolean} paid Optional true: only payments, false: without payments
 * @returns 
 */
const getHistoryByDriver = async (idDriver, paid="all") => {
  try {
    let snapshot;
    const path = db.collection(pathCollectionDriver).doc(idDriver).collection('promotionsHistory')
    if ( paid == "all") {
      snapshot = await path.orderBy("create_at", "desc").get();
    }else{
      snapshot = await path
      .where("paid", "==", paid)
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

/**
 * Return history promotions by ids
 * @param {string} idDriver 
 * @param {array} ids List of ids
 * @returns 
 */
const getPromotionsByIds = async (idDriver, ids = []) => {
  try {
    const path = db.collection(pathCollectionDriver).doc(idDriver).collection('promotionsHistory');

    const results = await Promise.all(
      ids.map(async (id) => {
        const doc = await path.doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
      })
    );
console.log('getPromotionsByIds',results);

    // Eliminar los que no existen
    return results.filter(item => item !== null);
  } catch (error) {
    throw new Error(`Error al obtener los registros: ${error.message}`);
  }
};

/***
 * Update status of history payments
 * const updatedRecords = await Promise.all(updates);
 * @param {*} idDriver 
 * @param {aray} list array of IDs
 * @returns 
 */
const updateStatePaymentAll = async (idDriver, list)=>{
  try {
    const history = await getPromotionsByIds(idDriver, list)
    console.log('updateStatePaymentAll', history);
    
    if (history.length === 0) {
      return false;
    }
    const updates = history.map(async (record) => {
      const docRef = db.collection(`${pathCollectionDriver}/${idDriver}/promotionsHistory`).doc(record.id);
      return await docRef.update({ paid: true });
    });
    await Promise.all(updates);
    
    return history;
  } catch (error) {
    console.error('Error al actualizar los registros:', error);
    return false;
  }
}

module.exports = { createPromotionsHistory, getHistoryByDriver,updateStatePaymentAll, createPromotionsHistoryPassenger}