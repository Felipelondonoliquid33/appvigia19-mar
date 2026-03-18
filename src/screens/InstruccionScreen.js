import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useLang } from "../i18n/LanguageProvider";


import FooterNav from "../componentes/FooterNav";
import PersonFontSize from "../api/PersonFontSize";
import { RelativeSize } from '../componentes/funciones'



export default function InstruccionScreen({ navigation, route }) {
  const { t, lang } = useLang();
  const { user, tipo, titulo, informacion, id } = route.params || {};
  const usuario = user;

  const handleContinuar = async () => {
    navigation.replace('Asentimiento', { user: usuario, tipo: tipo, titulo: titulo, informacion: t("interview.terminoTexto"), idReg: id });
  }

  return (
    <View style={styles.container}>

      {/* Contenido scrollable */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      > 

        {/* HEADER FIJO: ícono de retroceso alineado igual en todos los celulares */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/iconos/retorceder.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={styles.title}>{titulo}</Text>

        {/* 📝 CARD INSTRUCCIONES */}
        <View style={styles.card}>

          <Text style={styles.cardTitle}>{t("instruction.usageTitle")}</Text>

          <Text style={styles.cardText}>{informacion}</Text>

        </View>

        {/* Botón Continuar */}
        <TouchableOpacity
          style={styles.btnContinuar}
          onPress={handleContinuar}
        >
          <Text style={styles.btnText}>{t("instruction.continue")}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* 🔻 Footer Component */}
      <FooterNav navigation={navigation} usuario={usuario} active="Instruccion" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f3b",
  },
  content: {
    paddingHorizontal: RelativeSize(25),
    paddingTop: RelativeSize(20),
    marginBottom: RelativeSize(20),
  },

    /* 🔙 Botón Regresar */
    backButton: {
        width: RelativeSize(30),
        height: RelativeSize(30),
        borderRadius: RelativeSize(20),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: RelativeSize(20),
        marginTop: RelativeSize(10),
    },
    backIcon: {
        width: RelativeSize(30),
        height: RelativeSize(30),
        fontWeight: "bold",
    },
    header: {
        height: RelativeSize(60),
        marginTop: RelativeSize(20),
        justifyContent: "center",
    },
  /* Título */
  title: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    textAlign: "center",
    marginBottom: RelativeSize(25),
    lineHeight: RelativeSize(28),
  },

  /* Card */
  card: {
    backgroundColor: "white",
    padding: RelativeSize(20),
    borderRadius: RelativeSize(15),
    marginBottom: RelativeSize(30),
  },
  cardTitle: {
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.subtitulo,
    marginBottom: RelativeSize(10),
    textAlign: "center",
  },
  cardText: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "#444",
    lineHeight: RelativeSize(22),
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },

  /* Botón Continuar */
  btnContinuar: {
    backgroundColor: "#ff007f",
    borderRadius: RelativeSize(10),
    paddingVertical: RelativeSize(12),
    marginBottom: RelativeSize(20),
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
  },
});
