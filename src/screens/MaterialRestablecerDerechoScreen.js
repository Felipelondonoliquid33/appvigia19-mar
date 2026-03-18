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


export default function MaterialRestablecerDerechoScreen({ navigation, route }) {
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
                            source={require("../../assets/images/otras/resderechoTitulo.png")}
                            style={styles.tituloImage}
                        />

                        {/* TEXTO */}
                        <Text style={styles.paragraph}>
                            En este aspecto, se considera primordial verificar el debido
                            reporte del caso y las actualizaciones del estado de caso en la
                            plataforma SIUCE, que posibilita cualificar las acciones de
                            seguimiento, según lo establecido en la Ley 1620 de 2013.
                        </Text>

                        {/* BLOQUE SITUACIONES */}
                        <View style={styles.situacionesContainer}>

                            {/* FILA 1 */}
                            <View style={styles.situacionRow}>
                                <Image
                                    source={require("../../assets/images/otras/resderechoItemUno.png")}
                                    style={styles.situacionIcon}
                                />
                                <Text style={styles.situacionText}>
                                    Situación Tipo 1
                                </Text>
                            </View>

                            {/* FILA 2 */}
                            <View style={styles.situacionRow}>
                                <Image
                                    source={require("../../assets/images/otras/resderechoItemDos.png")}
                                    style={styles.situacionIcon}
                                />
                                <Text style={styles.situacionText}>
                                    Situación Tipo 2
                                </Text>
                            </View>

                        </View>

                        {/* FONDO INFERIOR */}
                        <View style={styles.backgroundBottom}>
                            <Image
                                source={require("../../assets/images/otras/resderechoBackgorund.png")}
                                style={styles.bottomBackground}
                            />
                        </View>

                    </ImageBackground>
                </ScrollView>

                {/* FOOTER */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialRestablecerDerecho"
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
        marginBottom: RelativeSize(25),
    },

    /* BLOQUE SITUACIONES */
    situacionesContainer: {
        marginBottom: RelativeSize(170),
    },
    situacionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: RelativeSize(18),
    },
    situacionIcon: {
        width: RelativeSize(45),
        height: RelativeSize(45),
        resizeMode: "stretch",
        marginRight: RelativeSize(12),
    },
    situacionText: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.normal,
        color: "#E53935",
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
