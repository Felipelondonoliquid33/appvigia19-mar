import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { RelativeSize } from '../componentes/funciones'
import FooterNav from "../componentes/FooterNav";

import PersonFontSize from "../api/PersonFontSize";

export default function MaterialVirtualClaveScreen({ navigation, route }) {
    const { user } = route.params;
    const usuario = user;

    const handleAnterior = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* ===== HEADER ===== */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleAnterior} activeOpacity={0.8}>
                    <Image
                        source={require("../../assets/iconos/retorceder.png")}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* ===== CONTENIDO ===== */}
            <ScrollView
                contentContainerStyle={styles.scrollInner}
                showsVerticalScrollIndicator={false}
            >

                <ImageBackground
                    source={require("../../assets/images/fondo.png")}
                    style={styles.card}
                    imageStyle={styles.cardImage}
                    resizeMode="stretch">

                    {/* GROOMING */}
                    <Image
                        source={require("../../assets/images/conceptos/claveGrooming.png")}
                        style={styles.groomingImage}
                        resizeMode="contain"
                    />

                    {/* PÁRRAFOS NORMALES */}
                    <Text style={styles.paragraph}>
                        Seducción de niñas, niños y adolescentes por medio de las tecnologías de la información y la comunicación.
                    </Text>

                    <Text style={styles.paragraph}>
                        El grooming en línea es el acoso sexual que un adulto realiza hacia un niño, niña o adolescente mediante plataformas digitales. El grooming NO es la antesala de un delito: es en sí mismo un delito y una forma de abuso sexual, aunque nunca se concrete un encuentro físico (UNICEF Argentina, 2023).
                    </Text>

                    {/* BLOQUE CON CHICA (solo párrafos 3–5) */}
                    <View style={styles.textWithCharacter}>

                        <View style={styles.textColumn}>
                            <Text style={styles.paragraph}>
                                Generalmente, el agresor crea un vínculo de confianza mediante cumplidos,
                                regalos o atención emocional, reduciendo progresivamente las inhibiciones
                                de la víctima (Costa et al., 2023).
                            </Text>

                            <Text style={styles.paragraph}>
                                A menudo, este proceso ocurre bajo una identidad falsa, con adultos que se
                                hacen pasar por pares del menor en redes sociales, chats o foros (Unicef,
                                2014).
                            </Text>
                        </View>

                        <Image
                            source={require("../../assets/images/conceptos/claveChica.png")}
                            style={styles.character}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.paragraph}>
                        Este proceso puede culminar en encuentros presenciales, producción de Material de Abuso Sexual Infantil (MASI), o actividades sexuales en línea, representando un riesgo grave para la integridad física y emocional de las infancias y adolescencias.
                    </Text>

                    {/* PÁRRAFO FINAL NORMAL */}
                    <Text style={styles.paragraph}>
                        El grooming digital es una estrategia de seducción y abuso encubierta bajo una
                        relación afectiva, que busca ganar poder sobre el niño o niña con fines de
                        explotación sexual, lo que requiere especial atención en contextos de
                        protección (Unicef, 2016).
                    </Text>

                </ImageBackground>

            </ScrollView>

            {/* ===== FOOTER ===== */}
            <FooterNav
                navigation={navigation}
                usuario={usuario}
                active="MaterialVirtualClave"
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#07133B",
    },

    header: {
        paddingHorizontal: RelativeSize(20),
        paddingTop: RelativeSize(20),
        zIndex: 10,
    },

    backIcon: {
        width: RelativeSize(28),
        height: RelativeSize(28),
        resizeMode: "contain",
        marginTop: RelativeSize(10),
    },

    textWithCharacter: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: RelativeSize(4),
    },


    character: {
        width: RelativeSize(110),
        height: RelativeSize(180),
        resizeMode: "contain",
        marginLeft: RelativeSize(8),
        flexShrink: 0,
    },

    textColumn: {
        flex: 1,
        zIndex: 2,
    },

    scrollInner: {
        paddingHorizontal: RelativeSize(20),
        paddingTop: RelativeSize(8),
        paddingBottom: RelativeSize(110), // 👈 espacio para footer
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
        height: RelativeSize(80),
        marginBottom: RelativeSize(12),
    },

    groomingImage: {
        width: "100%",
        height: RelativeSize(125),
        marginBottom: RelativeSize(8),
    },

    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(19),
        color: "#666666",
        marginBottom: RelativeSize(8),
        textAlign: "justify",
    },

    bottomImage: {
        width: "100%",
        height: RelativeSize(180),
        marginTop: RelativeSize(12),
    },
});
