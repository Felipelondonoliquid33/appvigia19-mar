import React, { useMemo } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { useLang } from "../i18n/LanguageProvider";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useResponsive } from "../utils/responsive";

export default function FooterNav({ navigation, usuario, active, validarAccion, stylePosition }) {
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const { rSpace, rFont, minTouchSize, screenInfo } = useResponsive();
  
  // Estilos dinámicos calculados con las dimensiones actuales
  const dynamicStyles = useMemo(() => ({
    container: {
      width: '100%',
      flexDirection: "row",
      backgroundColor: "#ff008c",
      justifyContent: "space-around",
      alignItems: "center",
      paddingHorizontal: rSpace(8),
      paddingBottom: Math.max(insets.bottom, rSpace(12)),
      paddingTop: rSpace(10),
      // Sombra sutil para separar del contenido
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    item: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      minWidth: minTouchSize(44),
      paddingVertical: rSpace(4),
      paddingHorizontal: rSpace(2),
    },
    icon: {
      width: rSpace(24),
      height: rSpace(24),
      minWidth: 20,
      minHeight: 20,
    },
    label: {
      color: "white",
      // Fuente más pequeña en pantallas compactas, normal en otras
      fontSize: rFont(screenInfo.isCompact ? 9 : screenInfo.isLarge ? 12 : 10),
      marginTop: rSpace(3),
      textAlign: "center",
      // Permitir que el texto se envuelva si es necesario
      flexWrap: 'wrap',
      includeFontPadding: false,
    },
  }), [rSpace, rFont, minTouchSize, screenInfo, insets.bottom]);

  const validarYNavegar = (ruta) => {
    // Si no se envió validador, navega normal
    if (!validarAccion) { 
      navigation.navigate(ruta, { user: usuario });
      return;
    }

    // Ejecuta validador → debe devolver true/false
    const ok = validarAccion(ruta);

    if (ok) {
      navigation.navigate(ruta, { user: usuario });
    }
  };


  return (
    <View style={dynamicStyles.container}>

      <TouchableOpacity
        style={dynamicStyles.item}
        onPress={() => validarYNavegar("Home")}
      >
        <Image
          source={require("../../assets/iconos/inicio.png")}
          style={[dynamicStyles.icon, active === "home" && staticStyles.activeIcon]}
        />
        <Text 
          style={dynamicStyles.label}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {t("footer.home")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.item}
        onPress={() => validarYNavegar("Listado")}
      >
        <Image
          source={require("../../assets/iconos/formulario.png")}
          style={[dynamicStyles.icon, active === "entrevista" && staticStyles.activeIcon]}
        />
        <Text 
          style={dynamicStyles.label}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {t("footer.interview")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.item}
        onPress={() => validarYNavegar("Resultados")}
      >
        <Image
          source={require("../../assets/iconos/resultados.png")}
          style={[dynamicStyles.icon, active === "resultados" && staticStyles.activeIcon]}
        />
        <Text 
          style={dynamicStyles.label}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {t("footer.results")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.item}
        onPress={() => validarYNavegar("Materiales")}
      >
        <Image
          source={require("../../assets/iconos/materiales.png")}
          style={[dynamicStyles.icon, active === "materiales" && staticStyles.activeIcon]}
        />
        <Text 
          style={dynamicStyles.label}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {t("footer.materials")}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

// Solo estilos estáticos que no necesitan escalado
const staticStyles = StyleSheet.create({
  activeIcon: {
    tintColor: "#ffe6f7",
  },
});
