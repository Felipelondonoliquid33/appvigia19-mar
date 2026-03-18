import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useLang } from "../i18n/LanguageProvider";

import { RelativeSize } from '../componentes/funciones'

import PersonFontSize from "../api/PersonFontSize";


export default function ConsentimientoRechazadoScreen({ navigation, route }) {
    const { t } = useLang();
    const { user } = route.params || {};
    const usuario = user;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Icono */}
        <Image
          source={require("../../assets/iconos/prohibido.png")}
          style={styles.icon}
        />

        {/* Título */}
        <Text style={styles.title}>{t("rejected.title")}</Text>

        {/* Subtexto */}
        <Text style={styles.paragraph}>{t("rejected.p1")}{" "}
          <Text style={styles.bold}>{t("rejected.consent")}</Text>
        </Text>

        <Text style={styles.paragraph}>{t("rejected.p2")}</Text>

        <Text style={[styles.paragraph, styles.question]}>{t("rejected.question")}</Text>

        {/* Botón Volver */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Terminos", { user })}
        >
          <Text style={styles.buttonText}>{t("rejected.back")}</Text>
        </TouchableOpacity>

        {/* Salir */}
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.exitText}>{t("rejected.exit")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f3b",
    paddingHorizontal: RelativeSize(30),
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: RelativeSize(60),
    paddingBottom: RelativeSize(60),
  },

  icon: {
    width: RelativeSize(90),
    height: RelativeSize(90),
    tintColor: "#ff0099",
    resizeMode: "contain",
    marginBottom: RelativeSize(25),
  },

  title: {
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    color: "white",
    textAlign: "center",
    lineHeight: RelativeSize(28),
    marginBottom: RelativeSize(35),
  },

  paragraph: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "white",
    textAlign: "center",
    lineHeight: RelativeSize(22),
    marginBottom: RelativeSize(15),
  },

  bold: {
    fontWeight: "bold",
  },

  question: {
    marginTop: RelativeSize(15),
    fontWeight: "bold",
    textDecorationLine: "none",
  },

  button: {
    backgroundColor: "#ff0099",
    width: "80%",
    height: RelativeSize(48),
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: RelativeSize(20),
    marginBottom: RelativeSize(25),
  },

  buttonText: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
  },

  exitText: {
    color: "white",
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    textDecorationLine: "underline",
  },
});
