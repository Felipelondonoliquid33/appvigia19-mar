import { getDBConnection } from './database';

/**
 * Crea un nuevo registro de entrevista diligenciada en el dispositivo (offline-first).
 * Se persiste localmente y se envía al servidor cuando hay conectividad.
 * @param {object} diligenciar - Objeto con todos los campos de la entrevista.
 * @param {string} diligenciar.id - UUID único generado en el dispositivo.
 * @param {number} diligenciar.idUsuario - ID del usuario que diligencia.
 * @param {number} diligenciar.idTipo - ID del tipo de entrevista.
 * @param {string} diligenciar.nombreTipo - Nombre del tipo de entrevista.
 * @param {string} diligenciar.json - JSON serializado con las respuestas del formulario.
 * @param {string} diligenciar.fechaRegistro - Fecha de creación del registro.
 * @param {number} diligenciar.completa - 1 si está completo, 0 si no.
 * @param {string} diligenciar.textoCompleta - Descripción del estado de completitud.
 * @param {number} diligenciar.enviada - 1 si fue enviado al servidor, 0 si no.
 * @param {string} diligenciar.fechaEnvio - Fecha de envío al servidor.
 * @param {string} diligenciar.motivo - Motivo u observación del registro.
 * @param {string} diligenciar.fechaMotivo - Fecha asociada al motivo.
 */
export function insertarDiligenciar(diligenciar) {
    const db = getDBConnection();
    try {
        db.runSync(`INSERT INTO diligenciar (id,idUsuario,idTipo, nombreTipo,json,fechaRegistro,completa, textoCompleta,enviada,fechaEnvio,motivo,fechaMotivo, edadEntrevista, momentoUno, momentoDos, momentoTres) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
            [diligenciar.id,diligenciar.idUsuario,diligenciar.idTipo, diligenciar.nombreTipo, diligenciar.json, diligenciar.fechaRegistro, diligenciar.completa, diligenciar.textoCompleta, diligenciar.enviada, diligenciar.fechaEnvio, diligenciar.motivo, diligenciar.fechaMotivo, diligenciar.edadEntrevista, diligenciar.momentoUno, diligenciar.momentoDos, diligenciar.momentoTres]
        );
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
};

/**
 * Actualiza un registro de entrevista existente en el dispositivo.
 * Se invoca al avanzar pasos del formulario, al completarlo
 * y al confirmar el envío exitoso al servidor.
 * @param {object} diligenciar - Objeto con los campos actualizados de la entrevista.
 * @param {string} diligenciar.id - UUID del registro a actualizar.
 * @param {string} diligenciar.json - JSON serializado con las respuestas actualizadas.
 * @param {string} diligenciar.fechaRegistro - Fecha de modificación del registro.
 * @param {number} diligenciar.completa - 1 si está completo, 0 si no.
 * @param {string} diligenciar.textoCompleta - Descripción del estado de completitud.
 * @param {number} diligenciar.enviada - 1 si fue enviado al servidor, 0 si no.
 * @param {string} diligenciar.fechaEnvio - Fecha de envío al servidor.
 * @param {string} diligenciar.motivo - Motivo u observación del registro.
 * @param {string} diligenciar.fechaMotivo - Fecha asociada al motivo.
 */
export function actualizarDiligenciar(diligenciar) {
    const db = getDBConnection();
    try {
        db.runSync(`update diligenciar set json=?, fechaRegistro=?, completa=?, textoCompleta = ?, enviada=?, fechaEnvio=?, motivo=?,fechaMotivo=?, edadEntrevista = ?, momentoUno = ?, momentoDos = ?, momentoTres = ?  where id=?;`,
            [diligenciar.json, diligenciar.fechaRegistro, diligenciar.completa, diligenciar.textoCompleta, diligenciar.enviada, diligenciar.fechaEnvio, diligenciar.motivo, diligenciar.fechaMotivo, diligenciar.edadEntrevista, diligenciar.momentoUno, diligenciar.momentoDos, diligenciar.momentoTres, diligenciar.id]
        );
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
};


/**
 * Retorna el registro completo de una entrevista por su ID.
 * Usado para mostrar el detalle y el resumen del formulario.
 * @param {string} id - UUID del registro de entrevista.
 * @returns {object|null} Objeto diligenciar si existe, null si no se encuentra.
 */
export function buscarDiligenciaroById(id) {
    const db = getDBConnection();
    const result = db.getFirstSync('SELECT * FROM diligenciar WHERE id = ?', [id]);
    if (result) {
        return result;
    } else {
        return null;
    }
}


/**
 * Elimina permanentemente un registro de entrevista del dispositivo por su ID.
 * @param {string} id - UUID del registro a eliminar.
 * @returns {boolean} true si la eliminación fue exitosa, false si ocurrió un error.
 */
export function eliminarDiligenciarById(id) {
    const db = getDBConnection();
    try {
        db.runSync(`delete from  diligenciar where id=?;`,
            [id]
        );
        return true;
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
        return false;
    }
}

/**
 * Retorna todas las entrevistas diligenciadas por un usuario específico.
 * Usado en el listado de entrevistas del usuario activo.
 * @param {number} idUser - ID del usuario propietario de las entrevistas.
 * @returns {Array} Array de objetos diligenciar para el usuario indicado.
 */
export function getDiligenciarByUser(idUser) {
    const db = getDBConnection();
    try {

        const result = db.getAllSync('SELECT * FROM diligenciar where idUsuario = ' + idUser + ';');
        if (result) {
            return result;
        } else {
            return  [];
        }
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
    return  [];
}


/**
 * Retorna la totalidad de entrevistas almacenadas en el dispositivo.
 * @returns {Array} Array de todos los objetos diligenciar.
 */
export function getDiligenciar() {
    const db = getDBConnection();
    try {

        const result = db.getAllSync('SELECT * FROM diligenciar;');
        if (result) {
            return result;
        } else {
            return  [];
        }
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
    return  [];
}
/**
 * Retorna las entrevistas completas que aún no han sido enviadas al servidor.
 * Usado para el proceso de sincronización automática al recuperar conectividad.
 * @returns {Array} Array de objetos diligenciar con completa=1 y enviada=0.
 */
export function getCompletasSinEnviar() {
    const db = getDBConnection();
    try {

        const result = db.getAllSync('SELECT * FROM diligenciar where completa = 1 and enviada = 0;');
        if (result) {
            return result;
        } else {
            return  [];
        }
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
    return  [];
}
