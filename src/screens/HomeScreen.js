import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import FooterNav from "../componentes/FooterNav";
import { RelativeSize } from '../componentes/funciones'
import { useLang } from "../i18n/LanguageProvider";

import PersonFontSize from "../api/PersonFontSize";

export default function HomeScreen({ navigation, route }) {
  const { t } = useLang();
  const { user } = route.params || {};
  const usuario = user;

  return (
    <View style={styles.root}>
      {/* CONTENIDO PRINCIPAL */}
      <View style={styles.container}>
        {/* Título + descripción */}
        <View style={styles.header}>
          <Text style={styles.title}>{t("home.title")}</Text>
          <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
        </View>

        {/* GRID que SIEMPRE ocupa el 50% de alto */}
        <View style={styles.gridContainer}>
          {/* FILA 1 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Entrevista", { user: usuario })}
            >
              <Image
                source={require("../../assets/iconos/formularioRosado.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>{t("home.interview")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Materiales", { user: usuario })}
            >
              <Image
                source={require("../../assets/iconos/materialesRosado.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>{t("home.materials")}</Text>
            </TouchableOpacity>
          </View>

          {/* FILA 2 */}
          <View style={[styles.row, styles.rowSpacing]}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Resultados", { user: usuario })}
            >
              <Image
                source={require("../../assets/iconos/resultadosRosado.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>{t("home.results")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Rutas", { user: usuario })}
            >
              <Image
                source={require("../../assets/iconos/rutasRosado.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>{t("home.routes")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TEXTO FINAL – SIEMPRE DEBAJO DEL GRID */}
        <Text style={styles.footerText}>{t("home.footer")}</Text>
      </View>

      {/* FOOTER FIJO ABAJO */}
      <FooterNav navigation={navigation} usuario={usuario} active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0b0f3b",
  },
  container: {
    flex: 1,
    paddingHorizontal: RelativeSize(24),
    paddingTop: RelativeSize(24),
    paddingBottom: RelativeSize(12),
    backgroundColor: "#0b0f3b",
  },
rowSpacing: {
  marginTop: RelativeSize(16),   // ← margen entre fila 1 y fila 2
},

  /* HEADER */
  header: {
    marginTop: RelativeSize(30),
    marginBottom: RelativeSize(16),
  },
  title: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    marginTop: RelativeSize(14),
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    lineHeight: RelativeSize(20),
  },

  /* GRID: 50% de la altura disponible */
  gridContainer: {
    height: "45%",              // 👈 AQUÍ está la magia
    marginTop: RelativeSize(5),
  },
  row: {
    flex: 1,                    // cada fila ocupa la mitad de gridContainer
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    marginHorizontal: RelativeSize(4),
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: RelativeSize(16),
  },
  cardIcon: {
    width: RelativeSize(50),
    height: RelativeSize(50),
    borderRadius: RelativeSize(12),
  },
  cardText: {
    marginTop: RelativeSize(10),
    textAlign: "center",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
    color: "#202020",
  },

  /* TEXTO FINAL */
  footerText: {
    marginTop: RelativeSize(14),
    color: "white",
    textAlign: "center",
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    lineHeight: RelativeSize(20),
  },
});
