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

export default function MaterialAccesoJusticiaScreen({ navigation, route }) {
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
                            source={require("../../assets/images/otras/accesojusticiaTitulo.png")}
                            style={styles.saludmentalTitulo}
                            resizeMode="stretch"
                        />


                        {/* OBLIGACIONES */}
                        <Image
                            source={require("../../assets/images/otras/accesojusticiaLista.png")}
                            style={styles.saludmentalObligacion}
                            resizeMode="stretch"
                        />

                    </ImageBackground>
                </ScrollView>

                {/* FOOTER */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialAccesoJusticia"
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
        height: RelativeSize(80),
        marginBottom: RelativeSize(20),
        resizeMode: "stretch",        
    },

    saludmentalObligacion: {
        width: "100%",
        height: RelativeSize(350),
        marginVertical: RelativeSize(10),
        resizeMode: "stretch",        
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
