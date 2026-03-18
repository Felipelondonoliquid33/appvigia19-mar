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

export default function MaterialVirtualTresScreen({ navigation, route }) {
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
                                source={require("../../assets/images/conceptos/dinamicaTitulo.png")}
                                style={styles.badgeImage}
                            />
                        </View>

                        {/* TEXTO INTRODUCTORIO */}
                        <Text style={styles.paragraph}>
                            En la era digital, las organizaciones delictivas han incorporado
                            tecnologías de información y comunicación para fortalecer,ampliar,
                            y sofisticar sus operaciones de trata y explotación sexual.
                        </Text>

                        {/* BLOQUE INCLUYE */}
                        <View style={styles.includeRow}>
                            <Image
                                source={require("../../assets/images/conceptos/dinamicaPersonas.png")}
                                style={styles.includeImage}
                            />
                        </View>

                        <Text style={styles.paragraph}>
                            Internet y las plataformas digitales no son solamente escenarios donde ocurre el delito, sino herramientas activas que permiten a los tratantes:
                        </Text>

                        <Text style={[styles.paragraph, { paddingLeft: 8 }]}>
                            {"- "}Alcanzar víctimas a escala global, superando barreras geográficas y fronteras nacionales.
                        </Text>

                        <Text style={[styles.paragraph, { paddingLeft: 8 }]}>
                            {"- "}Operar con mayor anonimato e impunidad, dificultando la identificación y persecución judicial.
                        </Text>

                        <Text style={[styles.paragraph, { paddingLeft: 8 }]}>
                            {"- "}Diversificar sus métodos de captación, control y explotación, adaptándose rápidamente a nuevas tecnologías y plataformas.
                        </Text>

                        <Text style={[styles.paragraph, { paddingLeft: 8 }]}>
                            {"- "}Normalizar y mercantilizar la explotación, presentándola como "oportunidades" o "relaciones consensuadas".
                        </Text>

                        {/* TEXTO FINAL + IMAGEN */}
                        <View style={styles.bottomRow}>
                            <View style={styles.textColumn}>
                                <Text style={styles.paragraph}>
                                    En este contexto, es crucial reconocer la conexión entre la trata de
                                    personas y el uso de tecnologías digitales, dado que estas permiten
                                    la expansión, sofisticación y globalización del delito.
                                </Text>
                            </View>

                            <Image
                                source={require("../../assets/images/conceptos/dinamicaChico.png")}
                                style={styles.personImage}
                            />
                        </View>


                    </ImageBackground>


                </ScrollView>

                {/* FOOTER FIJO ABAJO */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialVirtualTres"
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

    badgeImage: {
        width: RelativeSize(220),   // ajusta según el diseño
        height: Dimensions.get("window").width * 0.30,
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
        height:  Dimensions.get("window").width * 0.6,
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
        width: "60%",
        height: Dimensions.get("window").width * 0.4,
        resizeMode: "stretch",
    },

    bottomRow: {
        flexDirection: "row",
        alignItems: "center",
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
