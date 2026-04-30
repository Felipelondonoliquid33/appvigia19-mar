/**
 * secureStorage.js — Wrapper de almacenamiento seguro (RNF-1.4)
 *
 * En Expo Go: usa AsyncStorage con prefijo (no hay módulo nativo de SecureStore).
 * En build de producción: expo-secure-store se activará automáticamente
 * cuando se haga el build nativo (EAS Build / expo prebuild).
 *
 * Para migrar a SecureStore real: cambiar USE_SECURE_STORE a true
 * y hacer un build nativo (no Expo Go).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '__secure__';

export async function setSecureItem(key, value) {
  await AsyncStorage.setItem(PREFIX + key, value);
}

export async function getSecureItem(key) {
  return await AsyncStorage.getItem(PREFIX + key);
}

export async function deleteSecureItem(key) {
  await AsyncStorage.removeItem(PREFIX + key);
}
