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

const iwidth = Math.round(dimensions.width * 0.25);
const iheight = Math.round(iwidth * 2);
const iheight2 = Math.round(iwidth * 1.5);

export default function MaterialesSeisScreen({ navigation, route }) {
    const { user } = route.params || {};
    const usuario = user;

    const items = [
        {
            id: 1,
            title: "Entornos virtuales",
            image: require("../../assets/images/conceptos/conceptoItem8.png"),
            screen: "MaterialRestablecimiento", 
        },
        {
            id: 2,
            title: "Trata de personas con fines de explotación sexual en entornos virtuales",
            image: require("../../assets/images/conceptos/conceptoItem9.png"),
            screen: "MaterialEstabilizacion",
        },
        {
            id: 3,
            title: "Trata de personas con fines de explotación sexual en entornos virtuales",
            image: require("../../assets/images/conceptos/conceptoItem10.png"),
            screen: "MaterialSaludMental",
        },
        {
            id: 4,
            title: "Trata de personas con fines de explotación sexual en entornos virtuales",
            image: require("../../assets/images/conceptos/conceptoItem11.png"),
            screen: "MaterialAccesoJusticia",
        },
        {
            id: 5,
            title: "Trata de personas con fines de explotación sexual en entornos virtuales",
            image: require("../../assets/images/conceptos/conceptoItem12.png"),
            screen: "MaterialRestablecerDerecho",
        },
        {
            id: 6,
            title: "Trata de personas con fines de explotación sexual en entornos virtuales",
            image: require("../../assets/images/conceptos/conceptoItem13.png"),
            screen: "MaterialInclucion",
        },
    ];


    const handleAnterior = async => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>

            <View style={styles.container}>

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


                        {/* TÍTULO */}
                        <Image
                            source={require("../../assets/images/otras/restablecimientoTitulo.png")}
                            style={styles.titleImage}
                        />



                        {/* LISTA DE ITEMS */}
                        {items.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.85}
                                onPress={() => navigation.navigate(item.screen, {
                                    user: usuario,
                                })}
                                style={styles.itemWrapper}
                            >
                                <Image
                                    source={item.image}
                                    style={styles.itemImage}
                                />
                            </TouchableOpacity>
                        ))}



                    </ImageBackground>


                </ScrollView>

                {/* FOOTER FIJO ABAJO */}
                <FooterNav
                    navigation={navigation}
                    usuario={usuario}
                    active="MaterialDos"
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
    scroll: {
        flex: 1, // 🔥 OBLIGATORIO
    },
    scrollInner: {
        paddingHorizontal: RelativeSize(25),
        paddingTop: RelativeSize(8),     // separación entre header y título
        paddingBottom: RelativeSize(24), // aire sobre el footer
        flexGrow: 1,
    },
    titleImage: {
        width: "100%",
        height: Dimensions.get("window").width * 0.15,
        resizeMode: "stretch",
        marginBottom: RelativeSize(10),
    },
    subTitleImage: {
        width: "100%",
        height: Dimensions.get("window").width * 0.30,
        resizeMode: "stretch",
        marginBottom: RelativeSize(10),
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
    itemWrapper: {
        marginBottom: RelativeSize(10),
    },

    itemImage: {
        width: "100%",
        height: Dimensions.get("window").width * 0.30,
        resizeMode: "stretch",
    },

});
