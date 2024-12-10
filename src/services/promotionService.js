const getDatabase = require('../database/index');
const db = require("../database/firestoreDb")


//const db = require('./firestore-config');


const getAllPromotions = async () => {
  try {
    const snapshot = await db.collection('promotions').get();

    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) ;
  } catch (error) {
    throw new Error(`Error al obtener promociones: ${(error).message}`);
  }
};

const getPromotions = async () => {
  try {
    const snapshot = await db.collection('promotions').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log('error', error);
    //throw new Error('An unknown error occurred');
  }
};

const getPromotionsAvailable = async () => {
  try {
    const snapshot = await db.collection('promotions').where('status', '==', true).get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log('error', error);
    //throw new Error('An unknown error occurred');
  }
}

const getPromotions_ = async () => {
  console.log("service:   getPromotions")
  const snapshot = await db.get("promotions");
  return snapshot;
  //return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

module.exports = {getPromotionsAvailable, getPromotions, getAllPromotions}