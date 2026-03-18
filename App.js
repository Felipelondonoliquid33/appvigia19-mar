import React, { useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from "./src/i18n/LanguageProvider";
import { View } from 'react-native'; // Añadido View

// --- IMPORTACIONES DE FUENTES ---
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Montserrat_400Regular, 
  Montserrat_700Bold 
} from '@expo-google-fonts/montserrat';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CrearScreen from './src/screens/CrearScreen';
import TerminosScreen from './src/screens/TerminosScreen';
import EntrevistaScreen from './src/screens/EntrevistaScreen';
import OlvidoContrasenaScreen from './src/screens/OlvidoContrasenaScreen';
import MaterialesConsultaScreen from './src/screens/MaterialesConsultaScreen';
import InstruccionScreen from './src/screens/InstruccionScreen';
import AsentimientoScreen from './src/screens/AsentimientoScreen';
import ConsentimientoRechazadoScreen from './src/screens/ConsentimientoRechazadoScreen';
import RechazoAsentimientoScreen from './src/screens/RechazoAsentimientoScreen';
import PasoUnoScreen from './src/screens/PasoUnoScreen';
import PasoDosScreen from './src/screens/PasoDosScreen';
import PasoTresScreen from './src/screens/PasoTresScreen';
import ListadoEntrevistasScreen from './src/screens/ListadoEntrevistasScreen';
import RutasAtencionScreen from './src/screens/RutasAtencionScreen';
import MaterialesDetalleScreen from './src/screens/MaterialesDetalleScreen';
import DetalleScreen from './src/screens/DetalleScreen';
import ResumenScreen from './src/screens/ResumenScreen';
import MaterialesUnoScreen from './src/screens/MaterialUnoScreen';
import MaterialesDosScreen from './src/screens/MaterialesDosScreen';
import MaterialVirtualUno from './src/screens/MaterialVirtualUnoScreen'
import MaterialVirtualDos from './src/screens/MaterialVirtualDosScreen';
import MaterialVirtualTres from './src/screens/MaterialVirtualTresScreen';
import MaterialVirtualCuatro from './src/screens/MaterialVirtualCuatroScreen';
import MaterialVirtualClave from './src/screens/MaterialVirtualClaveScreen';
import MaterialesTres from './src/screens/MaterialesTresScreen';
import MaterialAmpliacionUno from './src/screens/MaterialAmpliacionUnoScreen';
import MaterialAmpliacionDos from './src/screens/MaterialAmpliacionDosScreen';
import MaterialAmpliacionTres from './src/screens/MaterialAmpliacionTresScreen';
import MaterialesCuatro from './src/screens/MaterialesCuatroScreen';
import MaterialSexteo from './src/screens/MaterialesSexteoScreen';
import MaterialCiberacoso from './src/screens/MaterialCiberacosoScreen';
import MaterialReporteicbf from './src/screens/MaterialReporteicbfScreen';
import MaterialReportarVulneracion from './src/screens/MaterialReportarVuneracionScreen';
import MaterialRutaAtencion from './src/screens/MaterialRutaAtencionfScreen';
import MaterialRestablecimiento from './src/screens/MaterialRestablecimientoScreen';
import MaterialEstabilizacion from './src/screens/MaterialEstabilizacionScreen';
import MaterialSaludMental from './src/screens/MaterialSaludMentalScreen';
import MaterialAccesoJusticia from './src/screens/MaterialAccesoJusticiaScreen';
import MaterialRestablecerDerecho from './src/screens/MaterialRestablecerDerechoScreen';
import MaterialInclucion from './src/screens/MaterialInclucionScreen';
import MaterialesSeis from './src/screens/MaterialesSeisScreen';
import PasoComentarioScreen from './src/screens/PasoComentarioScreen';

import { createTables } from './src/database/schema';

// Mantener la pantalla de carga visible mientras cargan las fuentes
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  // 1. Cargar las fuentes
  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-Bold': Montserrat_700Bold,
  });

  useEffect(() => {
    createTables();
  }, []);

  // 2. Función para ocultar el Splash Screen cuando todo esté listo
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // 3. Si las fuentes no han cargado, no renderizamos nada
  if (!fontsLoaded) {
    return null;
  }  

  return (
    <LanguageProvider>
      {/* 4. Envolvemos en un View para disparar onLayoutRootView */}
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
              <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Rutas" component={RutasAtencionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Listado" component={ListadoEntrevistasScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PasoTres" component={PasoTresScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PasoDos" component={PasoDosScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PasoComentario" component={PasoComentarioScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PasoUno" component={PasoUnoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Instruccion" component={InstruccionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Asentimiento" component={AsentimientoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AsentimientoRechazo" component={RechazoAsentimientoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Olvido" component={OlvidoContrasenaScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Crear" component={CrearScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Terminos" component={TerminosScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TerminoRechazado" component={ConsentimientoRechazadoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Materiales" component={MaterialesConsultaScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialUno" component={MaterialesUnoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialDos" component={MaterialesDosScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialVirtualUno" component={MaterialVirtualUno} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialVirtualDos" component={MaterialVirtualDos} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialVirtualTres" component={MaterialVirtualTres} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialVirtualCuatro" component={MaterialVirtualCuatro} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialVirtualClave" component={MaterialVirtualClave} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialTres" component={MaterialesTres} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialAmpliacionUno" component={MaterialAmpliacionUno} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialAmpliacionDos" component={MaterialAmpliacionDos} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialAmpliacionTres" component={MaterialAmpliacionTres} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialesListado" component={MaterialesDetalleScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialDetalle" component={DetalleScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialCuatro" component={MaterialesCuatro} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialSexteo" component={MaterialSexteo} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialCiberacoso" component={MaterialCiberacoso} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialReporteicbf" component={MaterialReporteicbf} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialReportarVulneracion" component={MaterialReportarVulneracion} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialRutaAtencion" component={MaterialRutaAtencion} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialRestablecimiento" component={MaterialRestablecimiento} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialEstabilizacion" component={MaterialEstabilizacion} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialSaludMental" component={MaterialSaludMental} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialAccesoJusticia" component={MaterialAccesoJusticia} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialRestablecerDerecho" component={MaterialRestablecerDerecho} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialInclucion" component={MaterialInclucion} options={{ headerShown: false }} />
          <Stack.Screen name="MaterialesSeis" component={MaterialesSeis} options={{ headerShown: false }} />
          <Stack.Screen name="Entrevista" component={EntrevistaScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Resultados" component={ResumenScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          </Stack.Navigator> 
        </NavigationContainer>
        </SafeAreaProvider>
      </View>
    </LanguageProvider>
  );
}
