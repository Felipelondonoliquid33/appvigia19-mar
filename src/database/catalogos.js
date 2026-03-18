import { getDBConnection } from './database';

/**
 * Elimina todos los registros de la tabla catalogos.
 * Se invoca antes de una resincronización con el servidor.
 */
export function truncateCatalogo() {
    const db = getDBConnection();
    try {
        db.runSync(`DELETE FROM catalogos;`);
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
};

/**
 * Inserta el registro único de catálogos (id=1) con todos los arrays JSON
 * de listas de referencia descargados desde el servidor (/Home/Catalogos).
 * @param {string} departamentos - Array JSON de departamentos.
 * @param {string} municipios - Array JSON de municipios.
 * @param {string} nacionalidades - Array JSON de nacionalidades.
 * @param {string} asentamiento - Array JSON de tipos de asentamiento.
 * @param {string} entrevistas - Array JSON de tipos de entrevista.
 * @param {string} generos - Array JSON de géneros.
 * @param {string} grados - Array JSON de grados escolares.
 * @param {string} etnias - Array JSON de grupos étnicos.
 * @param {string} discapacidades - Array JSON de tipos de discapacidad.
 * @param {string} riesgos - Array JSON de tipos de riesgo.
 */
export function insertarCatalogo(departamentos,municipios, nacionalidades, asentamiento, entrevistas, generos,grados,etnias, discapacidades, riesgos) {
    const db = getDBConnection();
    try {
        db.runSync(`INSERT INTO catalogos (id,departamentos,municipios, nacionalidades, asentamiento, entrevistas, generos,grados,etnias, discapacidades,riesgos) values (1,?,?,?,?,?,?,?,?,?,?);`,
            [departamentos,municipios, nacionalidades, asentamiento, entrevistas, generos,grados,etnias,discapacidades, riesgos]
        );
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
};

/**
 * Retorna el registro único de catálogos (id=1).
 * Usado para poblar los campos desplegables del formulario de entrevista.
 * @returns {object|null} Objeto con todos los catálogos serializados en JSON, o null si no existe.
 */
export function buscarCatalogo() {
    const db = getDBConnection();
    const result = db.getFirstSync('SELECT * FROM catalogos WHERE id = 1');
    if (result) {
        return result;
    } else {
        return null;
    }
}
