const db = require("../database/firestoreDb");

const pathCollection = "drivers";

const createDriver = async (userId, data) => {
  try {
    const userRef = db.collection(pathCollection).doc(userId);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      return false;
    }
    const responseSet = await userRef.set({
      payments: [],
      createAt: new Date().toISOString(),
    });
    return responseSet || false;
  } catch (error) {
    console.error('Error al crear el usuario:', error.message);
    throw new Error(`Error: ${(error).message}`);
  }
};
module.exports = { createDriver }