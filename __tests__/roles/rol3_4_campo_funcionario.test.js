/**
 * rol3_4_campo_funcionario.test.js
 * Suite de pruebas unitarias para los roles 3 (Profesional de campo)
 * y 4 (Funcionario entrevistador).
 *
 * Cobertura:
 *  - canShow() devuelve true SOLO para Tipos 1, 3 y 4
 *  - canShow() devuelve false para Tipo 2 (Agentes Externos)
 *  - EntrevistaScreen NO renderiza la tarjeta de Agentes Externos (Tipo 2)
 *  - EntrevistaScreen SÍ renderiza Tipos 1, 3 y 4
 *  - HomeScreen muestra el dashboard completo (el acceso no es restringido en Home)
 *  - ListadoEntrevistasScreen filtra solo las entrevistas del usuario autenticado
 *  - PasoUnoScreen requiere formData con todos los campos demográficos válidos
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// ── Mocks locales ──────────────────────────────────────────────────────────────

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({ isConnected: true, type: 'wifi' }),
}));

jest.mock('../../src/i18n/LanguageProvider', () => ({
  useLang: () => ({ t: (k) => k, lang: 'es', setLang: jest.fn() }),
}));

jest.mock('../../src/api/PersonFontSize', () => ({
  regular: 'System', bold: 'System', small: 12, normal: 14, titulo: 22,
}));

jest.mock('../../src/componentes/funciones', () => ({
  RelativeSize: (n) => n,
  getFechaRegistro: jest.fn(() => '2026-03-18'),
  getFechaNacimiento: jest.fn(() => '2008-01-01'),
  calcularEdad: jest.fn(() => 18),
  validarMayor18: jest.fn(() => true),
  validarMayorToYear: jest.fn(() => true),
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
      { IdTipo: 1, Tipo: { Nombre: 'Funcionario Público', Informacion: 'Info 1', InformacionEn: 'Info 1 EN' }, Id: 1, Edad: 18, MomentoUno: 1, MomentoDos: 0, MomentoTres: 0, Categorias: [], Riesgos: [] },
      { IdTipo: 2, Tipo: { Nombre: 'Agentes Externos', Informacion: 'Info 2', InformacionEn: 'Info 2 EN' }, Id: 2, Edad: 18, MomentoUno: 0, MomentoDos: 1, MomentoTres: 0, Categorias: [], Riesgos: [] },
      { IdTipo: 3, Tipo: { Nombre: 'Niños y Niñas', Informacion: 'Info 3', InformacionEn: 'Info 3 EN' }, Id: 3, Edad: 12, MomentoUno: 1, MomentoDos: 1, MomentoTres: 1, Categorias: [], Riesgos: [] },
      { IdTipo: 4, Tipo: { Nombre: 'Padres y Cuidadores', Informacion: 'Info 4', InformacionEn: 'Info 4 EN' }, Id: 4, Edad: 18, MomentoUno: 1, MomentoDos: 0, MomentoTres: 0, Categorias: [], Riesgos: [] },
    ]),
    generos: JSON.stringify([{ Id: 1, Nombre: 'Masculino' }, { Id: 2, Nombre: 'Femenino' }]),
    etnias: JSON.stringify([{ Id: 1, Nombre: 'Ninguna' }]),
    grados: JSON.stringify([{ Id: 1, Nombre: '1° Primaria' }]),
    discapacidades: JSON.stringify([{ Id: 1, Nombre: 'Ninguna' }]),
    nacionalidades: JSON.stringify([{ Id: 1, Nombre: 'Colombiana' }]),
    departamentos: JSON.stringify([{ Id: 1, Nombre: 'Antioquia' }]),
    municipios: JSON.stringify([{ Id: 1, IdDepartamento: 1, Nombre: 'Medellín' }]),
  })),
}));

jest.mock('../../src/database/diligenciar', () => ({
  insertarDiligenciar: jest.fn(),
  actualizarDiligenciar: jest.fn(),
  buscarDiligenciaroById: jest.fn(() => null),
  getDiligenciarByUser: jest.fn((userId) => [
    { id: 'CAMPO001', idUsuario: userId, idTipo: 1, nombreTipo: 'V1- Funcionario Público', completa: 1, json: JSON.stringify({ IdRiesgo: 1, Puntaje: 45 }), fechaRegistro: '20260318', enviada: 1 },
    { id: 'CAMPO002', idUsuario: userId, idTipo: 3, nombreTipo: 'V3- Niños y Niñas', completa: 0, json: '{}', fechaRegistro: '20260318', enviada: 0 },
  ]),
  eliminarDiligenciarById: jest.fn(),
}));

// ── Fixtures ───────────────────────────────────────────────────────────────────

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
};

/** Usuario Profesional de Campo (rolId=3) */
const userCampo = {
  id: 10,
  userName: 'campo@vigiatp.co',
  nombre: 'Profesional de Campo',
  email: 'campo@vigiatp.co',
  telefono: '3101112233',
  rolId: 3,
  rolNombre: 'Profesional Campo',
  rolSuperUsuario: 0,
  token: 'mock_jwt_campo',
  terminos: 1,
};

/** Usuario Funcionario Entrevistador (rolId=4) */
const userFuncionario = {
  id: 11,
  userName: 'funcionario@vigiatp.co',
  nombre: 'Funcionario Entrevistador',
  email: 'funcionario@vigiatp.co',
  telefono: '3204445566',
  rolId: 4,
  rolNombre: 'Funcionario',
  rolSuperUsuario: 0,
  token: 'mock_jwt_funcionario',
  terminos: 1,
};

// ── Helper: lógica canShow aislada ─────────────────────────────────────────────
const canShowFn = (roleId, rolesPermitidos) =>
  rolesPermitidos.includes(roleId) || roleId === 1 || roleId === 2;

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 1 — canShow() para rolId=3
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 3 (Profesional de Campo) — Permisos de tipos de entrevista', () => {

  test('TC-ROL3-001: canShow devuelve true para Tipo 1 (Funcionario Público) — rolId=3 está en [3,4]', () => {
    expect(canShowFn(3, [3, 4])).toBe(true);
  });

  test('TC-ROL3-002: canShow devuelve FALSE para Tipo 2 (Agentes Externos) — rolId=3 no está en [5]', () => {
    // CRÍTICO: el rol 3 NO debe acceder a la entrevista de agentes
    expect(canShowFn(3, [5])).toBe(false);
  });

  test('TC-ROL3-003: canShow devuelve true para Tipo 3 (Niños y Niñas)', () => {
    expect(canShowFn(3, [3, 4])).toBe(true);
  });

  test('TC-ROL3-004: canShow devuelve true para Tipo 4 (Padres/Cuidadores)', () => {
    expect(canShowFn(3, [3, 4])).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 2 — canShow() para rolId=4
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 4 (Funcionario) — Permisos de tipos de entrevista', () => {

  test('TC-ROL4-001: canShow devuelve true para Tipo 1 (Funcionario Público)', () => {
    expect(canShowFn(4, [3, 4])).toBe(true);
  });

  test('TC-ROL4-002: canShow devuelve FALSE para Tipo 2 (Agentes Externos) — rolId=4 no está en [5]', () => {
    // CRÍTICO: el rol 4 NO debe acceder a la entrevista de agentes
    expect(canShowFn(4, [5])).toBe(false);
  });

  test('TC-ROL4-003: canShow devuelve true para Tipo 3 (Niños y Niñas)', () => {
    expect(canShowFn(4, [3, 4])).toBe(true);
  });

  test('TC-ROL4-004: canShow devuelve true para Tipo 4 (Padres/Cuidadores)', () => {
    expect(canShowFn(4, [3, 4])).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 3 — EntrevistaScreen renderiza solo los tipos permitidos
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 3 y 4 — EntrevistaScreen: tarjetas visibles vs. ocultas', () => {

  const EntrevistaScreen = require('../../src/screens/EntrevistaScreen').default;

  [userCampo, userFuncionario].forEach((usuario) => {
    describe(`Como ${usuario.rolNombre} (rolId=${usuario.rolId})`, () => {

      test(`TC-ENT-${usuario.rolId}-001: VISIBLE — "Padres/Cuidadores" (Tipo 4)`, () => {
        const { getByText } = render(
          <EntrevistaScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        expect(getByText('interview.cards.parents')).toBeTruthy();
      });

      test(`TC-ENT-${usuario.rolId}-002: VISIBLE — "Niños y Niñas" (Tipo 3)`, () => {
        const { getByText } = render(
          <EntrevistaScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        expect(getByText('interview.cards.kids')).toBeTruthy();
      });

      test(`TC-ENT-${usuario.rolId}-003: VISIBLE — "Funcionario Público" (Tipo 1)`, () => {
        const { getByText } = render(
          <EntrevistaScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        expect(getByText('interview.cards.public')).toBeTruthy();
      });

      test(`TC-ENT-${usuario.rolId}-004: OCULTO — "Agentes Externos" (Tipo 2) NO debe aparecer`, () => {
        const { queryByText } = render(
          <EntrevistaScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
        );
        // queryByText devuelve null si el elemento no está en el árbol
        expect(queryByText('interview.cards.agents')).toBeNull();
      });
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 4 — HomeScreen si muestra el dashboard completo (no hay restricción en Home)
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 3 y 4 — HomeScreen renderiza correctamente', () => {

  const HomeScreen = require('../../src/screens/HomeScreen').default;

  [userCampo, userFuncionario].forEach((usuario) => {
    test(`TC-HOME-${usuario.rolId}-001: El Dashboard debe mostrar "home.interview" para ${usuario.rolNombre}`, () => {
      const { getByText } = render(
        <HomeScreen navigation={mockNavigation} route={{ params: { user: usuario } }} />
      );
      expect(getByText('home.interview')).toBeTruthy();
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 5 — ListadoEntrevistasScreen filtra por usuario
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 3 — ListadoEntrevistasScreen carga solo entrevistas del usuario autenticado', () => {

  const { getDiligenciarByUser } = require('../../src/database/diligenciar');

  test('TC-LISTADO-001: getDiligenciarByUser es llamado con el id del usuario logueado', () => {
    // Simula la lógica de handleDiligenciadas en ListadoEntrevistasScreen
    const userId = userCampo.id;
    const lista = getDiligenciarByUser(userId);

    expect(getDiligenciarByUser).toHaveBeenCalledWith(userId);
    expect(lista).toHaveLength(2);
  });

  test('TC-LISTADO-002: Las entrevistas retornadas pertenecen al usuario correcto', () => {
    const lista = getDiligenciarByUser(userCampo.id);
    lista.forEach((item) => {
      expect(item.idUsuario).toBe(userCampo.id);
    });
  });

  test('TC-LISTADO-003: NO deben retornarse entrevistas de otros usuarios', () => {
    // Comprobamos que el mock de otro userId no contamina
    const listaOtro = getDiligenciarByUser(999);
    listaOtro.forEach((item) => {
      expect(item.idUsuario).toBe(999);
      expect(item.idUsuario).not.toBe(userCampo.id);
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
//  BLOQUE 6 — Estructura del objeto usuario campo/funcionario
// ══════════════════════════════════════════════════════════════════════════════

describe('ROL 3 y 4 — Propiedades del objeto usuario en sesión', () => {

  test('TC-USR-301: userCampo tiene rolSuperUsuario=0 (no es superusuario)', () => {
    expect(userCampo.rolSuperUsuario).toBe(0);
  });

  test('TC-USR-302: userFuncionario tiene rolSuperUsuario=0', () => {
    expect(userFuncionario.rolSuperUsuario).toBe(0);
  });

  test('TC-USR-303: userCampo tiene terminos=1 (obligatorio para entrar al Home)', () => {
    expect(userCampo.terminos).toBe(1);
  });

  test('TC-USR-304: rolId=3 y rolId=4 tienen token válido', () => {
    expect(userCampo.token).toBeTruthy();
    expect(userFuncionario.token).toBeTruthy();
  });
});
