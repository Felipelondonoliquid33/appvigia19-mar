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

export default function MaterialVirtualCuatroScreen({ navigation, route }) {
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
                                source={require("../../assets/images/conceptos/comportamientoTitulo.png")}
                                style={styles.badgeImage}
                            />
                        </View>

                        {/* TEXTO INTRODUCTORIO */}
                        <Text style={styles.paragraph}>
                            Son aquellas conductas o exposiciones que aumentan la vulnerabilidad de niñas, niños y adolescentes frente a potenciales agresores. 
                            Es importante destacar que estas prácticas NO son la causa de la violencia sexual, la responsabilidad siempre recae en el agresor, 
                            pero su conocimiento permite desarrollar estrategias de prevención y autocuidado.
                        </Text>

                        {/* TEXTO FINAL + IMAGEN */}
                        <View style={styles.bottomRow}>
                            <Image
                                source={require("../../assets/images/conceptos/comportamientoPersonas.png")}
                                style={styles.personImage}
                            />

                            <View style={styles.textColumn}>
                                <Text style={styles.paragraph2}>
                                    Entre ellas se incluyen:
                                </Text>
                            </View>

                        </View>

                        {/* BLOQUE INCLUYE */}
                        <View style={styles.includeRow}>
                            <Image
                                source={require("../../assets/images/conceptos/comportamientoChica.png")}
                                style={styles.includeImage}
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

    paragraph2: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(12),
        color: "#A1569D",
        marginBottom: RelativeSize(16),
        textAlign: "justify",
    },

    includeRow: {
        alignItems: "center",
        marginVertical: RelativeSize(20),
    },
    includeImage: {
        width: "100%",
        height: Dimensions.get("window").width * 2.0,
        resizeMode: "contain",
    },

    bottomRow: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    textColumn: {
        flex: 1,
        paddingLeft: RelativeSize(10),
    },
    personImage: {
        width: Dimensions.get("window").width * 0.1,
        height: Dimensions.get("window").width * 0.2,
        resizeMode: "stretch",
    },
});
