const admin  = require('firebase-admin');
const Database = require("./database");
const serviceAccount = require('../config/google-firebase.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

module.exports = db;


/*
class FirestoreDatabase extends Database {
  
  async connect_() {
    console.log("Conectado a Firestore");
  }
  
  connect = async () => {
    const serviceAccount = require('../config/google-firebase.json');
    if (!admin.apps.length) {
      try {
        // Inicializar Firebase Admin SDK con credenciales
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL, // URL de tu base de datos Firestore
        });

        this.db = admin.firestore();
        console.log("Conectado a Firestore");
      } catch (error) {
        console.error("Error al conectar con Firestore:", error.message);
        throw new Error("Error al inicializar Firestore");
      }
    }
  }

  async get(collection, query) {
    const snapshot = await this.db.collection(collection).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getzxc(collection, query) {
    try {
      let queryRef = this.db.collection(collection);
      
      if (query) {
        query.forEach(q => {
          queryRef = queryRef.where(q.field, q.operator, q.value);
        });
      }
      
      const snapshot = await queryRef.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
      throw new Error('Error al obtener los documentos');
    }
  }

  async create(collection, data) {
    const docRef = await this.db.collection(collection).add(data);
    return { id: docRef.id };
  }

  async update(collection, id, data) {
    await this.db.collection(collection).doc(id).update(data);
    return { id };
  }

  async delete(collection, id) {
    await this.db.collection(collection).doc(id).delete();
    return { id };
  }
}

module.exports = FirestoreDatabase;
*/