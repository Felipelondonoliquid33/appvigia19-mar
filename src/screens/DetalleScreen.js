// ResultadosScreen.js
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";

import { useLang } from "../i18n/LanguageProvider";


import FooterNav from "../componentes/FooterNav";
import { RelativeSize } from '../componentes/funciones'
import PersonFontSize from "../api/PersonFontSize";


export default function DetalleScreen({ navigation, route }) {
    const { t, lang } = useLang();
    const { user, detalle } = route.params || {};
    const usuario = user;

    const handleAnterior = async => {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                {/* Botón atrás (icono) */}
                <TouchableOpacity style={styles.headerIconLeft} onPress={handleAnterior}>
                    <Image
                        source={require("../../assets/iconos/retorceder.png")}
                        style={{ width: 25, height: 25 }}
                    />
                </TouchableOpacity>

            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Imagen grande */}
                <Image
                    source={{ uri: detalle.imagen }}
                    style={styles.headerFullImage}
                    resizeMode="cover"
                />

                {/* Tarjeta de contenido */}
                <View style={styles.card}>
                    <Text style={styles.title}>{lang === "es" ? detalle.titulo: detalle.tituloEn}</Text>
                    <Text style={styles.description}>{lang === "es" ? detalle.descripcion: detalle.descripcionEn}</Text>
                </View>

            </ScrollView>


            {/* FOOTER */}
            <FooterNav navigation={navigation} usuario={usuario} active="MaterialesListado" stylePosition={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
            }} />

        </View>
    )

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#061047" },
    content: {
        padding: RelativeSize(20),
        paddingBottom: RelativeSize(150),
        alignItems: "center", // 👈 centramos todo
    },

    // IMAGEN SUPERIOR
    headerFullImage: {
        width: "100%",
        height: RelativeSize(180),
        borderTopLeftRadius: RelativeSize(16),
        borderTopRightRadius: RelativeSize(16),
        marginBottom: RelativeSize(10), // Hace que la tarjeta suba un poco y se vea pegada
    },

    // TARJETA BLANCA
    card: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: RelativeSize(20),
        padding: RelativeSize(20),
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: RelativeSize(4) },
        shadowRadius: RelativeSize(8),
        elevation: RelativeSize(6),
        marginBottom: RelativeSize(30),
    },

    // TÍTULO
    title: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.titulo,
        textAlign: "center",
        marginBottom: RelativeSize(12),
    },

    // DESCRIPCIÓN JUSTIFICADA
    description: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.normal,
        color: "#333",
        lineHeight: RelativeSize(22),
        textAlign: "justify", // 👈 Igual al diseño
    },

    scrollArea: {
        flex: 1,
        paddingHorizontal: RelativeSize(20),
        paddingTop: RelativeSize(20),
    },
    header: {
        height: RelativeSize(60),
        justifyContent: "center",
    },
    headerIconLeft: {
        position: "absolute",
        left: RelativeSize(16),
        top: RelativeSize(30),
        width: RelativeSize(40),
        height: RelativeSize(40),
        alignItems: "center",
        justifyContent: "center",
    },
    headerIconRight: {
        position: "absolute",
        right: RelativeSize(16),
        top: RelativeSize(30),
        width: RelativeSize(40),
        height: RelativeSize(40),
        alignItems: "center",
        justifyContent: "center",
    },
});