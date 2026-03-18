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

const dimensions = Dimensions.get("window");

// tamaños diferenciados (IMPORTANTE)
const tarjetaWidth = Math.round(dimensions.width * 0.22);
const tarjetaHeight = tarjetaWidth * 1.2;
import PersonFontSize from "../api/PersonFontSize";

const chicoWidth = Math.round(dimensions.width * 0.30);
const chicoHeight = chicoWidth * 2;

export default function MaterialesSexteoScreen({ navigation, route }) {
    const { user } = route.params || {};
    const usuario = user;

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <View style={styles.content}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={require("../../assets/iconos/retorceder.png")}
                            style={{ width: RelativeSize(25), height: RelativeSize(25) }}
                        />
                    </TouchableOpacity>
                </View>

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
                        {/* TITULO */}
                        <View style={styles.badgeWrapper}>
                            <Image
                                source={require("../../assets/images/otras/sexteoTitulo.png")}
                                style={styles.badgeImage}
                            />
                        </View>

                        {/* SUBTITULO */}
                        <Text style={styles.subTitle}>
                            Intercambio de mensajes con contenido sexual
                        </Text>

                        {/* BLOQUE 1 */}
                        <View style={styles.row}>
                            <View style={styles.textColumn}>
                                <Text style={styles.paragraph}>
                                    El sexting se refiere a la práctica de crear, enviar o recibir
                                    imágenes o mensajes de contenido sexualmente explícito a través
                                    de dispositivos móviles o plataformas digitales (Unicef, 2016).
                                </Text>
                            </View>

                            <Image
                                source={require("../../assets/images/otras/sexteoTarjeta.png")}
                                style={styles.tarjeta}
                            />
                        </View>

                        {/* BLOQUE 2 */}
                        <Text style={styles.paragraph}>
                            Cuando involucra menores de edad constituye producción y distribución de Material de Abuso Sexual Infantil (MASI), independientemente de la intención original o de quién creó el contenido. Los niños, niñas y adolescentes NO pueden dar consentimiento legal para participar en actividades sexuales ni en su registro (RAINN, 2024; Asociación REA, 2024).
                        </Text>

                        {/* BLOQUE 3 */}
                        <View style={styles.row}>
                            <Image
                                source={require("../../assets/images/otras/sexteoChico.png")}
                                style={styles.chico}
                            />

                            <View style={styles.textColumn}>
                                <Text style={styles.paragraph}>
                                    Las motivaciones para esta práctica varían desde la exploración
                                    de la sexualidad hasta la coerción, y se estima que entre el 15
                                    y 40 % de los adolescentes han participado en ella (UNODC, 2015).
                                </Text>

                                <Text style={styles.paragraph}>
                                    El sexting puede derivar en situaciones de violencia, coerción o acoso,
                                    afectando gravemente la salud mental de las infancias y adolescencias.
                                </Text>

                                <Text style={styles.paragraph}>
                                    Su impacto incluye consecuencias legales, sociales y psicológicas,
                                    particularmente cuando el contenido es difundido sin consentimiento.
                                </Text>

                                <Text style={styles.paragraph}>
                                    Fandiño et al. (2020) lo definen como la autoproducción y envío de
                                    contenido sexual a través de medios electrónicos, lo que exige
                                    estrategias preventivas y educativas claras en el ámbito de la
                                    protección infantil.
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </ScrollView>

                {/* FOOTER */}
                <FooterNav navigation={navigation} usuario={usuario} active="MaterialSexteo" />
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

    header: {
        height: RelativeSize(48),
        paddingHorizontal: RelativeSize(16),
        justifyContent: "center",
    },

    scrollInner: {
        paddingHorizontal: RelativeSize(25),
        paddingBottom: RelativeSize(24),
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
        marginBottom: RelativeSize(18),
    },

    badgeImage: {
        width: "100%",
        height: RelativeSize(110),
        resizeMode: "contain",
    },

    subTitle: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        color: "#666",
        textAlign: "center",
        marginBottom: RelativeSize(18),
    },

    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: RelativeSize(18),
    },

    textColumn: {
        flex: 1,
    },

    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(15),
        color: "#666",
        textAlign: "justify",
        marginBottom: RelativeSize(14),
    },

    tarjeta: {
        width: tarjetaWidth,
        height: tarjetaHeight,
        resizeMode: "contain",
        marginLeft: RelativeSize(12),
    },

    chico: {
        width: chicoWidth,
        height: chicoHeight,
        resizeMode: "contain",
        marginRight: RelativeSize(12),
    },
});
