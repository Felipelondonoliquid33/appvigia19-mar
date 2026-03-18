import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    Modal,
} from "react-native";
import { useLang } from "../i18n/LanguageProvider";

import FooterNav from "../componentes/FooterNav"; 
import PersonFontSize from "../api/PersonFontSize";

import { buscarMaterialBytipo } from '../database/materiales';
import { RelativeSize } from '../componentes/funciones'

export default function MaterialesDetalleScreen({ navigation, route }) {
    const { t, lang } = useLang();
    const { user, detalle } = route.params || {};
    const usuario = user;
    const [diligenciadas, setDiligenciadas] = useState([]);

    const PAGE_SIZE = 5;

    const [search, setSearch] = useState("");
    const [data, setData] = useState(diligenciadas.slice(0, PAGE_SIZE));
    const [page, setPage] = useState(1);


    const handleDiligenciadas = async () => {
        try {
            const listado = buscarMaterialBytipo(detalle.id);
            setDiligenciadas(listado);
        } catch (e) {
            // Error al cargar los materiales por tipo
        }
    }

    useEffect(() => {
        setData(diligenciadas.slice(0, PAGE_SIZE));
        setPage(1);
    }, [diligenciadas]);

    useEffect(() => {
        handleDiligenciadas();
    }, [navigation]);

    /** =============================
     *  CARGAR MÁS CUANDO HAGO SCROLL
     *  ============================= */
    const cargarMas = () => {
        if (search.length > 0) return; // No paginar si hay búsqueda

        const total = diligenciadas.length;
        const next = (page + 1) * PAGE_SIZE;

        if (next <= total) {
            setData(diligenciadas.slice(0, next));
            setPage(page + 1);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {/* Columna izquierda: título y "Ver más" */}
            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{lang === "es" ? item.titulo: item.tituloEn}</Text>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('MaterialDetalle', { user: usuario, detalle: item})
                    }}
                >
                    <Text style={styles.cardSeeMore}>{t("materialsDetail.seeMore")}</Text>
                </TouchableOpacity>
            </View>

            {/* Columna derecha: imagen */}
            <Image
                source={{ uri: item.preview }}
                style={styles.cardImage}
                resizeMode="cover"
            />
        </View>
    );

    const handleAnterior = async => {
        navigation.goBack();
    }


    return (
        <View style={styles.container}>

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


                <View style={styles.headerCard}>

                    {/* Imagen que ocupa toda la tarjeta */}
                    <Image
                        source={detalle.imagen}
                        style={styles.headerFullImage}
                        resizeMode="cover"
                    />

                    {/* Overlay SOLO en la mitad inferior */}
                    <View style={styles.headerBottomOverlay}>
                        <Text style={styles.headerTitle}>{detalle.titulo}</Text>
                        <Text style={styles.headerDescription}>{detalle.descripcion}</Text>
                    </View>

                </View>


                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    onEndReached={cargarMas}
                    onEndReachedThreshold={0.4}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 140 }}  // 👈 necesario para ver footer
                />
            </View>


            {/* FOOTER */}
            <FooterNav navigation={navigation} usuario={usuario} active="MaterialesListado" />
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#061047" },
    content: {  flex: 1,  padding: RelativeSize(20)},
    scrollArea: {
        flex: 1,
        paddingHorizontal: RelativeSize(20),
        paddingTop: RelativeSize(20),
    },
    headerCard: {
        width: "100%",
        height: RelativeSize(220),
        borderRadius: RelativeSize(16),
        overflow: "hidden",
        marginTop: RelativeSize(20),
        marginBottom: RelativeSize(25),
        position: "relative",
    },

    // Imagen de fondo en TODA la tarjeta
    headerFullImage: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    },

    // Overlay semitransparente SOLO en la mitad inferior
    headerBottomOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50%",           // 👈 solo la mitad inferior
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: RelativeSize(20),
    },

    headerTitle: {
        color: "#fff",
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.medium,
        textAlign: "center",
        marginBottom: RelativeSize(6),
    },

    headerDescription: {
        color: "#fff",
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.normal,
        textAlign: "center",
        lineHeight: RelativeSize(18),
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
    title: {
        color: "white",
        textAlign: "center",
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.titulo,
        marginTop: RelativeSize(20),
    },
    subtitle: {
        color: "#DDD",
        textAlign: "center",
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.subtitulo,
        marginTop: RelativeSize(10),
        marginBottom: RelativeSize(20),
    },

    search: {
        backgroundColor: "white",
        borderRadius: RelativeSize(10),
        padding: RelativeSize(12),
        marginBottom: RelativeSize(20),
    },

    card: {
        backgroundColor: "white",
        borderRadius: RelativeSize(20),
        paddingHorizontal: RelativeSize(16),
        paddingVertical: RelativeSize(14),
        marginBottom: RelativeSize(18),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    // NUEVO: contenedor de la parte de texto
    cardInfo: {
        flex: 1,
        marginRight: RelativeSize(12),
    },

    // NUEVO: título dentro de la tarjeta
    cardTitle: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.normal,
        color: "#000",
        marginBottom: RelativeSize(10),
    },

    // NUEVO: texto "Ver más"
    cardSeeMore: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.small,
        color: "#EC008C",      // rosado similar al ejemplo
    },

    // NUEVO: imagen a la derecha
    cardImage: {
        width: RelativeSize(70),
        height: RelativeSize(70),
        borderRadius: RelativeSize(16),
    },


    estado: {
        paddingVertical: RelativeSize(5),
        paddingHorizontal: RelativeSize(12),
        borderRadius: RelativeSize(14),
        marginTop: RelativeSize(5),
        alignSelf: "flex-start",
    },
    pendiente: { backgroundColor: "gray" },
    completa: { backgroundColor: "green" },

      modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    menuContent: {
        backgroundColor: "white",
        width: RelativeSize(200),
        padding: RelativeSize(20),
        borderRadius: RelativeSize(15),
    },
    menuBtn: {
        padding: RelativeSize(12),
        backgroundColor: "#EC008C",
        borderRadius: RelativeSize(10),
        marginBottom: RelativeSize(10),
    },
    menuText: {
        color: "white",
        textAlign: "center",
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.normal,
    },
});
