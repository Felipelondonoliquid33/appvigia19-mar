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
import PersonFontSize from "../api/PersonFontSize";


export default function MaterialReportarVulneracionScreen({ navigation, route }) {
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

                {/* CONTENIDO */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollInner}
                >
                    <ImageBackground
                        source={require("../../assets/images/fondo.png")}
                        style={styles.card}
                        imageStyle={styles.cardImage}
                    >

                        {/* CONTENIDO CON PADDING */}
                        <View style={styles.contentWrapper}>

                            {/* TÍTULO */}
                            <Image
                                source={require("../../assets/images/otras/reportarVulneracionTitulo.png")}
                                style={styles.titleImage}
                            />

                            {/* TEXTO */}
                            <Text style={styles.paragraph}>
                                Desde el Centro de Contacto de la Dirección de Servicios y
                                Atención del ICBF se tienen dispuestos los siguientes canales de
                                atención a través de los cuales se pueden realizar los reportes
                                de los casos de presunta vulneración de derechos en contra de
                                niños, niñas y adolescentes, incluyendo los relacionados con la
                                trata de personas.
                            </Text>

                            {/* TABLA */}
                            <Image
                                source={require("../../assets/images/otras/reportarVulneracionTabla.png")}
                                style={styles.tableImage}
                            />
                        </View>

                        {/* CHICA DECORATIVA DERECHA */}
                        <Image
                            source={require("../../assets/images/otras/reportarVulneracionChica.png")}
                            style={styles.chicaBg}
                        />

                    </ImageBackground>
                </ScrollView>

                {/* FOOTER */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialReportarVulneracion"
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

    header: {
        height: RelativeSize(48),
        justifyContent: "center",
        paddingHorizontal: RelativeSize(16),
    },

    scrollInner: {
        paddingHorizontal: RelativeSize(20),
        paddingBottom: RelativeSize(30),
    },

    card: {
        borderRadius: RelativeSize(28),
        paddingVertical: RelativeSize(25),
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#fff",
    },
    cardImage: {
        borderRadius: RelativeSize(28),
    },

    /* CONTENIDO CON ESPACIO LATERAL */
    contentWrapper: {
        paddingHorizontal: RelativeSize(20),
        zIndex: 2,
    },


    titleImage: {
        width: "100%",
        height: RelativeSize(65),
        resizeMode: "contain",
        marginBottom: RelativeSize(20),
    },

    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(16),
        color: "#666",
        textAlign: "justify",
        marginBottom: RelativeSize(15),
    },

    tableImage: {
        width:  "85%",
        height:  Dimensions.get("window").width * 1,
        resizeMode: "stretch",
        marginBottom: RelativeSize(15),
    },

    /* CHICA DECORATIVA */
    chicaBg: {
        position: "absolute",
        right: RelativeSize(25),
        bottom: 0,
        width: RelativeSize(90),
        height: RelativeSize(200),
        resizeMode: "stretch",
        zIndex: 100,
        opacity: 1,
    }

});
