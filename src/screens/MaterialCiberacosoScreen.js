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
import PersonFontSize from "../api/PersonFontSize";

const { width } = Dimensions.get("window");

const IMG_WIDTH = Math.round(width * 0.30);
const IMG_HEIGHT = Math.round(IMG_WIDTH * 2);

export default function MaterialCiberacosoScreen({ navigation, route }) {
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
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                </View>

                {/* CONTENIDO */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollInner}
                    showsVerticalScrollIndicator={false}
                >
                    <ImageBackground
                        source={require("../../assets/images/fondo.png")}
                        style={styles.card}
                        imageStyle={styles.cardImage}
                        resizeMode="stretch"
                    >

                        {/* TITULO */}
                        <View style={styles.titleWrapper}>
                            <Image
                                source={require("../../assets/images/otras/ciberacosoTitulo.png")}
                                style={styles.titleImage}
                            />
                        </View>

                        {/* PÁRRAFO 1 */}
                        <Text style={styles.paragraph}>
                            El ciberacoso, también conocido como cyberbullying, se refiere al uso
                            de medios digitales para infligir daño emocional, hostigamiento o
                            humillación a otra persona, de forma intencionada y repetitiva
                            (UNODC, 2015).
                        </Text>

                        {/* PÁRRAFO 2 */}
                        <Text style={styles.paragraph}>
                            Este tipo de acoso puede presentarse mediante mensajes ofensivos,
                            difusión de información privada, amenazas o suplantación de identidad.
                            A diferencia del acoso tradicional, puede ocurrir en cualquier
                            momento y lugar, con un alcance potencialmente masivo.
                        </Text>

                        {/* BLOQUE CON IMAGEN DERECHA */}
                        <View style={styles.row}>
                            <View style={styles.textColumn}>
                                <Text style={styles.paragraph}>
                                    Según Fandiño et al. (2020), el cyberbullying incluye múltiples
                                    conductas como el envío de mensajes intimidatorios, la creación
                                    de perfiles falsos o la publicación de imágenes sin
                                    consentimiento. La desinhibición que genera el anonimato en
                                    internet facilita la perpetuación de estas conductas.
                                </Text>

                                <Text style={styles.paragraph}>
                                    El ciberacoso genera angustia y miedo en las víctimas, y puede
                                    tener consecuencias psicológicas graves, por lo que su
                                    prevención y abordaje es crucial en entornos escolares,
                                    familiares y comunitarios.
                                </Text>
                            </View>

                            <Image
                                source={require("../../assets/images/otras/ciberacosoChica.png")}
                                style={styles.imageRight}
                            />
                        </View>

                        {/* IMAGEN FINAL */}
                        <View style={styles.imageBottomWrapper}>
                            <Image
                                source={require("../../assets/images/otras/ciberacosoLibros.png")}
                                style={styles.imageBottom}
                            />
                        </View>

                    </ImageBackground>
                </ScrollView>

                {/* FOOTER */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialCiberacoso"
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
        paddingHorizontal: RelativeSize(16),
        justifyContent: "center",
    },
    backIcon: {
        width: RelativeSize(25),
        height: RelativeSize(25),
        resizeMode: "contain",
    },

    /* SCROLL */
    scroll: {
        flex: 1,
    },
    scrollInner: {
        paddingHorizontal: RelativeSize(25),
        paddingBottom: RelativeSize(30),
    },

    /* CARD */
    card: {
        borderRadius: RelativeSize(28),
        padding: RelativeSize(20),
        marginBottom: RelativeSize(30),
        overflow: "hidden",
    },
    cardImage: {
        borderRadius: RelativeSize(28),
    },

    /* TITULO */
    titleWrapper: {
        alignItems: "center",
        marginBottom: RelativeSize(20),
    },
    titleImage: {
        width: RelativeSize(200),
        height: RelativeSize(80),
        resizeMode: "contain",
    },

    /* TEXTO */
    paragraph: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        lineHeight: RelativeSize(15),
        color: "#6b6b6b",
        textAlign: "justify",
        marginBottom: RelativeSize(12),
    },

    /* BLOQUE CON IMAGEN */
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: RelativeSize(10),
    },
    textColumn: {
        flex: 1,
        paddingRight: RelativeSize(10),
    },
    imageRight: {
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        resizeMode: "contain",
    },

    /* IMAGEN FINAL */
    imageBottomWrapper: {
        alignItems: "center",
        marginTop: RelativeSize(20),
    },
    imageBottom: {
        width: RelativeSize(180),
        height: RelativeSize(120),
        resizeMode: "contain",
    },
});
