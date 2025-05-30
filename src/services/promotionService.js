const getDatabase = require('../database/index');
const db = require("../database/firestoreDb")
const admin = require('firebase-admin');


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
  const now = admin.firestore.Timestamp.now();
  console.log('now', now);
  try {
    const snapshot = await db.collection('promotions')
    .where('status', '==', true)
    .where('startDate', '<=', now)
    .where('endDate', '>=', now)
    .orderBy('startDate', 'asc')
    .get();
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

const setPromotion = async (data) =>{
  try {
    //const snapshot = await db.collection('promotions').get();
    const docRef = await db.collection('promotions').add(data);
    return docRef.id
    //console.log('Nuevo registro agregado con ID:', docRef.id);
  } catch (error) {
    return false;
    //console.error('Error al agregar el registro:', error);
  }
}

module.exports = {getPromotionsAvailable, getPromotions, getAllPromotions, setPromotion}