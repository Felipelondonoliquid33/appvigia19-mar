import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // 👈 IMPORTANTE
import { useLang } from "../i18n/LanguageProvider";

import FooterNav from "../componentes/FooterNav";
import { buscarCatalogo } from "../database/catalogos";
import { RelativeSize } from '../componentes/funciones'
import PersonFontSize from "../api/PersonFontSize";

export default function EntrevistaScreen({ navigation, route }) {
  const { t, lang } = useLang();
  const { user } = route.params || {};
  const usuario = user; 
  const roleId = user.rolId;
  const [modalVisible, setModalVisible] = useState(false);

  const terminosTexto = t("interview.terminoTexto");

  const canShow = (rolesPermitidos) => {
    return rolesPermitidos.includes(roleId) || roleId === 1 || roleId === 2;
  };

  const handleEntrevista = async (tipo) => {
    let catalogos = buscarCatalogo();
    if (catalogos != null) {
      let entrevistas = JSON.parse(catalogos.entrevistas);
      let esta = false;
      let regTipo = null;

      for (const item of entrevistas) {
        if (item.IdTipo == tipo) {
          esta = true;
          regTipo = item.Tipo;
        }
      }

      if (!esta) {
        Alert.alert(
          t("interview.warn"),
          t("interview.noConfigured")
        );
      } else {
        let titulo = "";
        if (tipo == 1) {
          titulo = t("interview.navTitles.public");
        } else if (tipo == 2) {
          titulo = t("interview.navTitles.agents");
        } else if (tipo == 3) {
          titulo = t("interview.navTitles.kids");
        } else {
          titulo = t("interview.navTitles.parents");
        }

        let info = "";
        if(lang == "es") {
          info = regTipo.Informacion;
        } else {
          info = regTipo.InformacionEn;
        }


        navigation.navigate("Instruccion", {
          user: usuario,
          tipo,
          titulo,
          informacion: info,
        });
      }
    }
  };

  const handleAnterior = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        {/* HEADER: solo icono atrás */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleAnterior}>
            <Image
              source={require("../../assets/iconos/retorceder.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          {/* si quisieras título arriba, podrías ponerlo aquí */}
        </View>

        {/* CONTENIDO SCROLLEABLE */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollInner}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t("interview.title")}</Text>

          <Text style={styles.subtitle}>{t("interview.subtitle")}</Text>

          {canShow([3, 4]) && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleEntrevista(4)}
            >
              <Image
                source={require("../../assets/iconos/entmadres.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>{t("interview.cards.parents")}</Text>
            </TouchableOpacity>
          )}

          {canShow([3, 4]) && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleEntrevista(3)}
            >
              <Image
                source={require("../../assets/iconos/entninos.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>{t("interview.cards.kids")}</Text>
            </TouchableOpacity>
          )}


          {canShow([3, 4]) && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleEntrevista(1)}
            >
              <Image
                source={require("../../assets/iconos/entfuncionario.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>{t("interview.cards.public")}</Text>
            </TouchableOpacity>
          )}

          {canShow([5]) && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleEntrevista(2)}
            >
              <Image
                source={require("../../assets/iconos/entagente.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>{t("interview.cards.agents")}</Text>
            </TouchableOpacity>
          )}


        </ScrollView>

        {/* MODAL */}
        <Modal animationType="slide" visible={modalVisible}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Instrucciones</Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>{terminosTexto}</Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* FOOTER FIJO ABAJO */}
        <FooterNav
          navigation={navigation}
          usuario={usuario}
          active="Entrevista"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b0f3b",
  },
  container: {
    flex: 1,
    backgroundColor: "#0b0f3b",
  },

  /* HEADER */
  header: {
    height: RelativeSize(48),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: RelativeSize(16),
  },
  backButton: {
    width: RelativeSize(36),
    height: RelativeSize(36),
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: RelativeSize(24),
    height: RelativeSize(24),
    resizeMode: "contain",
  },

  /* SCROLL */
  scroll: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: RelativeSize(25),
    paddingBottom: RelativeSize(24),
  },

  /* TÍTULOS */
  title: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    marginTop: RelativeSize(10),
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.subtitulo,
    lineHeight: RelativeSize(22),
    marginBottom: RelativeSize(30),
  },

  /* CARDS */
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: RelativeSize(10),
    borderRadius: RelativeSize(16),
    alignItems: "center",
    marginBottom: RelativeSize(18),
  },
  cardIcon: {
    width: RelativeSize(55),
    height: RelativeSize(55),
    marginRight: RelativeSize(15),
  },
  cardText: {
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
    color: "#1f1f1f",
  },

  /* MODAL */
  modalContainer: {
    flex: 1,
    padding: RelativeSize(20),
    backgroundColor: "#0b0f3b",
  },
  modalTitle: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    marginBottom: RelativeSize(12),
  },
  modalScroll: {
    flex: 1,
  },
  modalText: {
    color: "white",
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    lineHeight: RelativeSize(22),
  },
  closeBtn: {
    backgroundColor: "#ff008c",
    padding: RelativeSize(12),
    borderRadius: RelativeSize(10),
    marginTop: RelativeSize(20),
  },
  closeText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});
