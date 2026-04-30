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

    // ── Control de versión y migraciones (RNF — mantenibilidad) ─────────────
    db.execSync(`
        CREATE TABLE IF NOT EXISTS db_version (
            version INTEGER PRIMARY KEY
        );
    `);

    runMigrations(db);
}

/**
 * Ejecuta migraciones de esquema de forma incremental y segura.
 * Cada versión aplica solo el delta necesario.
 */
function runMigrations(db) {
    const row = db.getFirstSync('SELECT MAX(version) as v FROM db_version');
    const currentVersion = (row && row.v != null) ? row.v : 0;

    // ── v1: agregar columna password_salt a usuarios (necesaria para C-1 SHA-256) ─
    if (currentVersion < 1) {
        try {
            db.execSync(`ALTER TABLE usuarios ADD COLUMN password_salt TEXT;`);
        } catch (_) {
            // La columna ya existe (app reinstalada con BD nueva) — ignorar
        }
        db.runSync(`INSERT OR REPLACE INTO db_version (version) VALUES (1);`);
    }

    // ── v2: reservada para futura remoción del campo token (tras C-3 consolidado) ─
    // if (currentVersion < 2) { ... }
}

