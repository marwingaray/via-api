const db = require("../database/firestoreDb");
const admin = require("firebase-admin");

const pathCollection = 'passengers'

/**
 * Returns the amount of use that a passenger gave to a promotion
 * @param {string} uidPassenger 
 * @param {string} uidPromotion 
 * @returns usage: Number | false
 */
const getUsagePromotion = async (uidPassenger, uidPromotion)  => {
  console.log('getUsagePromotion',uidPromotion );
  const ref = db.collection(pathCollection).doc(uidPassenger).collection('promotionsHistory').doc(uidPromotion);
  const snapshot = await ref.get();
  if (snapshot?.exists) {
    console.log('snapshot.data', snapshot.data());
    return snapshot.data().usage
  }
  return false;
}

/**
 * Create or update a promotion usage
 * @param {string} uidPassenger 
 * @param {string} uidPromotion 
 */
const setUsagePromotion = async (uidPassenger, uidPromotion) => {
  try {
    const ref = db.collection(pathCollection).doc(uidPassenger).collection('promotionsHistory').doc(uidPromotion);
    const doc = await ref.get();
    await ref.set({
      uidPromo,
      usage: admin.firestore.FieldValue.increment(1),
      date_modified: new Date(),
      create_at: doc.exists ? doc.data().create_at : new Date()
    },{
      merge: true
    })
  } catch (error) {
    throw new Error(`Error al registrar historial de pasajero: ${(error).message}`);
  }
}

module.exports = { getUsagePromotion, setUsagePromotion }