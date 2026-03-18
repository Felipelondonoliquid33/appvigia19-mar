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


export default function MaterialRestablecimientoScreen({ navigation, route }) {
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

                        {/* 2. RESTABLECIMIENTO SALUD */}
                        <View style={styles.centerBlock}>
                            <Image
                                source={require("../../assets/images/otras/restablecimientoSalud.png")}
                                style={styles.sectionImage}
                            />
                        </View>

                        {/* 3. TEXTO */}
                        <Text style={styles.paragraph}>
                            Restablecimiento del derecho a la salud.
                        </Text>

                        {/* 4. TEXTO */}
                        <Text style={styles.paragraph}>
                            El restablecimiento del derecho a la salud para niño,
                            niña o adolescente víctimas de explotación sexual en
                            contextos de trata incluidos los entornos virtuales
                            requiere acciones de valoración, protección y
                            seguimiento por parte del sector salud.
                        </Text>

                        {/* 5. VALORACIÓN MÉDICA */}
                        <View style={styles.centerBlock}>
                            <Image
                                source={require("../../assets/images/otras/restablecimientoValoracion.png")}
                                style={styles.sectionImage}
                            />
                        </View>

                        {/* 6. TEXTO */}
                        <Text style={styles.paragraph}>
                            La trata con fines de explotación sexual implica
                            traslado, desarraigo y ruptura de redes de apoyo.
                        </Text>

                        {/* 7. TEXTO */}
                        <Text style={styles.paragraph}>
                            Aun cuando la explotación se dé en entornos
                            virtuales, los profesionales de salud deben realizar:
                        </Text>

                        {/* 8. LISTADO */}
                        <View style={styles.centerBlock}>
                            <Image
                                source={require("../../assets/images/otras/restablecimientoListado.png")}
                                style={styles.listImage}
                            />
                        </View>

                    </ImageBackground>
                </ScrollView>

                {/* FOOTER */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialRestablecimiento"
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
    scroll: {
        flex: 1,
    },
    scrollInner: {
        paddingHorizontal: RelativeSize(25),
        paddingTop: RelativeSize(8),
        paddingBottom: RelativeSize(30),
    },

    /* CARD BLANCA */
    card: {
        borderRadius: RelativeSize(28),
        paddingHorizontal: RelativeSize(20),
        paddingVertical: RelativeSize(24),
        overflow: "hidden",
    },
    cardImage: {
        borderRadius: RelativeSize(28),
    },

    /* BLOQUES CENTRADOS */
    centerBlock: {
        alignItems: "center",
        marginBottom: RelativeSize(20),
    },

    /* IMÁGENES */
    titleImage: {
        width: "100%",
        height: RelativeSize(70),
        resizeMode: "contain",
    },
    sectionImage: {
        width: "100%",
        height: RelativeSize(60),
        resizeMode: "contain",
    },
    listImage: {
        width: "100%",
        height: RelativeSize(180),
        resizeMode: "contain",
    },

    /* TEXTO */
    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(16),
        color: "#666",
        textAlign: "justify",
        marginBottom: RelativeSize(16),
    },
});
