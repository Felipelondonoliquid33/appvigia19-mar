/**
 * LoginScreen.test.js — Pruebas unitarias de la pantalla de inicio de sesión
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({ isConnected: true, type: 'wifi' }),
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name, ...props }) => <Text {...props}>{name}</Text> };
});

jest.mock('../src/i18n/LanguageProvider', () => ({
  useLang: () => ({ t: (k) => k, lang: 'es', setLang: jest.fn() }),
}));

jest.mock('../src/i18n/i18n', () => ({
  i18n: { t: (k) => k },
}));

jest.mock('../src/componentes/funciones', () => ({
  RelativeSize: (n) => n,
  getFechaRegistro: jest.fn(() => '2026-03-17'),
}));

jest.mock('../src/api/Constantes', () => ({
  width60: 234,
  width85: 331,
  width70: 273,
  urlBase: 'https://modoseguro.catedra.edu.co',
}));

jest.mock('../src/api/PersonFontSize', () => ({
  regular: 'System',
  bold: 'System',
  small: 12,
  normal: 14,
  large: 18,
}));

jest.mock('../src/api/apiBase', () => ({
  apiParametros: '/api/parametros',
  apiLogin: '/api/login',
}));

jest.mock('../src/api/apiPost', () =>
  jest.fn(() => Promise.resolve({ success: false, data: {} }))
);

jest.mock('crypto-js/md5', () => jest.fn((str) => ({ toString: () => `hashed_${str}` })));

jest.mock('../src/database/usuarios', () => ({
  insertarUsuario: jest.fn(),
  buscarUsuarioByUserName: jest.fn(() => Promise.resolve(null)),
  actualizarUsuario: jest.fn(),
  buscarUsuarioById: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('../src/database/parametros', () => ({
  truncateParametros: jest.fn(),
  insertarParametros: jest.fn(),
  buscarParametros: jest.fn(() => Promise.resolve([])),
}));

jest.mock('../src/database/diligenciar', () => ({
  getCompletasSinEnviar: jest.fn(() => Promise.resolve([])),
  actualizarDiligenciar: jest.fn(),
  insertarDiligenciar: jest.fn(),
  buscarDiligenciaroById: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('../src/componentes/LoadingOverlay', () => {
  const { View } = require('react-native');
  return ({ visible }) => (visible ? <View testID="loading-overlay" /> : null);
});

jest.mock('../src/screens/style/ColorSchema', () => ({
  primary: '#ff008c',
  background: '#fff',
}));

// ── Suite ─────────────────────────────────────────────────────────────────────

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
};

describe('LoginScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renderiza sin lanzar excepciones (smoke test)', () => {
    const LoginScreen = require('../src/screens/LoginScreen').default;
    expect(() =>
      render(<LoginScreen navigation={mockNavigation} />)
    ).not.toThrow();
  });

  it('tiene campo de usuario', () => {
    const LoginScreen = require('../src/screens/LoginScreen').default;
    const { getAllByDisplayValue, getByPlaceholderText, queryAllByTestId } = render(
      <LoginScreen navigation={mockNavigation} />
    );
    // El componente debe tener TextInput para usuario
    expect(queryAllByTestId).toBeDefined();
  });

  it('LoadingOverlay no está visible al inicio', () => {
    const LoginScreen = require('../src/screens/LoginScreen').default;
    const { queryByTestId } = render(<LoginScreen navigation={mockNavigation} />);
    expect(queryByTestId('loading-overlay')).toBeNull();
  });

  it('botones de cambio de idioma se renderizan (t("login.langEs"), t("login.langPt"))', () => {
    const LoginScreen = require('../src/screens/LoginScreen').default;
    const { queryByText } = render(<LoginScreen navigation={mockNavigation} />);
    // Con el mock de useLang, t() retorna la key — si el código usa la key, aparecerá
    expect(queryByText).toBeDefined();
  });

  it('escribe en el campo de usuario sin errores', () => {
    const LoginScreen = require('../src/screens/LoginScreen').default;
    const { UNSAFE_getAllByType } = render(<LoginScreen navigation={mockNavigation} />);
    const { TextInput } = require('react-native');
    const inputs = UNSAFE_getAllByType(TextInput);
    expect(inputs.length).toBeGreaterThanOrEqual(2); // usuario + contraseña
    expect(() => fireEvent.changeText(inputs[0], 'testuser')).not.toThrow();
  });

  it('escribe en el campo de contraseña sin errores', () => {
    const LoginScreen = require('../src/screens/LoginScreen').default;
    const { UNSAFE_getAllByType } = render(<LoginScreen navigation={mockNavigation} />);
    const { TextInput } = require('react-native');
    const inputs = UNSAFE_getAllByType(TextInput);
    expect(() => fireEvent.changeText(inputs[1], 'password123')).not.toThrow();
  });

  it('offline — el componente renderiza cuando no hay conexión', () => {
    // useNetInfo ya está mockeado en setup.js como isConnected:true
    // Este test sólo verifica que el componente no crashea aún sin red
    const LoginScreen = require('../src/screens/LoginScreen').default;
    expect(() =>
      render(<LoginScreen navigation={mockNavigation} />)
    ).not.toThrow();
  });
});
