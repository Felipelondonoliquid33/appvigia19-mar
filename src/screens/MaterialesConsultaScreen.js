import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLang } from "../i18n/LanguageProvider";

import FooterNav from "../componentes/FooterNav";
import { RelativeSize } from '../componentes/funciones'

const dimensions = Dimensions.get('window');
import PersonFontSize from "../api/PersonFontSize";

const iwidth = Math.round(dimensions.width * 0.40);
const iheight = Math.round(iwidth * 0.87);

export default function MaterialesConsultaScreen({ navigation, route }) {
  const { t } = useLang();
  const { user } = route.params || {};
  const usuario = user;

  const materiales = [
    {
      id: 1,
      titulo: t("materials.items.antecedentes"),
      imagen: require("../../assets/images/material1.png"),
      page: "MaterialUno",
    },
    {
      id: 2,
      titulo: t("materials.items.conceptos"),
      imagen: require("../../assets/images/material2.png"),
      page: "MaterialDos",
    },
    // OCULTO POR SOLICITUD DEL CLIENTE — contenido disponible pero no visible en la app
    // {
    //   id: 3,
    //   titulo: t("materials.items.ampliacion"),
    //   imagen: require("../../assets/images/material3.png"),
    //   page: "MaterialTres",
    // },
    // OCULTO POR SOLICITUD DEL CLIENTE — contenido disponible pero no visible en la app
    // {
    //   id: 4,
    //   titulo: t("materials.items.rutaProteccion"),
    //   imagen: require("../../assets/images/material4.png"),
    //   page: "MaterialCuatro",
    // },
    {
      id: 5,
      titulo: t("materials.items.rutaEspecializada"),
      imagen: require("../../assets/images/material5.png"),
      page: "MaterialRutaAtencion",
    },
    {
      id: 6,
      titulo: t("materials.items.restablecimiento"),
      imagen: require("../../assets/images/material6.png"),
      page: "MaterialesSeis",
    },
  ];

  const handleAnterior = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        {/* HEADER FIJO: ícono de retroceso alineado igual en todos los celulares */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleAnterior}>
            <Image
              source={require("../../assets/iconos/retorceder.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>

        {/* CONTENIDO SCROLLEABLE */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t("materials.title")}</Text>

          {/* 📚 Grid de Materiales */}
          <View style={styles.grid}>
            {materiales.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate(item.page, {
                    user: usuario,
                  })
                }
              >
                <Image source={item.imagen} style={styles.cardImage} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* FOOTER FIJO ABAJO */}
        <FooterNav
          navigation={navigation}
          usuario={usuario}
          active="Materiales"
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

  /* HEADER (icono atrás) */
  header: {
    height: RelativeSize(48),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: RelativeSize(16),
  },
  backButton: {
    width: RelativeSize(36),
    height: RelativeSize(36),
    borderRadius: RelativeSize(18),
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
    paddingTop: RelativeSize(8),     // separación entre header y título
    paddingBottom: RelativeSize(24), // aire sobre el footer
  },

  /* TÍTULOS */
  title: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    textAlign: "center",
    marginBottom: RelativeSize(15),
  },

  /* Buscador */
  searchContainer: {
    position: "relative",
    marginBottom: RelativeSize(25),
  },
  searchInput: {
    height: RelativeSize(48),
    backgroundColor: "white",
    borderRadius: RelativeSize(10),
    paddingHorizontal: RelativeSize(15),
    paddingRight: RelativeSize(40),
  },
  searchIcon: {
    width: RelativeSize(24),
    height: RelativeSize(24),
    tintColor: "#888",
    position: "absolute",
    right: RelativeSize(12),
    top: RelativeSize(12),
  },

  /* Grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "47%",
    borderRadius: RelativeSize(12),
    marginBottom: RelativeSize(20),
    alignItems: "center",
  },
  cardImage: {
    width: iwidth,
    height: iheight,
    marginTop: RelativeSize(5),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: "cover",
  },
  cardText: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.small,
    textAlign: "center",
    paddingHorizontal: RelativeSize(8),
    paddingTop: RelativeSize(8),
    color: "#333",
  },
});
