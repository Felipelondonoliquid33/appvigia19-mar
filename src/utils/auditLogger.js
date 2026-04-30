/**
 * auditLogger.js — RNF-1.3
 * Cola local de eventos de seguridad. Encola en AsyncStorage y envía
 * al backend cuando hay conexión. Si no hay endpoint aún, los eventos
 * se acumulan silenciosamente hasta que el backend los acepte.
 *
 * Tipos de evento:
 *   LOGIN_SUCCESS | LOGIN_FAILED | LOGOUT | SYNC_OK | SYNC_FAILED | SESSION_TIMEOUT
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiBase from '../api/apiBase';

const QUEUE_KEY = 'audit_event_queue';
let _writeLock = Promise.resolve(); // Mutex para prevenir race conditions
let _flushing = false;             // Evita múltiples fetch simultáneos

/**
 * Registra un evento de seguridad y lo encola para envío.
 * @param {'LOGIN_SUCCESS'|'LOGIN_FAILED'|'LOGOUT'|'SYNC_OK'|'SYNC_FAILED'|'SESSION_TIMEOUT'} tipo
 * @param {object} detalle - Datos adicionales (userId, motivo, etc.)
 */
export async function logEvent(tipo, detalle = {}) {
    try {
        const evento = {
            tipo,
            timestamp: new Date().toISOString(),
            userId: detalle.userId ?? detalle.usrId ?? null,
            userName: detalle.userName ?? detalle.username ?? null,
            motivo: detalle.motivo ?? detalle.detalle ?? null,
        };

        // Esperar a que termine cualquier escritura anterior (prevenir race condition)
        await (_writeLock = _writeLock.then(async () => {
            const raw = await AsyncStorage.getItem(QUEUE_KEY);
            const cola = raw ? JSON.parse(raw) : [];
            cola.push(evento);

            // Límite de 200 eventos para no saturar AsyncStorage
            const colaFinal = cola.slice(-200);
            await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(colaFinal));
        }));

        // Intento de envío no bloqueante
        flushQueue();
    } catch (_) {
        // Logger no debe romper la app bajo ninguna circunstancia
    }
}

/**
 * Intenta enviar la cola al backend. Si falla, los eventos quedan
 * guardados para el próximo intento.
 */
export async function flushQueue() {
    // Evitar llamadas concurrentes — si ya hay un flush en curso, ignorar
    if (_flushing) return;
    _flushing = true;
    try {
        const raw = await AsyncStorage.getItem(QUEUE_KEY);
        if (!raw) { _flushing = false; return; }

        const cola = JSON.parse(raw);
        if (!cola || cola.length === 0) { _flushing = false; return; }

        // Si el endpoint de auditoría aún no existe, salir silenciosamente
        if (!ApiBase.apiAudit) { _flushing = false; return; }

        // Timeout de 8 segundos para evitar fetch colgados que acumulan conexiones
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch(ApiBase.apiAudit, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'ReactNative',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify(cola),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                // Limpiar cola solo si el servidor confirmó recepción
                await AsyncStorage.removeItem(QUEUE_KEY);
            }
        } catch (_) {
            clearTimeout(timeoutId);
            // Fallo silencioso (timeout o red) — eventos se reintentarán después
        }
    } catch (_) {
        // Fallo silencioso
    } finally {
        _flushing = false;
    }
}

// Flush periódico cada 60 s y al arrancar
let _flushTimer = null;
export function startPeriodicFlush() {
    if (_flushTimer) return;
    flushQueue(); // flush inmediato al arrancar
    _flushTimer = setInterval(flushQueue, 60000);
}
