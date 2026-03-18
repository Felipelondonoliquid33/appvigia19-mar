import { getDBConnection } from './database';

/**
 * Elimina todos los materiales educativos de la tabla materiales.
 * Se invoca antes de una resincronización con el servidor.
 */
export function truncateMaterial() {
    const db = getDBConnection();
    try {
        db.runSync(`DELETE FROM materiales;`);
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
};

/**
 * Inserta un material educativo descargado del servidor.
 * Se invoca en bucle durante la sincronización de materiales.
 * @param {object} registro - Objeto con los datos del material.
 * @param {string} registro.Id - Identificador único del material.
 * @param {number} registro.IdTipo - Categoría del material educativo.
 * @param {string} registro.Titulo - Título del material en español.
 * @param {string} registro.Descripcion - Contenido del material en español.
 * @param {string} registro.Preview - URL de imagen de vista previa.
 * @param {string} registro.Imagen - URL de imagen principal.
 * @param {string} registro.TituloEn - Título del material en inglés.
 * @param {string} registro.DescripcionEn - Contenido del material en inglés.
 */
export function insertarMaterial(registro) {
    const db = getDBConnection();
    try {
        db.runSync(`INSERT INTO materiales (id,idTipo,titulo, descripcion, preview, imagen,tituloEn, descripcionEn) values (?,?,?,?,?,?,?,?);`,
            [registro.Id,registro.IdTipo,registro.Titulo,registro.Descripcion,registro.Preview, registro.Imagen,registro.TituloEn,registro.DescripcionEn]
        );
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
};

/**
 * Retorna todos los materiales educativos de una categoría específica.
 * Usado para mostrar el contenido filtrado por tipo en los módulos de materiales.
 * @param {number} idTipo - Identificador de la categoría del material.
 * @returns {Array} Array de objetos material para el tipo indicado.
 */
export function buscarMaterialBytipo(idTipo) {
    const db = getDBConnection();
    const result = db.getAllSync(
        'SELECT * FROM materiales WHERE idTipo = ?',
        [idTipo]
    );
    return result || [];
}
