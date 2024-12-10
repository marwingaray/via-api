const { FirestoreDatabase } = require('../database/firestoreDb.js');

function getDatabase() {
  const dbType = process.env.DB_TYPE || 'firestore';

  switch (dbType) {
    case 'firestore':
      return new FirestoreDatabase();
    case 'postgres':
      return null;
      //return new PostgresDatabase();
    default:
      throw new Error(`Tipo de base de datos no soportado: ${dbType}`);
  }
}
module.export = getDatabase;

