// src/database/database.js

class Database {
  async connect() {
    throw new Error("Método no implementado");
  }
  async get(collection, query) {
    throw new Error("Método no implementado");
  }
  async create(collection, data) {
    throw new Error("Método no implementado");
  }
  async update(collection, id, data) {
    throw new Error("Método no implementado");
  }
  async delete(collection, id) {
    throw new Error("Método no implementado");
  }
}
module.exports = Database;
