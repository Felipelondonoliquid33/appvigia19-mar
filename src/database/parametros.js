import { getDBConnection } from './database';

/**
 * Elimina todos los registros de la tabla parametros.
 * Se invoca antes de una resincronización con el servidor.
 */
export function truncateParametros() {
    const db = getDBConnection();
    try {
        db.runSync(`DELETE FROM parametros;`);
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
};

/**
 * Inserta el registro único de parámetros (id=1) con los textos institucionales
 * sincronizados desde el servidor (/Home/Parametros).
 * @param {string} terminos - Texto de términos y condiciones en español.
 * @param {string} asentamiento - Texto del formulario de asentamiento en español.
 * @param {string} atencion - Texto de la ruta de atención en español.
 * @param {string} terminosEn - Texto de términos y condiciones en inglés.
 * @param {string} asentamientoEn - Texto del formulario de asentamiento en inglés.
 * @param {string} atencionEn - Texto de la ruta de atención en inglés.
 */
export function insertarParametros(terminos, asentamiento, atencion, terminosEn, asentamientoEn, atencionEn) {
    const db = getDBConnection();
    try {
        db.runSync(`INSERT INTO parametros (id,terminos, asentamiento,atencion, terminosEn, asentamientoEn, atencionEn) values (1,?,?,?,?,?,?);`,
            [terminos, asentamiento,atencion, terminosEn, asentamientoEn, atencionEn]
        );
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
};

/**
 * Retorna el registro único de parámetros (id=1).
 * Usado para mostrar términos, condiciones y textos de asentimiento en la app.
 * @returns {object|null} Objeto con los textos institucionales en ES/EN, o null si no existe.
 */
export function buscarParametros() {
    const db = getDBConnection();
    const result = db.getFirstSync('SELECT * FROM parametros WHERE id = 1');
    if (result) {
        return result;
    } else {
        return null;
    }
}