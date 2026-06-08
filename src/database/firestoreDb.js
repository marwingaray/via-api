const admin = require('firebase-admin');
const Database = require("./database");
//const serviceAccount = require('../config/google-firebase.json');
const dotenv = require('dotenv');

let serviceAccount;
dotenv.config();

//console.log("process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;",process.env.FIREBASE_SERVICE_ACCOUNT_BASE64);

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
if (!serviceAccountBase64) {
   throw new Error('La variable FIREBASE_SERVICE_ACCOUNT_BASE64 no está definida');
}

try {
   const jsonString = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
   serviceAccount = JSON.parse(jsonString);

   if (typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
   }
} catch (error) {
   throw new Error('Error al decodificar o parsear el JSON del service account: ' + error.message);
}


admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();


module.exports = db;
