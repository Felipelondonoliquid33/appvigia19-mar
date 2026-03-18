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


export default function MaterialAmpliacionDosScreen({ navigation, route }) {
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
                        resizeMode="stretch"
                    >

                        {/* TÍTULO */}
                        <View style={styles.badgeWrapper}>
                            <Image
                                source={require("../../assets/images/ampliacion/rutaTitulo.png")}
                                style={styles.badgeImage}
                            />
                        </View>

                        <View style={styles.rowBlock}>
                            {/* IMAGEN PERSONAS */}
                            <Image
                                source={require("../../assets/images/ampliacion/rutaPersonas.png")}
                                style={styles.personImage}
                            />

                            {/* TEXTO */}
                            <View style={styles.textColumn}>
                                <Text style={styles.sectionTitle}>Identificación</Text>
                                <Text style={styles.paragraph}>
                                    Establecer si el niño, niña o adolescente es no acompañado o separado.
                                </Text>

                                <Text style={styles.sectionTitle}>Corresponsabilidad</Text>
                                <Text style={styles.paragraph}>
                                    Informar a la Policía Nacional o autoridades administrativas
                                    (Defensor/a, Comisario/a de Familia o Inspector de Policía).
                                </Text>
                            </View>
                        </View>


                        {/* SUBTÍTULO 2 */}
                        <View style={styles.badgeWrapper}>
                            <Image
                                source={require("../../assets/images/ampliacion/rutaSubTitulo.png")}
                                style={styles.badgeImage}
                            />
                        </View>

                        {/* TEXTO LARGO */}
                        <Text style={styles.paragraph2}>
                            Según cada caso, la autoridad administrativa procederá a realizar
                            verificación de garantía de derechos; en casos de Niños, niñas,
                            adolescentes migrantes no acompañados o separados (NNANS), se apertura
                            el Proceso Administrativo de Restablecimiento de Derechos (PARD)
                            (Cfr. Art. 52 Código de la Infancia y la Adolescencia).
                        </Text>

                        <View style={styles.backgroundBottom}>
                            <Image
                                source={require("../../assets/images/ampliacion/rutaBackGround.png")}
                                style={styles.backgroundImage}
                            />
                        </View>

                    </ImageBackground>


                </ScrollView>

                {/* FOOTER FIJO ABAJO */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialAmpliacionDos"
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
    sectionTitle: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.small,
        color: "#E84C5B",
        marginBottom: RelativeSize(6),
    },
    finalImage: {
        width: Dimensions.get("window").width * 0.65,
        height: Dimensions.get("window").width * 0.75,
        alignSelf: "center",
        resizeMode: "contain",
        marginTop: RelativeSize(20),
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
    rowBlock: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: RelativeSize(24),
    },

    personImage: {
        width: Dimensions.get("window").width * 0.28,
        height: Dimensions.get("window").width * 0.45,
        resizeMode: "contain",
        marginRight: RelativeSize(12),
    },

    textColumn: {
        flex: 1,
    },
    backgroundBottom: {
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
    },

    backgroundImage: {
        width: Dimensions.get("window").width * 0.88,
        height: RelativeSize(140),
        resizeMode: "stretch",
    },

    paragraph2: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(12),
        color: "#666",
        marginBottom:  RelativeSize(140),
        textAlign: "justify",
    },

});
