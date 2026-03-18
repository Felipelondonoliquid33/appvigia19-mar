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

import FooterNav from "../componentes/FooterNav";
import { RelativeSize } from '../componentes/funciones'

const dimensions = Dimensions.get('window');

import PersonFontSize from "../api/PersonFontSize";


export default function MaterialAmpliacionTresScreen({ navigation, route }) {
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
                                source={require("../../assets/images/ampliacion/proteccionTitulo.png")}
                                style={styles.badgeImage}
                            />
                        </View>

                        {/* BLOQUE IMAGEN + TEXTO */}
                        <View style={styles.rowContent}>
                            <Image
                                source={require("../../assets/images/ampliacion/proteccionBaile.png")}
                                style={styles.leftPerson}
                            />

                            <Text style={styles.paragraphRight}>
                                La autoridad administrativa podrá identificar, si se requiere: solicitud
                                de refugio, declaración de apatridia, trámite del Permiso de Protección
                                Temporal (PPT), entre otras acciones encaminadas a garantizar los
                                derechos de la niñez y adolescencia migrante.
                            </Text>
                        </View>

                        {/* ETIQUETA SUPERIOR */}
                        <View style={styles.badgeWrapper}>
                            <Image
                                source={require("../../assets/images/ampliacion/proteccionSubTitulo.png")}
                                style={styles.badgeImage2}
                            />
                        </View>

                        <Text style={styles.paragraphRight}>
                            La autoridad puede gestionar:
                        </Text>

                        {/* IMAGEN INFERIOR */}
                        <Image
                            source={require("../../assets/images/ampliacion/proteccionListado.png")}
                            style={styles.bottomImage}
                            resizeMode="stretch"
                        />


                    </ImageBackground>


                </ScrollView>

                {/* FOOTER FIJO ABAJO */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialAmpliacionTres"
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
    rowContent: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: RelativeSize(24),
    },

    leftPerson: {
        width: Dimensions.get("window").width * 0.28,
        height: Dimensions.get("window").width * 0.45,
        resizeMode: "contain",
        marginRight: RelativeSize(12),
    },

    paragraphRight: {
        flex: 1,
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(14),
        color: "#666",
        textAlign: "justify",
    },

    bottomImage: {
        width: Dimensions.get("window").width * 0.7,
        height: Dimensions.get("window").width * 0.8,
        alignSelf: "center",
        resizeMode: "stretch",
        marginTop: RelativeSize(10),
    },
    badgeImage: {
        width: RelativeSize(220),   // ajusta según el diseño
        height: RelativeSize(50),
        resizeMode: "contain",
    },
    badgeImage2: {
        width: RelativeSize(220),   // ajusta según el diseño
        height: RelativeSize(60),
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
        height: Dimensions.get("window").width * 0.55,
        resizeMode: "stretch",
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
