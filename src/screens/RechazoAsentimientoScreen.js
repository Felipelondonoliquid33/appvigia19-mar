import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import { useLang } from "../i18n/LanguageProvider";
import { RelativeSize } from "../componentes/funciones";

import PersonFontSize from "../api/PersonFontSize";


export default function RechazoAsentimientoScreen({ navigation, route }) {
  const { user,tipo,titulo,informacion,idReg } = route.params || {};
  const usuario = user;
  const { t } = useLang();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("assentReject.title")}</Text>

        <Text style={styles.text}>{t("assentReject.p1")}</Text>
        <Text style={styles.text}>{t("assentReject.p2")}</Text>
        <Text style={styles.text}>{t("assentReject.p3")}</Text>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() =>navigation.replace('Asentimiento', { user: usuario, tipo: tipo, titulo: titulo, informacion: t("interview.terminoTexto"), idReg: idReg })}
        >
          <Text style={styles.btnText}>{t("assentReject.back")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace("Entrevista", { user })}>
          <Text style={styles.btnSecondary}>{t("assentReject.exit")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0f3b" },
  content: { padding: RelativeSize(30), paddingTop: RelativeSize(60) },
  title: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    textAlign: "center",
    marginBottom: RelativeSize(30),
  },
  text: {
    color: "white",
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    lineHeight: RelativeSize(22),
    textAlign: "center",
    marginBottom: RelativeSize(15),
  },
  btnPrimary: {
    backgroundColor: "#ff008c",
    padding: RelativeSize(14),
    borderRadius: RelativeSize(12),
    marginTop: RelativeSize(20),
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
  },
  btnSecondary: {
    color: "white",
    textAlign: "center",
    marginTop: RelativeSize(20),
    textDecorationLine: "underline",
  },
});
