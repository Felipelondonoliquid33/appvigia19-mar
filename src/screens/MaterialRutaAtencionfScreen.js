import React, { useState } from "react";
import {
    View,
    Image,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Asset } from "expo-asset";
import * as Sharing from "expo-sharing";

import FooterNav from "../componentes/FooterNav";
import ZoomableImageModal from "../componentes/ZoomableImageModal";
import { RelativeSize } from "../componentes/funciones";

const { width } = Dimensions.get("window");

export default function MaterialRutaAtencionfScreen({ navigation, route }) {
    const { user } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [showZoomModal, setShowZoomModal] = useState(false);

    // Referencia a la imagen del flujo para el zoom
    const flujoImageSource = require("../../assets/images/otras/rutaatencionFlujo.png");

    const handleAnterior = () => {
        navigation.goBack();
    };

    const handlerDescargar = async () => {
        setLoading(true);
        try {
            const asset = Asset.fromModule(
                require("../../assets/RUTADescargar.pdf")
            );
            await asset.downloadAsync();

            const uri = asset.localUri || asset.uri;

            const canShare = await Sharing.isAvailableAsync();
            if (!canShare) return;

            await Sharing.shareAsync(uri);
        } catch (e) {
            // Error al compartir el archivo
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <View style={styles.content}>

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleAnterior}>
                        <Image
                            source={require("../../assets/iconos/retorceder.png")}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                </View>

                {/* CONTENIDO */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollInner}
                >
                    <ImageBackground
                        source={require("../../assets/images/fondo.png")}
                        style={styles.card}
                        imageStyle={styles.cardImage}
                        resizeMode="stretch"
                    >

                        {/* TÍTULO */}
                        <View style={styles.titleWrapper}>
                            <Image
                                source={require("../../assets/images/otras/rutaatencionTitulo.png")}
                                style={styles.titleImage}
                            />
                        </View>

                        {/* FLUJO - Toque para hacer zoom */}
                        <TouchableOpacity 
                            style={styles.flowTouchable}
                            onPress={() => setShowZoomModal(true)}
                            activeOpacity={0.9}
                        >
                            <Image
                                source={flujoImageSource}
                                style={styles.flowImage}
                            />
                            <View style={styles.zoomHint}>
                                <Text style={styles.zoomHintText}>Toque para ampliar</Text>
                            </View>
                        </TouchableOpacity>

                        {/* FILA INFERIOR */}
                        <View style={styles.bottomRow}>

                            {/* BOTÓN DESCARGAR */}
                            <TouchableOpacity
                                style={styles.downloadButton}
                                onPress={handlerDescargar}
                                disabled={loading}
                            >
                                <Image
                                    source={require("../../assets/images/otras/rutaatencionDescargar.png")}
                                    style={styles.downloadImage}
                                />
                            </TouchableOpacity>

                            {/* CHICA */}
                            <Image
                                source={require("../../assets/images/otras/rutaatencionChica.png")}
                                style={styles.chicaImage}
                            />
                        </View>

                    </ImageBackground>
                </ScrollView>

                {/* Modal de zoom para la imagen */}
                <ZoomableImageModal
                    visible={showZoomModal}
                    imageSource={flujoImageSource}
                    onClose={() => setShowZoomModal(false)}
                />

                {/* FOOTER */}
                <FooterNav
                    navigation={navigation}
                    usuario={user}
                    active="MaterialRutaAtencion"
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
    scrollInner: {
        paddingHorizontal: RelativeSize(20),
        paddingBottom: RelativeSize(30),
    },

    /* CARD */
    card: {
        borderRadius: RelativeSize(28),
        padding: RelativeSize(20),
        overflow: "hidden",
    },
    cardImage: {
        borderRadius: RelativeSize(28),
    },

    /* TITLE */
    titleWrapper: {
        alignItems: "center",
        marginBottom: RelativeSize(20),
    },
    titleImage: {
        width: "90%",
        height: RelativeSize(90),
        resizeMode: "stretch",
    },

    /* FLOW */
    flowTouchable: {
        marginBottom: RelativeSize(25),
        position: 'relative',
    },
    flowImage: {
        width: "100%",
        height: RelativeSize(420),
        resizeMode: "stretch",
    },
    zoomHint: {
        position: 'absolute',
        bottom: RelativeSize(8),
        right: RelativeSize(8),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: RelativeSize(10),
        paddingVertical: RelativeSize(5),
        borderRadius: RelativeSize(12),
        flexDirection: 'row',
        alignItems: 'center',
    },
    zoomHintText: {
        color: '#fff',
        fontSize: RelativeSize(11),
        fontWeight: '500',
    },

    /* BOTTOM ROW */
    bottomRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },

    downloadButton: {
        flex: 1,
        paddingRight: RelativeSize(10),
    },
    downloadImage: {
        width: RelativeSize(120),
        height: RelativeSize(30),
        resizeMode: "stretch",
        marginBottom: RelativeSize(100),
    },

    chicaImage: {
        width: RelativeSize(100),
        height: RelativeSize(150),
        resizeMode: "stretch",
    },
});
