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

export default function MaterialEstabilizacionScreen({ navigation, route }) {
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
                        {/* 1. TITULO */}
                        <View style={styles.center}>
                            <Image
                                source={require("../../assets/images/otras/estabilizacionTitulo.png")}
                                style={styles.imgTitulo}
                            />
                        </View>

                        {/* 2. TEXTO */}
                        <Text style={styles.paragraph}>
                            El restablecimiento de derechos específicos en niños,
                            niñas y adolescentes víctimas de explotación sexual
                            requiere intervenciones integrales y oportunas por
                            parte del sector salud.
                        </Text>

                        {/* 3. TEXTO */}
                        <Text style={styles.paragraph}>
                            Estas acciones deben enfocarse en la estabilización
                            física, emocional y psicológica, así como en la
                            realización de pruebas diagnósticas que permitan una
                            atención adecuada.
                        </Text>

                        {/* 4. LISTA UNO */}
                        <Image
                            source={require("../../assets/images/otras/estabilizacionListaUno.png")}
                            style={styles.imgListaUno}
                        />

                        {/* 5. DERECHOS */}
                        <Image
                            source={require("../../assets/images/otras/estabilizacionDerechos.png")}
                            style={styles.imgDerechos}
                        />

                        {/* 6. TEXTO */}
                        <Text style={styles.paragraph}>
                            Dentro del proceso de estabilización se garantiza el
                            acceso a los derechos sexuales y reproductivos, de
                            acuerdo con la normativa vigente y los enfoques de
                            protección integral.
                        </Text>

                        {/* 7. LISTA DOS */}
                        <Image
                            source={require("../../assets/images/otras/estabilizacionListaDos.png")}
                            style={styles.imgListaDos}
                        />
                    </ImageBackground>
                </ScrollView>

                {/* FOOTER */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialEstabilizacion"
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
    headerIconLeft: {
        width: RelativeSize(36),
        height: RelativeSize(36),
        justifyContent: "center",
        alignItems: "center",
    },

    /* SCROLL */
    scroll: {
        flex: 1,
    },
    scrollInner: {
        paddingHorizontal: RelativeSize(20),
        paddingBottom: RelativeSize(30),
    },

    /* CARD BLANCA */
    card: {
        borderRadius: RelativeSize(28),
        padding: RelativeSize(20),
        marginBottom: RelativeSize(30),
        overflow: "hidden",
    },
    cardImage: {
        borderRadius: RelativeSize(28),
    },

    center: {
        alignItems: "center",
        marginBottom: RelativeSize(20),
    },

    titleImage: {
        width: "90%",
        height: RelativeSize(70),
        resizeMode: "contain",
    },

    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(18),
        color: "#666",
        textAlign: "justify",
        marginBottom: RelativeSize(16),
    },

    /* ----- TITULO ----- */
    imgTitulo: {
        width: "100%",
        height: RelativeSize(70),
        marginBottom: RelativeSize(20),
        resizeMode: "stretch",        
    },

    /* ----- LISTA UNO ----- */
    imgListaUno: {
        width: "100%",
        height: RelativeSize(160),
        marginBottom: RelativeSize(20),
        resizeMode: "stretch",
    },

    /* ----- DERECHOS SEXUALES ----- */
    imgDerechos: {
        width: "100%",
        height: RelativeSize(120),
        marginBottom: RelativeSize(20),
        resizeMode: "stretch",        
    },

    /* ----- LISTA DOS ----- */
    imgListaDos: {
        width: "100%",
        height: RelativeSize(180),
        marginBottom: RelativeSize(20),
        resizeMode: "stretch",
    },
});
