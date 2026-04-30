import { registerRootComponent } from 'expo';

import App from './App';

// === HANDLER GLOBAL DE ERRORES ===
// Captura cualquier excepción JS fatal ANTES de que Hermes cierre la app
// Los errores aparecerán en Metro aunque la app crashee
try {
  const prevHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error(
      `=== ${isFatal ? 'FATAL' : 'ERROR'} JS ===\n` +
      `Mensaje: ${error?.message}\n` +
      `Stack: ${error?.stack?.substring(0, 600)}`
    );
    prevHandler(error, isFatal);
  });
} catch (_) {}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
