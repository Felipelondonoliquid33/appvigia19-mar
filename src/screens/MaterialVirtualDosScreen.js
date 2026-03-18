import React, { useEffect, useState } from "react";

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


export default function MaterialVirtualDosScreen({ navigation, route }) {
    const { user } = route.params || {};
    const usuario = user;
    const [vista, setVista] = useState("uno");

    const handleAnterior = () => {
        if (vista === "dos") {
            setVista("uno");
        } else {
            navigation.goBack();
        }
    };


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

                        {vista === "uno" ? (
                            <>
                                {/* ===== CONTENIDO UNO ===== */}

                                <Image
                                    source={require("../../assets/images/conceptos/trataTitulo.png")}
                                    style={styles.titleImage}
                                />

                                <Text style={styles.paragraph}>
                                    La trata de personas es un delito que consiste en captar, trasladar, alojar o recibir a una persona, dentro del país o hacia otro lugar, con el propósito de explotarla.
                                </Text>

                                <Text style={styles.paragraph}>
                                    Para lograrlo, las personas tratantes pueden usar engaños, fraudes, amenazas, fuerza, abuso de poder o aprovecharse de una situación de vulnerabilidad.
                                </Text>

                                <Text style={styles.paragraph}>
                                    La trata de personas con fines de explotación sexual en entornos virtuales implica una serie de acciones que pueden llevarse a cabo parcial o totalmente en entornos virtuales.
                                </Text>

                                {/* IMAGEN + LISTA */}
                                <Image
                                    source={require("../../assets/images/conceptos/trataChica.png")}
                                    style={styles.personImage}
                                />

                                {/* TEXTO CLICKEABLE */}
                                <TouchableOpacity onPress={() => setVista("dos")}>
                                    <Text style={styles.linkText}>
                                        La explotación sexual en entornos digitales NO ocurre de manera aislada, sino como resultado de la interacción entre varios componentes:
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {/* ===== CONTENIDO DOS ===== */}

                                <Text style={styles.linkText}>
                                    La explotación sexual en entornos digitales NO ocurre de manera aislada, sino como resultado de la interacción entre varios componentes:
                                </Text>

                                {/* ITEM 1 */}
                                <View style={styles.row}>
                                    <Image source={require("../../assets/images/conceptos/trataCirculo1.png")} style={styles.circle} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.paragraph}>
                                            Las características de víctimas y agresores (edad, género, situación de vulnerabilidad, acceso a tecnología, intención criminal).
                                        </Text>
                                    </View>
                                </View>

                                {/* ITEM 2 */}
                                <View style={styles.row}>
                                    <Image source={require("../../assets/images/conceptos/trataCirculo2.png")} style={styles.circle} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.paragraph}>
                                            Las prácticas utilizadas para la captación y control (grooming, técnica del amante o loverboy, sextorsión, manipulación emocional, amenazas).
                                        </Text>
                                    </View>
                                </View>

                                {/* ITEM 3 */}
                                <View style={styles.row}>
                                    <Image source={require("../../assets/images/conceptos/trataCirculo3.png")} style={styles.circle} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.paragraph}>
                                            Los medios tecnológicos empleados como herramientas para el traslado simbólico y la explotación (redes sociales, apps de mensajería cifrada, plataformas de streaming, darknet, criptomonedas).
                                        </Text>
                                    </View>
                                </View>

                                {/* ITEM 4 */}
                                <View style={styles.row}>
                                    <Image source={require("../../assets/images/conceptos/trataCirculo4.png")} style={styles.circle} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.paragraph}>
                                            Los factores de riesgo presentes en distintos niveles según el modelo ecológico (individual: baja autoestima, necesidades económicas; familiar: ausencia de supervisión, violencia intrafamiliar; comunitario: normalización de la violencia, falta de oportunidades; cultural/institucional: desigualdad de género, impunidad, vacíos legales).
                                        </Text>
                                    </View>
                                </View>
                            </>
                        )}

                    </ImageBackground>



                </ScrollView>

                {/* FOOTER FIJO ABAJO */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialVirtualDos"
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

    linkText: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.small,
        color: "#E53935",
        textAlign: "center",
        marginVertical: RelativeSize(20),
    },

    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: RelativeSize(16),
    },

    circle: {
        width: RelativeSize(32),
        height: RelativeSize(32),
        resizeMode: "contain",
        marginRight: RelativeSize(10),
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
        flexGrow: 1,
    },

    card: {
        maxWidth: Dimensions.get("window").width - RelativeSize(40),
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
        height: Dimensions.get("window").width * 0.2,
        resizeMode: "stretch",
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
        height: Dimensions.get("window").width * 0.60,
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
        width: "100%",
        height: Dimensions.get("window").width * 0.6,
        resizeMode: "stretch",
    },
});
