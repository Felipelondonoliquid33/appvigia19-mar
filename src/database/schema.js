import { getDBConnection } from './database';

export function createTables() {
    const db = getDBConnection();

    //db.execSync(`DROP TABLE IF EXISTS materiales;`);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS parametros (
            id INTEGER PRIMARY KEY,
            terminos TEXT,
            asentamiento TEXT,
            atencion TEXT,
            terminosEN TEXT,
            asentamientoEN TEXT,
            atencionEN TEXT
        );
    `);


    db.execSync(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY,
            username TEXT,
            nombre TEXT,
            email TEXT,
            telefono TEXT,
            rolId INTEGER,
            rolNombre TEXT,
            rolSuperUsuario INTEGER,
            terminos INTEGER,
            password TEXT,
            token TEXT
        );
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS catalogos (
            id INTEGER PRIMARY KEY,
            departamentos TEXT,
            municipios TEXT,
            nacionalidades TEXT,
            discapacidades TEXT,
            asentamiento TEXT,
            entrevistas TEXT,
            generos TEXT,
            grados TEXT,
            etnias TEXT,
            riesgos TEXT
        );
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS diligenciar (
            id TEXT PRIMARY KEY,
            idUsuario INTEGER,
            idTipo INTEGER, 
            nombreTipo TEXT,
            json TEXT,
            fechaRegistro TEXT,
            completa INTEGER,
            textoCompleta TEXT,
            enviada INTEGER,
            fechaEnvio TEXT,
            motivo TEXT,
            fechaMotivo TEXT,
            edadEntrevista INTEGER,
            momentoUno INTEGER,
            momentoDos INTEGER,
            momentoTres INTEGER
        );
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS materiales (
            id TEXT PRIMARY KEY,
            idTipo INTEGER,
            titulo TEXT,
            descripcion TEXT,
            tituloEn TEXT,
            descripcionEn TEXT,
            preview TEXT,
            imagen TEXT
        );
    `);    
}    
