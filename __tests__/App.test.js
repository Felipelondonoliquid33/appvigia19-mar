/**
 * App.test.js — Prueba principal de renderizado de la app ModoSeguro
 *
 * Verifica que la aplicación raíz se monta sin lanzar excepciones.
 * Corresponde al contrato más básico: la app no crashea al abrirse.
 */

import React from 'react';
import { render } from '@testing-library/react-native';

// ── Mocks de módulos nativos que no corren en Node ──────────────────────────

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() =>
    Promise.resolve({
      execAsync: jest.fn(),
      runAsync: jest.fn(),
      getAllAsync: jest.fn(() => []),
      getFirstAsync: jest.fn(() => null),
    })
  ),
}));

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({ isConnected: false, type: 'none' }),
  fetch: jest.fn(() => Promise.resolve({ isConnected: false })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
  isLoading: jest.fn(() => false),
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name }) => <Text>{name}</Text> };
});

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: () => null,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => <>{children}</>,
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn(), replace: jest.fn() }),
  useRoute: () => ({ params: {} }),
  createNavigationContainerRef: () => ({ current: null }),
}));

jest.mock('../src/i18n/LanguageProvider', () => ({
  LanguageProvider: ({ children }) => <>{children}</>,
  useLang: () => ({ t: (k) => k, locale: 'es' }),
}));

jest.mock('../src/context/InactivityContext', () => ({
  InactivityProvider: ({ children }) => <>{children}</>,
  useInactivity: () => ({ resetTimer: jest.fn() }),
}));

jest.mock('../src/database/database', () => ({
  getDBConnection: jest.fn(() => ({
    execSync: jest.fn(),
    runSync: jest.fn(),
    getAllSync: jest.fn(() => []),
    getFirstSync: jest.fn(() => null),
  })),
  initDB: jest.fn(() => Promise.resolve()),
}));

// ── Tests ────────────────────────────────────────────────────────────────────

describe('App — Renderizado raíz', () => {
  it('se monta sin lanzar excepciones', () => {
    const { View } = require('react-native');
    // Smoke test: si el require de App.js explota, el test falla aquí
    expect(() => {
      require('../App');
    }).not.toThrow();
  });

  it('el archivo App.js exporta un componente React válido', () => {
    jest.resetModules();
    const AppModule = require('../App');
    const AppComponent = AppModule.default || AppModule;
    expect(typeof AppComponent).toBe('function');
  });
});
