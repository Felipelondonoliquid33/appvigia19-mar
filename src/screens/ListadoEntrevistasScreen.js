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
    Alert,
} from "react-native";
import { useLang } from "../i18n/LanguageProvider";

import DateTimePicker from "@react-native-community/datetimepicker";
import PersonFontSize from "../api/PersonFontSize";

import FooterNav from "../componentes/FooterNav";
import { getDiligenciarByUser, eliminarDiligenciarById } from "../database/diligenciar";
import { buscarCatalogo } from '../database/catalogos';
import { RelativeSize } from '../componentes/funciones'


export default function ListadoEntrevistasScreen({ navigation, route }) {
    const { t } = useLang();
    const { user } = route.params || {};
    const usuario = user;
    const [diligenciadas, setDiligenciadas] = useState([]);

    const PAGE_SIZE = 5;

    const [search, setSearch] = useState("");
    const [data, setData] = useState(diligenciadas.slice(0, PAGE_SIZE));
    const [page, setPage] = useState(1);

    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDiligenciadas = async () => {
        try {
            const listado = getDiligenciarByUser( usuario.id);
            setDiligenciadas(listado);
        } catch (e) {
            // Error al cargar el listado de entrevistas del usuario
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
     *  BUSCAR POR ID O FECHA
     *  ============================= */
    const filtrar = (texto) => {
        setSearch(texto);

        const filtrado = diligenciadas.filter(
            (item) =>
                item.id.includes(texto)
        );

        setData(filtrado.slice(0, PAGE_SIZE));
        setPage(1);
    };

    const formatearYYYYMMDD = (date) => {
        const y = String(date.getFullYear());
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}${m}${d}`;
    };

    const onChangeDate = (event, selectedDate) => {
        // Android: si cancela, selectedDate viene undefined
        setShowDatePicker(false);
        if (!selectedDate) return;

        const texto = formatearYYYYMMDD(selectedDate);
        filtrar(texto); // esto también hace setSearch(texto)
    };


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

    /** =============================
     *  ABRIR MENÚ EN LOS TRES PUNTOS
     *  ============================= */
    const abrirMenu = (item) => {
        setSelectedItem(item);
        setMenuVisible(true);
    };

    /** =============================
     *  ACCIONES DEL MENÚ
     *  ============================= */

    const verEntrevista = () => {
        setMenuVisible(false);
        let catalogos = buscarCatalogo();
        if (catalogos != null) {
            let entrevistas = JSON.parse(catalogos.entrevistas);
            let esta = false;
            let regTipo = null;
            for (const item of entrevistas) {
                if (item.IdTipo == selectedItem.idTipo) {
                    esta = true;
                    regTipo = item.Tipo;
                }
            }

            if (!esta) {
                Alert.alert(t("listado.warn"), t("listado.noConfigured"));
            } else {
                let titulo = "";
                if (selectedItem.idTipo == 1) {
                    titulo = t("listado.interview1");
                } else if (selectedItem.idTipo == 2) {
                    titulo = t("listado.interview2");
                } else if (selectedItem.idTipo == 3) {
                    titulo = t("listado.interview3");
                } else {
                    titulo = t("listado.interview4");
                }
                navigation.navigate('Instruccion', { user: usuario, tipo: selectedItem.idTipo, titulo: titulo, informacion: regTipo.Informacion, id: selectedItem.id });
            }


        }

    };

    const borrarEntrevista = () => {
        setMenuVisible(false);
        if (eliminarDiligenciarById(selectedItem.id)) {
            Alert.alert(t("listado.info"), t("listado.deleted") + selectedItem.id, [{
                text: "OK",
                onPress: () => {
                    navigation.replace('Home', { user: usuario });
                }
            }]);
        } else {
            Alert.alert(t("listado.warn"), t("listado.deleteError") + selectedItem.id);
        }
    };


    /** =============================
     *  RENDERIZAR CADA ITEM
     *  ============================= */
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.cardText}>ID: {item.id}</Text>
                <Text style={styles.cardText}>{item.nombreTipo}</Text>
                <Text style={styles.cardText}>{item.fechaRegistro}</Text>

                {/* Estado con color */}
                <View
                    style={[
                        styles.estado,
                        item.completa === 0 ? styles.pendiente : styles.completa,
                    ]}
                >
                    <Text style={{ color: "white", fontFamily: PersonFontSize.regular, fontSize: PersonFontSize.small }}>    {item.completa === 0
                        ? t("listado.status.pending")
                        : t("listado.status.completed")}
                    </Text>
                </View>
            </View>

            {/* Tres puntos */}
            <TouchableOpacity onPress={() => abrirMenu(item)}>
                <Text style={styles.dots}>⋮</Text>
            </TouchableOpacity>
        </View>
    );

    const handleAnterior = () => {
        navigation.goBack();
    };


    return (
        <View style={styles.container}>

            <View style={styles.content}>

                {/* HEADER FIJO: ícono de retroceso alineado igual en todos los celulares */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleAnterior}>
                        <Image
                            source={require("../../assets/iconos/retorceder.png")}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                </View>


                <Text style={styles.title}>{t("listado.title")}</Text>

                <Text style={styles.subtitle}>{t("listado.subtitle")}</Text>

                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t("listado.search")}
                        placeholderTextColor="#AAA"
                        value={search}
                        onChangeText={filtrar}
                    />

                    <TouchableOpacity
                        style={styles.calendarBtn}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.calendarIcon}>📅</Text>
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}

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
            <FooterNav navigation={navigation} usuario={usuario} active="Listado" />

            {/* MENÚ DESPLEGABLE */}
            <Modal visible={menuVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.menuContent}>

                        <TouchableOpacity style={styles.menuBtn} onPress={verEntrevista}>
                            <Text style={styles.menuText}>{selectedItem?.completa === 0 ? t("listado.menu.resume") : t("listado.menu.results")}</Text>
                        </TouchableOpacity>

                        {selectedItem?.textoCompleta === "Pendiente" && (
                            <TouchableOpacity style={styles.menuBtn} onPress={borrarEntrevista}>
                                <Text style={styles.menuText}>{t("listado.menu.delete")}</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.menuBtn}
                            onPress={() => setMenuVisible(false)}
                        >
                            <Text style={styles.menuText}>{t("listado.cancel")}</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#061047" },
    content: { flex: 1, padding: 20 },
    scrollArea: {
        flex: 1,
        paddingHorizontal: RelativeSize(20),
        paddingTop: RelativeSize(20),
    },
    /* 🔙 Botón Regresar */
    backButton: {
        width: RelativeSize(30),
        height: RelativeSize(30),
        borderRadius: RelativeSize(20),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: RelativeSize(20),
        marginTop: RelativeSize(10),
    },
    backIcon: {
        width: RelativeSize(30),
        height: RelativeSize(30),
        fontWeight: "bold",
    },
    header: {
        height: RelativeSize(60),
        marginTop: RelativeSize(20),
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

    searchRow: {
        backgroundColor: "white",
        borderRadius: RelativeSize(10),
        marginBottom: RelativeSize(20),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: RelativeSize(12),
    },

    searchInput: {
        flex: 1,
        paddingVertical: RelativeSize(12),
        paddingRight: RelativeSize(8),
    },

    calendarBtn: {
        paddingLeft: RelativeSize(8),
        paddingVertical: RelativeSize(8),
    },

    calendarIcon: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.wtitulo,
    },


    card: {
        backgroundColor: "white",
        borderRadius: RelativeSize(20),
        padding: RelativeSize(20),
        marginBottom: RelativeSize(18),
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardText: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.small,
        color: "#333",
        marginBottom: RelativeSize(3),
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

    dots: {
        fontFamily: PersonFontSize.regular,
        fontSize: PersonFontSize.wtitulo,
        color: "#555",
        paddingRight: RelativeSize(5),
    },

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
