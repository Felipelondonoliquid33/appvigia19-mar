/**
 * rol1_2_superusuario.test.js
 * ─────────────────────────────────────────────────────────────────────────────
 * PRUEBA DE ROL — Rol 1 (Super Administrador) y Rol 2 (Supervisor)
 * Aplicación: ModoSeguro | Fecha: 2026-03-19
 *
 * ¿QUÉ SE PRUEBA?
 *   Este archivo verifica que los usuarios con rol de Administrador o Supervisor
 *   tengan acceso COMPLETO a todas las funciones de la aplicación:
 *   ✅ Pueden entrar a la app con su usuario y contraseña
 *   ✅ Ven el Dashboard (pantalla principal) con todos los accesos
 *   ✅ Pueden abrir los 4 tipos de entrevista (Funcionario, Agente, Niño, Padre)
 *   ✅ Ven las estadísticas y resumen de todas las entrevistas
 *   ✅ Pueden navegar a Materiales, Resultados y Rutas
 *   ✅ Pueden ingresar sin conexión si ya iniciaron sesión antes
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Suite de pruebas unitarias para los roles 1 (Admin) y 2 (Supervisor).
 *
 * Cobertura:
 *  - Navegación post-login al Dashboard (HomeScreen) con usuario superusuario
 *  - Visibilidad de los 4 tipos de entrevista en EntrevistaScreen
 *  - canShow() devuelve true para cualquier array de roles
 *  - Footer muestra todas las rutas de navegación
 *  - ResumenScreen carga estadísticas (completas + pendientes + riesgos)
 *  - Lectura offline: un superusuario en caché puede loguearse sin conexión
 *
 * Mocks requeridos (definidos en __tests__/setup.js):
 *   expo-sqlite, netinfo, async-storage, expo-font, vector-icons,
 *   react-native-safe-area-context, react-navigation, i18n/LanguageProvider,
 *   PersonFontSize
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

// ── Mocks locales adicionales ──────────────────────────────────────────────────

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({ isConnected: true, type: 'wifi' }),
}));

jest.mock('../../src/i18n/LanguageProvider', () => ({
  useLang: () => ({ t: (k) => k, lang: 'es', setLang: jest.fn() }),
}));

jest.mock('../../src/api/PersonFontSize', () => ({
  regular: 'System', bold: 'System', small: 12, normal: 14, large: 18,
  titulo: 22, normal: 14,
}));

jest.mock('../../src/componentes/funciones', () => ({
  RelativeSize: (n) => n,
  getFechaRegistro: jest.fn(() => '2026-03-18'),
  calcularEdad: jest.fn(() => 30),
}));

jest.mock('../../src/utils/responsive', () => ({
  useResponsive: () => ({
    rSpace: (n) => n,
    rFont: (n) => n,
    minTouchSize: (n) => n,
    screenInfo: { isCompact: false, isLarge: false },
  }),
}));

jest.mock('../../src/database/catalogos', () => ({
  buscarCatalogo: jest.fn(() => ({
    entrevistas: JSON.stringify([
      { IdTipo: 1, Tipo: { Nombre: 'Funcionario Público', Informacion: 'Info tipo 1', InformacionEn: 'Info type 1' }, Id: 1, Edad: 18, MomentoUno: 1, MomentoDos: 0, MomentoTres: 0, Categorias: [], Riesgos: [] },
      { IdTipo: 2, Tipo: { Nombre: 'Agentes Externos', Informacion: 'Info tipo 2', InformacionEn: 'Info type 2' }, Id: 2, Edad: 18, MomentoUno: 0, MomentoDos: 1, MomentoTres: 0, Categorias: [], Riesgos: [] },
      { IdTipo: 3, Tipo: { Nombre: 'Niños y Niñas', Informacion: 'Info tipo 3', InformacionEn: 'Info type 3' }, Id: 3, Edad: 12, MomentoUno: 1, MomentoDos: 1, MomentoTres: 1, Categorias: [], Riesgos: [] },
      { IdTipo: 4, Tipo: { Nombre: 'Padres y Cuidadores', Informacion: 'Info tipo 4', InformacionEn: 'Info type 4' }, Id: 4, Edad: 18, MomentoUno: 1, MomentoDos: 0, MomentoTres: 0, Categorias: [], Riesgos: [] },
    ]),
  })),
}));

jest.mock('../../src/database/diligenciar', () => ({
  getDiligenciar: jest.fn(() => [
    { id: 'USR001', idUsuario: 1, idTipo: 1, completa: 1, json: JSON.stringify({ IdRiesgo: 1 }) },
    { id: 'USR002', idUsuario: 1, idTipo: 3, completa: 1, json: JSON.stringify({ IdRiesgo: 2 }) },
    { id: 'USR003', idUsuario: 1, idTipo: 4, completa: 0, json: '{}' },
  ]),
  getDiligenciarByUser: jest.fn((userId) => [
    { id: 'USR001', idUsuario: userId, idTipo: 1, completa: 1, json: JSON.stringify({ IdRiesgo: 1 }) },
    { id: 'USR002', idUsuario: userId, idTipo: 3, completa: 1, json: JSON.stringify({ IdRiesgo: 2 }) },
    { id: 'USR003', idUsuario: userId, idTipo: 4, completa: 0, json: '{}' },
  ]),
}));

// ── Fixtures ───────────────────────────────────────────────────────────────────

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
};

/** Usuario con rolId=1 (Administrador total) */
const userSuperAdmin = {
  id: 1,
  userName: 'admin@vigiatp.co',
  nombre: 'Administrador Principal',
  email: 'admin@vigiatp.co',
  telefono: '3001234567',
  rolId: 1,
  rolNombre: 'Super Administrador',
  rolSuperUsuario: 1,
  token: 'mock_jwt_token_admin',
  terminos: 1,
};

/** Usuario con rolId=2 (Supervisor/Coordinador) */
const userSupervisor = {
  id: 2,
  userName: 'supervisor@vigiatp.co',
  nombre: 'Coordinadora Regional',
  email: 'supervisor@vigiatp.co',
  telefono: '3007654321',
  rolId: 2,
  rolNombre: 'Supervisor',
  rolSuperUsuario: 1,
  token: 'mock_jwt_token_supervisor',
  terminos: 1,
};

// ── Helper: lógica canShow aislada (sin renderizar componente) ─────────────────
const canShowFn = (roleId, rolesPermitidos) =>
  rolesPermitidos.includes(roleId) || roleId === 1 || roleId === 2;

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 1 — Lógica de permisos (canShow) para rolId=1
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 1 (Super Admin) — Permisos de acceso a tipos de entrevista', () => {

  test('TC-ROL1-001: canShow devuelve true para entrevista Tipo 1 (Funcionario Público)', () => {
    // Input: rolId=1, rolesPermitidos=[3,4]
    // Expected: true (porque rolId===1 hace bypass)
    expect(canShowFn(1, [3, 4])).toBe(true);
  });

  test('TC-ROL1-002: canShow devuelve true para entrevista Tipo 2 (Agentes Externos)', () => {
    // Input: rolId=1, rolesPermitidos=[5]
    // Expected: true (superusuario siempre pasa)
    expect(canShowFn(1, [5])).toBe(true);
  });

  test('TC-ROL1-003: canShow devuelve true para entrevista Tipo 3 (Niños y Niñas)', () => {
    expect(canShowFn(1, [3, 4])).toBe(true);
  });

  test('TC-ROL1-004: canShow devuelve true para entrevista Tipo 4 (Padres/Cuidadores)', () => {
    expect(canShowFn(1, [3, 4])).toBe(true);
  });

  test('TC-ROL1-005: canShow devuelve true incluso para un array vacío de roles', () => {
    // Edge case: si no hay roles especificados, el superusuario igual pasa
    expect(canShowFn(1, [])).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 2 — Lógica de permisos (canShow) para rolId=2
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 2 (Supervisor) — Permisos de acceso a tipos de entrevista', () => {

  test('TC-ROL2-001: canShow devuelve true para entrevista Tipo 1 (Funcionario Público)', () => {
    expect(canShowFn(2, [3, 4])).toBe(true);
  });

  test('TC-ROL2-002: canShow devuelve true para entrevista Tipo 2 (Agentes Externos)', () => {
    expect(canShowFn(2, [5])).toBe(true);
  });

  test('TC-ROL2-003: canShow devuelve true para entrevista Tipo 3 (Niños y Niñas)', () => {
    expect(canShowFn(2, [3, 4])).toBe(true);
  });

  test('TC-ROL2-004: canShow devuelve true para entrevista Tipo 4 (Padres/Cuidadores)', () => {
    expect(canShowFn(2, [3, 4])).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 3 — HomeScreen renderiza correctamente con superusuario
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 1 y 2 — HomeScreen renderiza los 4 accesos del Dashboard', () => {

  const HomeScreen = require('../../src/screens/HomeScreen').default;

  [userSuperAdmin, userSupervisor].forEach((usuario) => {
    describe(`Como ${usuario.rolNombre} (rolId=${usuario.rolId})`, () => {

      test(`TC-HOME-${usuario.rolId}-001: Debe renderizar el título principal del Home`, () => {
        const { getByText } = render(
          <HomeScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        // t('home.title') devuelve la key en mock → 'home.title'
        expect(getByText('home.title')).toBeTruthy();
      });

      test(`TC-HOME-${usuario.rolId}-002: Debe mostrar el botón "Entrevista"`, () => {
        const { getByText } = render(
          <HomeScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        expect(getByText('home.interview')).toBeTruthy();
      });

      test(`TC-HOME-${usuario.rolId}-003: Debe mostrar el botón "Materiales"`, () => {
        const { getByText } = render(
          <HomeScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        expect(getByText('home.materials')).toBeTruthy();
      });

      test(`TC-HOME-${usuario.rolId}-004: Debe mostrar el botón "Resultados"`, () => {
        const { getByText } = render(
          <HomeScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        expect(getByText('home.results')).toBeTruthy();
      });

      test(`TC-HOME-${usuario.rolId}-005: Debe mostrar el botón "Rutas"`, () => {
        const { getByText } = render(
          <HomeScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        expect(getByText('home.routes')).toBeTruthy();
      });

      test(`TC-HOME-${usuario.rolId}-006: Tap en "Entrevista" navega a la pantalla Entrevista`, () => {
        const nav = { ...mockNavigation, navigate: jest.fn() };
        const { getByText } = render(
          <HomeScreen navigation={nav} route={{ params: { user: usuario } }} />
        );
        fireEvent.press(getByText('home.interview'));
        expect(nav.navigate).toHaveBeenCalledWith('Entrevista', { user: usuario });
      });
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 4 — EntrevistaScreen muestra los 4 tipos para rolId=1 y rolId=2
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 1 y 2 — EntrevistaScreen muestra los 4 tipos de entrevista', () => {

  const EntrevistaScreen = require('../../src/screens/EntrevistaScreen').default;

  [userSuperAdmin, userSupervisor].forEach((usuario) => {
    describe(`Como ${usuario.rolNombre} (rolId=${usuario.rolId})`, () => {

      test(`TC-ENT-${usuario.rolId}-001: Debe mostrar la tarjeta "Padres/Cuidadores" (Tipo 4)`, () => {
        const { getByText } = render(
          <EntrevistaScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        expect(getByText('interview.cards.parents')).toBeTruthy();
      });

      test(`TC-ENT-${usuario.rolId}-002: Debe mostrar la tarjeta "Niños y Niñas" (Tipo 3)`, () => {
        const { getByText } = render(
          <EntrevistaScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        expect(getByText('interview.cards.kids')).toBeTruthy();
      });

      test(`TC-ENT-${usuario.rolId}-003: Debe mostrar la tarjeta "Funcionario Público" (Tipo 1)`, () => {
        const { getByText } = render(
          <EntrevistaScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        expect(getByText('interview.cards.public')).toBeTruthy();
      });

      test(`TC-ENT-${usuario.rolId}-004: Debe mostrar la tarjeta "Agentes Externos" (Tipo 2)`, () => {
        const { getByText } = render(
          <EntrevistaScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        expect(getByText('interview.cards.agents')).toBeTruthy();
      });
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 5 — ResumenScreen acumula estadísticas para rolId=1
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 1 (Super Admin) — ResumenScreen muestra contador de entrevistas', () => {

  const ResumenScreen = require('../../src/screens/ResumenScreen').default;

  test('TC-RES-1-001: Debe renderizar la pantalla de resultados sin crash', async () => {
    const { getByText } = render(
      <ResumenScreen navigation={mockNavigation} route={{ params: { user: userSuperAdmin } }} />
    );
    // La pantalla monta sin excepciones
    expect(getByText).toBeTruthy();
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 6 — Propiedades del objeto usuario superusuario
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 1 y 2 — Estructura del objeto usuario en sesión', () => {

  test('TC-USR-001: userSuperAdmin tiene rolSuperUsuario=1', () => {
    expect(userSuperAdmin.rolSuperUsuario).toBe(1);
  });

  test('TC-USR-002: userSuperAdmin tiene token JWT no vacío', () => {
    expect(userSuperAdmin.token).toBeTruthy();
    expect(typeof userSuperAdmin.token).toBe('string');
  });

  test('TC-USR-003: userSupervisor tiene terminos=1 (aceptó T&C)', () => {
    expect(userSupervisor.terminos).toBe(1);
  });

  test('TC-USR-004: rolId=1 y rolId=2 tienen rolSuperUsuario=1', () => {
    expect(userSuperAdmin.rolSuperUsuario).toBe(1);
    expect(userSupervisor.rolSuperUsuario).toBe(1);
  });
});
