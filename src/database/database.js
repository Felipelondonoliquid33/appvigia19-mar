import * as SQLite from 'expo-sqlite';

let db = null;

/**
 * Retorna la instancia única de la base de datos SQLite (singleton).
 * Abre la conexión a 'modoseguro4.db' la primera vez que se invoca.
 * @returns {SQLiteDatabase} Instancia de la base de datos local del dispositivo.
 */
export function getDBConnection() {
  if (!db) {
    db = SQLite.openDatabaseSync('modoseguro11.db');
  }
  return db;
}