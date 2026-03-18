import React, { useEffect } from "react";

import {
    View,
    Text,
    Image,
    Dimensions,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PersonFontSize from "../api/PersonFontSize";

import FooterNav from "../componentes/FooterNav";
import { RelativeSize } from '../componentes/funciones'

const dimensions = Dimensions.get('window');

const iwidth = Math.round(dimensions.width * 0.25);

export default function MaterialVirtualUnoScreen({ navigation, route }) {
    const { user } = route.params || {};
    const usuario = user;

    const handleAnterior = async => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>

            <View style={styles.content}>

                <View style={styles.header}>
                    {/* Botón atrás (icono) */}
                    <TouchableOpacity style={styles.headerIconLeft} onPress={handleAnterior}>
                        <Image
                            source={require("../../assets/iconos/retorceder.png")}
                            style={{ width: RelativeSize(25), height: RelativeSize(25) }}
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

                    <ImageBackground
                        source={require("../../assets/images/fondo.png")}
                        style={styles.card}
                        imageStyle={styles.cardImage}
                        resizeMode="stretch">

                        {/* ETIQUETA SUPERIOR */}
                        <View style={styles.badgeWrapper}>
                            <Image
                                source={require("../../assets/images/conceptos/virtualTitulo.png")}
                                style={styles.badgeImage}
                            />
                        </View>

                        {/* TEXTO INTRODUCTORIO */}
                        <Text style={styles.paragraph}>
                            Los entornos virtuales o digitales son espacios en línea donde las personas se comunican, aprenden, juegan y comparten mediante tecnologías de información y comunicación. Para niñas, niños y adolescentes, estos espacios representan oportunidades de desarrollo, socialización y aprendizaje, pero también escenarios de riesgo cuando no cuentan con acompañamiento adulto responsable o alfabetización digital.
                        </Text>

                        {/* BLOQUE INCLUYE */}
                        <View style={styles.includeRow}>
                            <Image
                                source={require("../../assets/images/conceptos/virtualInluye.png")}
                                style={styles.includeImage}
                            />
                        </View>

                        {/* TEXTO FINAL + IMAGEN */}
                        <View style={styles.bottomRow}>
                            <View style={styles.textColumn}>
                                <Text style={styles.paragraph}>
                                    La conectividad constante y el anonimato que ofrecen estos espacios facilitan que los agresores contacten, manipulen y exploten sin necesidad de encuentro físico, lo cual dificulta la detección oportuna por parte de familias, educadores y autoridades. Según UNICEF (2024), aproximadamente uno de cada tres usuarios de internet en el mundo es una niña, niño o adolescente, y cerca del 80% en 25 países han expresado sentirse en riesgo de abuso o explotación sexual en línea.
                                </Text>
                            </View>

                            <Image
                                source={require("../../assets/images/conceptos/virtualChica.png")}
                                style={styles.personImage}
                            />
                        </View>


                    </ImageBackground>


                </ScrollView>

                {/* FOOTER FIJO ABAJO */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialVirtualUno"
                />

            </View>

        </SafeAreaView>
    );

}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#0b0f3b",
         alignItems: "center",
    },
    content: {
        flex: 1,
        backgroundColor: "#0b0f3b",
    },
    badgeWrapper: {
        alignItems: "center",
        marginBottom: RelativeSize(25),
    },

    badgeImage: {
        width: RelativeSize(220),   // ajusta según el diseño
        height: RelativeSize(50),
        resizeMode: "contain",
    },
    header: {
        height: RelativeSize(48),
        paddingHorizontal: RelativeSize(16),
        justifyContent: "center",
    },
    backIcon: {
        width: RelativeSize(25),
        height: RelativeSize(25),
        resizeMode: "contain",
    },

    scroll: {
        flex: 1, // 🔥 OBLIGATORIO
    },
    scrollInner: {
        paddingHorizontal: RelativeSize(20),
        paddingTop: RelativeSize(8),     // separación entre header y título
        paddingBottom: RelativeSize(24), // aire sobre el footer
        alignItems: "center",
        flexGrow: 1,
    },

    card: {
        borderRadius: RelativeSize(28),
        padding: RelativeSize(20),
        marginBottom: RelativeSize(30),
        overflow: "hidden",
    },
    cardImage: {
        borderRadius: RelativeSize(28),
    },

    titleImage: {
        width: "100%",
        height: RelativeSize(60),
        resizeMode: "contain",
        marginBottom: RelativeSize(20),
    },

    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(12),
        color: "#666",
        marginBottom: RelativeSize(16),
        textAlign: "justify",
    },

    includeRow: {
        alignItems: "center",
        marginVertical: RelativeSize(20),
    },
    includeImage: {
        width: "100%",
        height: Dimensions.get("window").width * 0.85,
        resizeMode: "contain",
    },

    bottomRow: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    textColumn: {
        flex: 1,
        paddingRight: RelativeSize(10),
    },
    personImage: {
        width: Dimensions.get("window").width * 0.3,
        height: Dimensions.get("window").width * 0.55,
        resizeMode: "stretch",
    },
});
