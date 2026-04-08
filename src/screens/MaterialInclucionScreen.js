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

export default function MaterialInclucionScreen({ navigation, route }) {
    const { user } = route.params || {};
    const usuario = user;

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <View style={styles.content}>

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerIconLeft}
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            source={require("../../assets/iconos/retorceder.png")}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                </View>

                {/* CONTENIDO */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollInner}
                    showsVerticalScrollIndicator={false}
                >
                    <ImageBackground
                        source={require("../../assets/images/fondo.png")}
                        style={styles.card}
                        imageStyle={styles.cardImage}
                        resizeMode="stretch"
                    >

                        {/* TITULO */}
                        <Image
                            source={require("../../assets/images/otras/inclucionTitulo.png")}
                            style={styles.tituloImage}
                        />

                        {/* TEXTO */}
                        <Text style={styles.paragraph}>
                            Solicitar a las gobernaciones y/o alcaldías, con copia a
                            los comités departamentales, distritales y/o municipales
                            para la lucha contra la trata de personas, la oferta para
                            la vinculación del niño, niña o adolescente a los diferentes
                            programas alusivos a deporte, recreación y cultura con los
                            que cuente el territorio y que sean de interés del menor de
                            edad.
                        </Text>

                        <Text style={styles.paragraph}>
                            Estas acciones se pueden desarrollar en el marco de la
                            participación en la creación de los planes de desarrollo
                            de los municipios y departamentos
                        </Text>

                        {/* FONDO INFERIOR */}
                        <View style={styles.backgroundBottom}>
                            <Image
                                source={require("../../assets/images/otras/inclucionBackgorund.png")}
                                style={styles.bottomBackground}
                            />
                        </View>

                    </ImageBackground>
                </ScrollView>

                {/* FOOTER */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialInclucion"
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
    backIcon: {
        width: RelativeSize(25),
        height: RelativeSize(25),
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

    /* CARD */
    card: {
        borderRadius: RelativeSize(28),
        padding: RelativeSize(20),
        overflow: "hidden",
    },
    cardImage: {
        borderRadius: RelativeSize(28),
    },

    /* TITULO */
    tituloImage: {
        width: "100%",
        height: RelativeSize(70),
        resizeMode: "stretch",
        marginBottom: RelativeSize(20),
    },

    /* TEXTO */
    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(15),
        color: "#666",
        textAlign: "justify",
        marginBottom: RelativeSize(12),
    },

    backgroundBottom: {
        width: "100%",
        marginTop: RelativeSize(12),
    },
    /* IMAGEN FONDO INFERIOR */
    bottomBackground: {
        width: "100%",
        height: RelativeSize(200),
        resizeMode: "stretch",
        borderBottomLeftRadius: RelativeSize(28),
        borderBottomRightRadius: RelativeSize(28),
    },
});
