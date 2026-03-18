import React from "react";
import {
    View,
    Image,
    Text,
    Dimensions,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FooterNav from "../componentes/FooterNav";
import { RelativeSize } from "../componentes/funciones";
import PersonFontSize from "../api/PersonFontSize";

const { width } = Dimensions.get("window");

export default function MaterialesCuatroScreen({ navigation, route }) {
    const { user } = route.params || {};
    const usuario = user;

    const handleAnterior = () => {
        navigation.goBack();
    };

    const handleCorreo = () => {
        Linking.openURL("mailto:solicitudesvenezuela@icbf.gov.co");
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <View style={styles.container}>

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
                    contentContainerStyle={styles.scrollContent}
                >
                    <ImageBackground
                        source={require("../../assets/images/fondo.png")}
                        style={styles.card}
                        imageStyle={styles.cardImage}
                        resizeMode="stretch"
                    >

                        {/* TITULO */}
                        <Image
                            source={require("../../assets/images/ruta/rutaTitulo.png")}
                            style={styles.titleImage}
                        />

                        {/* SUBTITULO */}
                        <Image
                            source={require("../../assets/images/ruta/rutaSubTitulo.png")}
                            style={styles.subTitleImage}
                        />

                        {/* PÁRRAFO MoE */}
                        <Text style={styles.paragraph}>
                            Con el MoE se crea un canal único de comunicación entre el Instituto
                            Colombiano de Bienestar Familiar y las autoridades del país de origen,
                            con el fin de coordinar las actuaciones necesarias para la protección
                            y el restablecimiento de derechos de niñas, niños y adolescentes
                            migrantes.
                        </Text>

                        {/* LINK CORREO */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleCorreo}
                            style={styles.linkWrapper}
                        >
                            <Image
                                source={require("../../assets/images/ruta/rutaLink.png")}
                                style={styles.linkImage}
                            />
                        </TouchableOpacity>

                        {/* ESPACIADOR FLEXIBLE */}
                        <View style={{ flex: 1 }} />

                        {/* BACKGROUND INFERIOR */}
                        <Image
                            source={require("../../assets/images/ruta/rutaBackgroun.png")}
                            style={styles.bottomImage}
                        />

                    </ImageBackground>
                </ScrollView>

                {/* FOOTER */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialCuatro"
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
    container: {
        flex: 1,
        backgroundColor: "#0b0f3b",
    },

    /* HEADER */
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

    /* SCROLL */
    scrollContent: {
        paddingHorizontal: RelativeSize(16),
        paddingBottom: RelativeSize(24),
    },

    /* CARD */
    card: {
        borderRadius: RelativeSize(28),
        overflow: "hidden",
        minHeight: Dimensions.get("window").height * 0.8,
    },
    cardImage: {
        borderRadius: RelativeSize(28),
    },

    /* IMAGENES */
    titleImage: {
        width:  Dimensions.get("window").width * 0.8,
        height: Dimensions.get("window").width * 0.15,
        resizeMode: "stretch",
        alignSelf: "center",
        marginTop: RelativeSize(20),
    },

    subTitleImage: {
        width:  Dimensions.get("window").width * 0.6,
        height: Dimensions.get("window").width * 0.3,
        resizeMode: "stretch",
        alignSelf: "center",
        marginVertical: RelativeSize(20),
    },

    linkWrapper: {
        alignItems: "center",
        marginBottom: RelativeSize(20),
    },
    linkImage: {
        width:  Dimensions.get("window").width * 0.8,
        height: Dimensions.get("window").width * 0.15,
        height: RelativeSize(60),
        resizeMode: "contain",
    },

    /* IMAGEN FINAL PEGADA */
    bottomImage: {
        width: "100%",
        height: width * 0.6,
        resizeMode: "stretch",
        marginTop: RelativeSize(10),
    },

    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.normal,
        color: "#6B6B6B",
        lineHeight: RelativeSize(20),
        textAlign: "left",
        marginHorizontal: RelativeSize(20),
        marginBottom: RelativeSize(20),
    },

});
