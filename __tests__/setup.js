/**
 * setup.js — Configuración global para todos los tests de ModoSeguro
 * Se ejecuta antes de cada suite de pruebas.
 */

// Mock de expo-sqlite (no disponible en entorno Node)
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() => Promise.resolve({
    execAsync: jest.fn(),
    runAsync: jest.fn(),
    getAllAsync: jest.fn(() => []),
    getFirstAsync: jest.fn(() => null),
  })),
}));

// Mock de @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({ isConnected: true, type: 'wifi' }),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

// Mock de @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock de expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
  isLoading: jest.fn(() => false),
}));

// Mock de @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: (props) => <Text testID={props.testID}>{props.name}</Text>,
    MaterialIcons: (props) => <Text>{props.name}</Text>,
    FontAwesome: (props) => <Text>{props.name}</Text>,
  };
});

// Mock de react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});

// Mock de navegación (React Navigation)
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      replace: jest.fn(),
      reset: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
  };
});

// Mock de i18n / LanguageProvider
jest.mock('../src/i18n/LanguageProvider', () => ({
  useLang: () => ({
    t: (key) => key,
    locale: 'es',
  }),
}));

// Mock de PersonFontSize
jest.mock('../src/api/PersonFontSize', () => ({
  regular: 'System',
  bold: 'System',
  small: 12,
  normal: 14,
  large: 18,
}));

// Mock de expo-asset
jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(() => ({ downloadAsync: jest.fn(() => Promise.resolve()), uri: 'mock://asset' })),
    loadAsync: jest.fn(() => Promise.resolve()),
  },
}));

// Mock de expo-sharing
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(() => Promise.resolve()),
}));

// Mock de expo-file-system / expo-file-system/legacy
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://mock/documents/',
  cacheDirectory: 'file://mock/cache/',
  readAsStringAsync: jest.fn(() => Promise.resolve('')),
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: true, uri: 'file://mock/file' })),
  downloadAsync: jest.fn(() => Promise.resolve({ uri: 'file://mock/file' })),
  makeDirectoryAsync: jest.fn(() => Promise.resolve()),
  deleteAsync: jest.fn(() => Promise.resolve()),
  copyAsync: jest.fn(() => Promise.resolve()),
  moveAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-file-system/legacy', () => jest.requireMock('expo-file-system'));

// Suprimir warnings conocidos de dependencias externas
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('deprecated') ||
      args[0].includes('componentWillReceiveProps') ||
      args[0].includes('componentWillMount'))
  ) {
    return;
  }
  originalWarn(...args);
};
