/**
 * entrevistaCache.js
 * Almacena el objeto entrevista en memoria de módulo para evitar
 * pasarlo como param de navegación (el objeto es grande y causa
 * presión de memoria en React Navigation / Expo Go).
 */
let _entrevista = null;

export function setEntrevista(e) {
    _entrevista = e;
}

export function getEntrevista() {
    return _entrevista;
}
