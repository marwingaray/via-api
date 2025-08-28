const getDatabase = require("../database/index");
const db = require("../database/firestoreDb");
const admin = require("firebase-admin");

//const db = require('./firestore-config');

const getAllPromotions = async () => {
  try {
    const snapshot = await db.collection("promotions").get();

    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Error al obtener promociones: ${error.message}`);
  }
};

const getPromotions = async () => {
  try {
    const snapshot = await db.collection("promotions").get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log("PROMOSERV01:", error);
  }
};

const getPromotionsAvailable = async () => {
  const now = admin.firestore.Timestamp.now();
  try {
    const snapshot = await db
      .collection("promotions")
      .where("status", "==", true)
      .where("startDate", "<=", now)
      .where("endDate", ">=", now)
      .orderBy("startDate", "asc")
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log("PROMOSERV02", error);
    //throw new Error('An unknown error occurred');
  }
};

const getPromotions_ = async () => {
  console.log("service:   getPromotions");
  const snapshot = await db.get("promotions");
  return snapshot;
  //return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
};

const setPromotion = async (data) => {
  try {
    //const snapshot = await db.collection('promotions').get();
    const docRef = await db.collection("promotions").add(data);
    return docRef.id;
    //console.log('Nuevo registro agregado con ID:', docRef.id);
  } catch (error) {
    return false;
    //console.error('Error al agregar el registro:', error);
  }
};
const deletePromotion = async (idPromotion) => {
  try {
    const ref = db.collection("promotions").doc(idPromotion);
    const doc = await ref.get();
    if (!doc.exists) {
      return { status: false, message: "Not found promotion" };
    }
    await ref.delete();
    return { status: true };
  } catch (error) {
    console.log(error);
    return { status: false, message: error };
  }
};

const updateStatus = async (idPromotion, newStatus) => {
  try {
    const ref = db.collection("promotions").doc(idPromotion);

    const docExists = (await ref.get()).exists;
    if (!docExists) {
      return { statusDb: false, message: "Promotion not found" };
    }

    await ref.update({ status: newStatus });
    return { statusDb: true, message: "Status updated successfully" };
  } catch (error) {
    return { statusDb: false, message: error.message || "Unknown error" };
  }
};

module.exports = {
  getPromotionsAvailable,
  getPromotions,
  getAllPromotions,
  setPromotion,
  deletePromotion,
  updateStatus,
};
