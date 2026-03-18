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
import PersonFontSize from "../api/PersonFontSize";

const dimensions = Dimensions.get('window');

const iwidth = Math.round(dimensions.width * 0.25);
const iheight = Math.round(iwidth * 1.4);
const iheight2 = Math.round(iwidth * 1.4);

export default function MaterialesUnoScreen({ navigation, route }) {
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
                                source={require("../../assets/images/material1_1.png")}
                                style={styles.badgeImage}
                            />
                        </View>

                        {/* BLOQUE 1 */}
                        <View style={styles.row}>
                            <View style={styles.textColumn}>
                                <Text style={styles.paragraph}>
                                    En el marco del artículo 44 de la Constitución Política, la Ley 985 de 2005 y la Ley 1098 de 2006, 
                                    el Instituto Colombiano de Bienestar Familiar tiene la responsabilidad de brindar atención y asistencia a niñas, niños y adolescentes 
                                    víctimas o posibles víctimas de trata de personas, así como desarrollar acciones de prevención y sensibilización frente a este delito.
                                </Text>
                            </View>
                            <Image
                                source={require("../../assets/images/material1_3.png")}
                                style={styles.imageRight}
                            />
                        </View>

                        {/* BLOQUE 2 */}
                        <Text style={[styles.paragraph, styles.paragraphBlock]}>
                            Con el propósito de fortalecer la identificación temprana de riesgos asociados a la trata de personas con fines de explotación sexual en entornos virtuales, 
                            el ICBF, con el apoyo de la Organización Internacional para las Migraciones, impulsó el desarrollo de la aplicación móvil "Modo Seguro a un Clic".
                        </Text>

                        {/* BLOQUE 3 */}
                        <View style={styles.row}>
                            <Image
                                source={require("../../assets/images/material1_2.png")}
                                style={styles.imageLeft}
                            />
                            <View style={[styles.textColumn, { marginTop: 10 }]}>
                                <Text style={styles.paragraph}>
                                    Esta herramienta está dirigida a colaboradores del ICBF y busca apoyar la detección, orientación y activación oportuna de rutas de protección, 
                                    en coherencia con los estándares técnicos y tecnológicos institucionales vigentes.
                                </Text>
                            </View>
                        </View>

                    </ImageBackground>


                </ScrollView>

                {/* FOOTER FIJO ABAJO */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialUno"
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
    card: {
        borderRadius: RelativeSize(28),
        padding: RelativeSize(20),
        marginBottom: RelativeSize(30),
        overflow: "hidden",
    },

    cardImage: {
        borderRadius: RelativeSize(28),
    },
    badgeWrapper: {
        alignItems: "center",
        marginBottom: RelativeSize(14),
    },

    badgeImage: {
        width: RelativeSize(220),   // ajusta según el diseño
        height: RelativeSize(50),
        resizeMode: "contain",
    },

    badge: {
        backgroundColor: "#9B5AA0",
        paddingVertical: RelativeSize(10),
        paddingHorizontal: RelativeSize(30),
        borderRadius: RelativeSize(14),
    },

    badgeText: {
        color: "#fff",
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.normal,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: RelativeSize(10),
    },

    textColumn: {
        flex: 1,
    },

    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(19),
        color: "#666",
        marginBottom: RelativeSize(6),
        textAlign: "justify",
    },
    paragraphBlock: {
        marginVertical: RelativeSize(8),
    },

    imageRight: {
        width: iwidth,
        height: iheight,
        resizeMode: "contain",
        marginLeft: RelativeSize(10),
    },

    imageLeft: {
        width: iwidth,
        height: iheight,
        resizeMode: "contain",
        marginRight: RelativeSize(10),
    },

});