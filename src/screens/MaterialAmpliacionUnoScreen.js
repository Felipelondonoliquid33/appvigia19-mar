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

const dimensions = Dimensions.get('window');

import PersonFontSize from "../api/PersonFontSize";


export default function MaterialAmpliacionUnoScreen({ navigation, route }) {
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
                                source={require("../../assets/images/ampliacion/alcanceTitulo.png")}
                                style={styles.badgeImage}
                            />
                        </View>

                        {/* TEXTO */}
                        <Text style={styles.paragraph}>
                            De conformidad con lo dispuesto en la Ley 7 de 1979, el objeto del
                            Instituto Colombiano de Bienestar Familiar está dirigido a fortalecer
                            la familia y proteger a los niños, niñas y adolescentes.
                        </Text>

                        <Text style={styles.paragraph}>
                            De la misma manera, el Código de la Infancia y la Adolescencia,
                            establece normas sustantivas y procesales para la protección integral
                            de las personas menores de 18 años, por lo que, su ámbito de aplicación
                            se orienta a los niños, niñas y adolescentes nacionales o extranjeros
                            que se encuentren en el territorio nacional, a los nacionales que se
                            encuentren fuera del país y a aquellos con doble nacionalidad.
                        </Text>

                        <Text style={styles.paragraph}>
                            En este sentido, una de las responsabilidades del Estado es restablecer
                            los derechos que se encuentren en posible vulneración o amenaza de los
                            niños, niñas o adolescentes extranjeros que estén en Colombia, a través
                            de las actuaciones adelantadas por las autoridades administrativas.
                        </Text>

                        {/* IMAGEN INFERIOR */}
                        <Image
                            source={require("../../assets/images/ampliacion/alcanceNinos.png")}
                            style={styles.bottomImage}
                            resizeMode="stretch"
                        />


                    </ImageBackground>


                </ScrollView>

                {/* FOOTER FIJO ABAJO */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialAmpliacionUno"
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
    bottomImage: {
        width: Dimensions.get("window").width * 0.6,
        height: Dimensions.get("window").width * 0.7,
        alignSelf: "center",
        resizeMode: "stretch",
    },
    badgeImage: {
        width: RelativeSize(220),   // ajusta según el diseño
        height: RelativeSize(50),
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
        height: RelativeSize(60),
        resizeMode: "contain",
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
        width: "100%",
        height: Dimensions.get("window").width * 0.55,
        resizeMode: "stretch",
    },

    bottomRow: {
        flexDirection: "row",
        alignItems: "flex-end",
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
