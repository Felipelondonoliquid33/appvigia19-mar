import React, { useEffect } from "react";
import { Image, View, Text, StyleSheet } from "react-native";

import ApiBase from "../api/apiBase";
import apiPost from "../api/apiPost";

import ColorShema from "./style/ColorSchema";
import Constantes from "../api/Constantes";

import PersonFontSize from "../api/PersonFontSize";

import { RelativeSize } from "../componentes/funciones";

import { truncateCatalogo, insertarCatalogo } from "../database/catalogos";
import { truncateMaterial, insertarMaterial } from "../database/materiales";

import { useNetInfo } from "@react-native-community/netinfo";

import { useLang } from "../i18n/LanguageProvider";

const fwidth = Constantes.width70;
const fheight = (fwidth * 49) / 100;

export default function WelcomeScreen({ navigation }) {
  const netInfo = useNetInfo();
  const { t } = useLang();

  useEffect(() => {
    if (!netInfo.isConnected) {
      const timer = setTimeout(() => {
        navigation.replace("Login");
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      handleCatalogos();
    }
  }, [netInfo.isConnected]);

  const handleCatalogos = async () => {
    const body = [];
    let result = await apiPost(ApiBase.apiCatalogos, body);
    result = await apiPost(ApiBase.apiCatalogos, body);

    if (result.success) {
      try {
        truncateCatalogo();
      } catch (ex) {}

      try {
        insertarCatalogo(
          result.data.departamentos,
          result.data.municipios,
          result.data.nacionalidades,
          result.data.asentamiento,
          result.data.entrevistas,
          result.data.generos,
          result.data.grados,
          result.data.etnias,
          result.data.discapacidades,
          result.data.riesgos
        );
      } catch (ex) {}

      try {
        truncateMaterial();
      } catch (ex) {}

      try {
        let materiales = JSON.parse(result.data.materiales);

        if (materiales && materiales.length > 0) {
          for (let i = 0; i < materiales.length; i++) {
            let reg = materiales[i];
            try {
              insertarMaterial(reg);
            } catch (e) {}
          }
        }
      } catch (ex) {}
    }

    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3000);

    return () => clearTimeout(timer);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/icbfblanco.png")}
        resizeMode="contain"
        style={{ width: fwidth, height: fheight }}
      />

      <Text style={styles.title}>{t("welcome.title")}</Text>
      <Text style={styles.segundo}>{t("welcome.message")}</Text>

      <Image
        source={require("../../assets/splash.png")}
        resizeMode="contain"
        style={{ width: fwidth, height: fheight }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ColorShema.FONDO,
  },
  title: {
    fontFamily: PersonFontSize.bold,
    fontSize:  PersonFontSize.wtitulo,
    color: ColorShema.BLANCO,
    marginTop:  RelativeSize(8),
    textAlign: "center", 
  },
  segundo: {
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.medium,
    color: ColorShema.BLANCO,
    textAlign: "center",
    marginTop: Constantes.height05,
  },
});
