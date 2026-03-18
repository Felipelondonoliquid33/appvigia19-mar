import { getDBConnection } from './database';

/**
 * Inserta un nuevo usuario autenticado en la base de datos local del dispositivo.
 * Se invoca tras un login exitoso contra el servidor.
 * @param {number} id - ID del usuario sincronizado desde el servidor.
 * @param {string} username - Correo electrónico institucional del usuario.
 * @param {string} nombre - Nombre completo del usuario.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} telefono - Teléfono del usuario.
 * @param {number} rolId - ID del rol del usuario.
 * @param {string} rolNombre - Nombre descriptivo del rol.
 * @param {number} rolSuperUsuario - 1 si es superusuario, 0 si no.
 * @param {string} password - Contraseña hasheada con MD5.
 * @param {string} token - Token de sesión entregado por el servidor.
 * @param {number} terminos - 1 si el usuario aceptó los términos, 0 si no.
 */
export function insertarUsuario(id, username, nombre, email, telefono, rolId,rolNombre,rolSuperUsuario,password, token, terminos) {
    const db = getDBConnection();
    try {
        db.runSync(`INSERT INTO usuarios (id,username,nombre,email,telefono,rolId,rolNombre,rolSuperUsuario,password,token, terminos) values (?,?,?,?,?,?,?,?,?,?,?);`,
            [id, username, nombre, email, telefono, rolId,rolNombre,rolSuperUsuario,password, token, terminos]
        );
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
};

/**
 * Actualiza los datos del usuario ya registrado en el dispositivo.
 * Se invoca al re-autenticar o al actualizar el token de sesión.
 * @param {number} id - ID del usuario a actualizar.
 * @param {string} username - Correo electrónico institucional del usuario.
 * @param {string} nombre - Nombre completo del usuario.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} telefono - Teléfono del usuario.
 * @param {number} rolId - ID del rol del usuario.
 * @param {string} rolNombre - Nombre descriptivo del rol.
 * @param {number} rolSuperUsuario - 1 si es superusuario, 0 si no.
 * @param {string} password - Contraseña hasheada con MD5.
 * @param {string} token - Token de sesión entregado por el servidor.
 * @param {number} terminos - 1 si el usuario aceptó los términos, 0 si no.
 */
export function actualizarUsuario(id, username, nombre, email, telefono, rolId,rolNombre,rolSuperUsuario,password,token,terminos) {
    const db = getDBConnection();
    try {
        db.runSync(`update usuarios set username=?, nombre=?, email=?, telefono=?, rolId=?, rolNombre=?,rolSuperUsuario=?,password=?, token=?, terminos=? where id=?;`,
            [username, nombre, email, telefono, rolId,rolNombre,rolSuperUsuario,password, token, terminos,id]
        );
    } catch (error) {
        // Error silenciado — el fallo se propaga hacia el llamador
    }
};

/**
 * Busca y retorna un usuario por su nombre de usuario (correo electrónico).
 * Usado para validar el login offline en el dispositivo.
 * @param {string} username - Correo electrónico del usuario a buscar.
 * @returns {object|null} Objeto usuario si existe, null si no se encuentra.
 */
export function buscarUsuarioByUserName(username) {
    const db = getDBConnection();
    const result = db.getFirstSync('SELECT * FROM usuarios WHERE username = ?', [username]);
    if (result) {
        return result;
    } else {
        return null;
    }
}

/**
 * Busca y retorna un usuario por su ID.
 * Usado para recuperar la sesión activa del dispositivo.
 * @param {number} id - ID del usuario a buscar.
 * @returns {object|null} Objeto usuario si existe, null si no se encuentra.
 */
export function buscarUsuarioById(id) {
    const db = getDBConnection();
    const result = db.getFirstSync('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (result) {
        return result;
    } else {
        return null;
    }
}

/**
 * Retorna todos los usuarios almacenados en el dispositivo.
 * @returns {Array} Array de objetos usuario.
 */
export function getUsuarios() {
    const db = getDBConnection();

    const result = db.getAllSync('SELECT * FROM usuarios;');
    return result; // devuelve un array de objetos        

}
