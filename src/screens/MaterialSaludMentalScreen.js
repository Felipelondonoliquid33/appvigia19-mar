import React from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FooterNav from "../componentes/FooterNav";
import { RelativeSize } from "../componentes/funciones";
import PersonFontSize from "../api/PersonFontSize";

export default function MaterialSaludMentalScreen({ navigation, route }) {
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
                    <TouchableOpacity onPress={handleAnterior}>
                        <Image
                            source={require("../../assets/iconos/retorceder.png")}
                            style={styles.backIcon}
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

                        {/* TITULO */}
                        <Image
                            source={require("../../assets/images/otras/saludmentalTitulo.png")}
                            style={styles.saludmentalTitulo}
                            resizeMode="stretch"
                        />

                        {/* TEXTO 1 */}
                        <Text style={styles.paragraph}>
                            Asegurar intervención terapéutica especializada desde la
                            primera consulta.
                        </Text>

                        {/* TEXTO 2 */}
                        <Text style={styles.paragraph}>
                            Mantener seguimiento en el tiempo, considerando el impacto
                            emocional asociado a la explotación virtual.
                        </Text>

                        {/* BLOQUE VERIFICAR */}
                        <ImageBackground
                            source={require("../../assets/images/otras/saludmentalListaUno.png")}
                            style={styles.verificarBlock}
                            imageStyle={styles.verificarImage}
                            resizeMode="stretch"
                        >
                            <Text style={styles.verificarText}>Verificar:</Text>
                        </ImageBackground>

                        {/* OBLIGACIONES */}
                        <Image
                            source={require("../../assets/images/otras/saludmentalObligacion.png")}
                            style={styles.saludmentalObligacion}
                            resizeMode="stretch"
                        />

                        {/* LISTA FINAL */}
                        <Image
                            source={require("../../assets/images/otras/saludmentalListaDos.png")}
                            style={styles.saludmentalListaDos}
                            resizeMode="stretch"
                        />

                    </ImageBackground>
                </ScrollView>

                {/* FOOTER */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialSaludMental"
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
        width: RelativeSize(24),
        height: RelativeSize(24),
        resizeMode: "contain",
    },

    /* SCROLL */
    scrollInner: {
        paddingHorizontal: RelativeSize(24),
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

    /* IMÁGENES */
    saludmentalTitulo: {
        width: "100%",
        height: RelativeSize(70),
        marginBottom: RelativeSize(20),
    },

    saludmentalObligacion: {
        width: "100%",
        height: RelativeSize(80),
        marginVertical: RelativeSize(20),
    },

    saludmentalListaDos: {
        width: "100%",
        height: RelativeSize(220),
        marginBottom: RelativeSize(10),
    },

    /* TEXTO */
    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(16),
        color: "#666",
        textAlign: "justify",
        marginBottom: RelativeSize(14),
    },

    /* BLOQUE VERIFICAR */
    verificarBlock: {
        width: "100%",
        height: RelativeSize(130),
        justifyContent: "flex-start",        
        alignItems: "center",
        marginVertical: RelativeSize(20),
    },
    verificarImage: {
        borderRadius: RelativeSize(22),
    },
    verificarText: {
        color: "#E53935",
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.normal,
    },
});
