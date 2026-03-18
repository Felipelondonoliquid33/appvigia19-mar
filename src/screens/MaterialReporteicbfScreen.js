import React from "react";
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

import FooterNav from "../componentes/FooterNav";
import { RelativeSize } from "../componentes/funciones";

import PersonFontSize from "../api/PersonFontSize";

export default function MaterialReporteicbfScreen({ navigation, route }) {
    const { user } = route.params || {};
    const usuario = user;

    const handleAnterior = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <View style={styles.content}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerIconLeft}
                        onPress={handleAnterior}
                    >
                        <Image
                            source={require("../../assets/iconos/retorceder.png")}
                            style={{
                                width: RelativeSize(25),
                                height: RelativeSize(25),
                            }}
                        />
                    </TouchableOpacity>
                </View>

                {/* CONTENIDO */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollInner}
                >
                    <ImageBackground
                        source={require("../../assets/images/fondo.png")}
                        style={styles.card}
                        imageStyle={styles.cardImage}
                        resizeMode="stretch"
                    >
                        {/* TÍTULO */}
                        <View style={styles.badgeWrapper}>
                            <Image
                                source={require("../../assets/images/otras/reporteicbfTitulo.png")}
                                style={styles.badgeImage}
                            />
                        </View>

                        {/* TEXTO DEBAJO DEL TÍTULO */}
                        <Text style={styles.paragraph}>
                            El Instituto Colombiano de Bienestar Familiar (ICBF) dispone
                            de canales oficiales para reportar situaciones que vulneren
                            los derechos de niños, niñas y adolescentes, permitiendo una
                            atención oportuna y la activación de rutas de protección
                            integral.
                        </Text>

                        <Text style={styles.paragraph2}>
                            Estos canales están diseñados para recibir información de
                            manera segura y confidencial, garantizando el seguimiento de
                            cada caso conforme a la normativa vigente.
                        </Text>

                        {/* FONDO INFERIOR */}
                        <View style={styles.backgroundBottom}>
                            <Image
                                source={require("../../assets/images/otras/reporteicbfBackgorund.png")}
                                style={styles.bottomBackground}
                            />
                        </View>
                    </ImageBackground>
                </ScrollView>

                {/* FOOTER */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialReporteicb"
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
    content: {
        flex: 1,
        backgroundColor: "#0b0f3b",
    },

    /* HEADER */
    header: {
        height: RelativeSize(48),
        justifyContent: "center",
        paddingHorizontal: RelativeSize(16),
    },

    /* SCROLL */
    scrollInner: {
        paddingHorizontal: RelativeSize(25),
        paddingBottom: RelativeSize(30),
    },

    /* TARJETA */
    card: {
        borderRadius: RelativeSize(28),
        overflow: "hidden",
        paddingTop: RelativeSize(20),
        paddingHorizontal: RelativeSize(20),
        paddingBottom: RelativeSize(0), // importante
    },

    cardImage: {
        borderRadius: RelativeSize(28),
    },

    /* TÍTULO */
    badgeWrapper: {
        alignItems: "center",
        marginBottom: RelativeSize(20),
    },

    badgeImage: {
        width: RelativeSize(300),
        height: RelativeSize(70),
        resizeMode: "contain",
    },

    /* TEXTO */
    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(15),
        color: "#666",
        textAlign: "justify",
        marginBottom: RelativeSize(10),
    },
    /* TEXTO */
    paragraph2: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.normal,
        lineHeight: RelativeSize(15),
        color: "#666",
        textAlign: "justify",
        marginBottom: RelativeSize(170),
    },
    backgroundBottom: {
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
    },
    /* IMAGEN FONDO INFERIOR */
    bottomBackground: {
        width: Dimensions.get("window").width * 0.95,
        height: RelativeSize(170),
        resizeMode: "stretch",
    },
});
