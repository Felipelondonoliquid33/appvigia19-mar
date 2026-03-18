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

import PersonFontSize from "../api/PersonFontSize";

import { getDiligenciar } from "../database/diligenciar";
import { RelativeSize } from '../componentes/funciones'

export default function ResumenScreen({ navigation, route }) {
    const { t } = useLang();
    const { user } = route.params || {};
    const usuario = user;
    const [completas, setCompletas] = useState(0);
    const [pendientes, setPendientes] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalMinimo, setTotalMinimo] = useState(0);
    const [totalBajo, setTotalBajo] = useState(0);
    const [totalSignificativo, setTotalSignificativo] = useState(0);
    const colorMinimo = "green";
    const colorBajo = "yellow";
    const colorSignificativo = "red";

    const handleEntrevistas = async () => {
        let com = 0;
        let pen = 0;
        let min = 0;
        let baj = 0;
        let sig = 0;
        try {
            let lst = getDiligenciar();

            if (lst) {
                for (let i = 0; i < lst.length; i++) {
                    let diligenciar = lst[i];
                    if (diligenciar.completa == 1) {
                        com++;
                        let detalle = JSON.parse(diligenciar.json);
                        if (detalle.IdRiesgo == 1) {
                            min++;
                        } else if (detalle.IdRiesgo == 2) {
                            baj++;
                        } else {
                            sig++;
                        }
                    } else {
                        pen++;
                    }
                }
            }


        } catch (e) {
            // Error al calcular el resumen de entrevistas
        }
        setCompletas(com);
        setPendientes(pen);
        setTotal(com + pen);
        setTotalMinimo(min);
        setTotalBajo(baj);
        setTotalSignificativo(sig);
    }

    useEffect(() => {
        handleEntrevistas();
    }, [navigation]);

    const handleAnterior = () => {
        navigation.goBack();
    };


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* HEADER FIJO: ícono de retroceso alineado igual en todos los celulares */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleAnterior}>
                        <Image
                            source={require("../../assets/iconos/retorceder.png")}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                </View>


                <Text style={styles.tituloPrincipal}>{t("summary.title")}</Text>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t("summary.interviews")}</Text>

                    <View style={styles.row}>
                        <Text style={styles.rowText}>{t("summary.completed")}</Text>
                        <Text style={styles.rowValue}>{completas}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>{t("summary.pending")}</Text>
                        <Text style={styles.rowValue}>{pendientes}</Text>
                    </View>

                    <View style={[styles.row, { marginTop: RelativeSize(10) }]}>
                        <Text style={[styles.rowText, { fontWeight: "bold" }]}>
                            {t("summary.total")}
                        </Text>
                        <Text style={[styles.rowValue, { fontWeight: "bold" }]}>
                            {total}
                        </Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t("summary.riskMin")}</Text>

                    <Text style={styles.nivelRiesgoTexto}>{totalMinimo}</Text>

                    <View style={styles.barraContenedor}>
                        <View style={[styles.barraRiesgo, { backgroundColor: colorMinimo }]} />
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t("summary.riskLow")}</Text>

                    <Text style={styles.nivelRiesgoTexto}>{totalBajo}</Text>

                    <View style={styles.barraContenedor}>
                        <View style={[styles.barraRiesgo, { backgroundColor: colorBajo }]} />
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t("summary.riskHigh")}</Text>

                    <Text style={styles.nivelRiesgoTexto}>{totalSignificativo}</Text>

                    <View style={styles.barraContenedor}>
                        <View style={[styles.barraRiesgo, { backgroundColor: colorSignificativo }]} />
                    </View>
                </View>


            </ScrollView>
            <FooterNav navigation={navigation} usuario={usuario} active="PasoTres" />
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#07133B", // Azul oscuro de fondo
    },
    content: {
        paddingHorizontal: RelativeSize(20),
        paddingTop: RelativeSize(40),
        paddingBottom: RelativeSize(140), // espacio para que el footer no tape contenido
    },
    /* HEADER (icono atrás) */
    header: {
        height: RelativeSize(48),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: RelativeSize(16),
    },
    backButton: {
        width: RelativeSize(36),
        height: RelativeSize(36),
        borderRadius: RelativeSize(18),
        alignItems: "center",
        justifyContent: "center",
    },
    backIcon: {
        width: RelativeSize(24),
        height: RelativeSize(24),
        resizeMode: "contain",
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
    tituloPrincipal: {
        color: "#FFFFFF",
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.subtitulo,
        textAlign: "center",
        marginBottom: RelativeSize(25),
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: RelativeSize(20),
        padding: RelativeSize(10),
        marginBottom: RelativeSize(20),
    },
    cardTitle: {
    fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.normal,
        textAlign: "center",
        marginBottom: RelativeSize(10),
        color: "#000",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: RelativeSize(4),
    },
    rowText: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.normal,
        color: "#333",
        flex: 1,
        paddingRight: RelativeSize(10),
    },
    rowValue: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.normal,
        color: "#333",
        width: RelativeSize(40),
        textAlign: "right",
    },
    nivelRiesgoTexto: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.subtitulo,
        textAlign: "center",
        color: "#001A4D",
        marginBottom: RelativeSize(5),
    },
    barraContenedor: {
        height: RelativeSize(10),
        borderRadius: RelativeSize(5),
        backgroundColor: "#E5E5E5",
        overflow: "hidden",
        marginBottom: RelativeSize(10),
    },
    barraRiesgo: {
        flex: 1, // Barra llena (solo cambia color)
    },
    leyendaRiesgos: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        color: "#333",
        textAlign: "center",
    },
    subTituloRiesgo: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.normal,
        textAlign: "center",
        marginBottom: RelativeSize(8),
        color: "#001A4D",
    },
    textoRecomendaciones: {
        fontFamily: PersonFontSize.regular,
        fontSize:  PersonFontSize.normal,
        color: "#333",
        textAlign: "center",
        lineHeight: RelativeSize(18),
    },
    botonDescargar: {
        marginTop: RelativeSize(10),
        backgroundColor: "#EC008C",
        borderRadius: RelativeSize(20),
        paddingVertical: RelativeSize(14),
        alignItems: "center",
    },
    botonDescargarTexto: {
        color: "#FFFFFF",
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.normal,
    },
});
