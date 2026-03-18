// PasoTresScreen.js
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";

import XLSX from "xlsx-js-style";
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { useLang } from "../i18n/LanguageProvider";

import FooterNav from "../componentes/FooterNav";
import LoadingOverlay from '../componentes/LoadingOverlay';
import { buscarCatalogo } from '../database/catalogos';

import PersonFontSize from "../api/PersonFontSize";

import ApiBase from '../api/apiBase';
import apiPost from '../api/apiPost';
import { RelativeSize, getFechaRegistro } from '../componentes/funciones'
import {actualizarDiligenciar} from "../database/diligenciar";

// =================== COMPONENTE ===================
export default function PasoTresScreen({ navigation, route }) {
    const { t } = useLang();
    const { user, tipo, titulo, entrevista, diligenciar, detalle } = route.params || {};
    const usuario = user;
    const categorias = detalle.Categorias;
    const puntuacionTotal = detalle.Puntaje;
    const nivelRiesgo = detalle.NombreRiesgo;

    const colorBarra = (detalle.IdRiesgo === 1 ? "green" : (detalle.IdRiesgo === 2 ? "yellow" : "red"));
    const recomendaciones = detalle.Sugerencias;
    const [loading, setLoading] = useState(false);
    const [generos, setGeneros] = useState([]);
    const [etnias, setEtnias] = useState([]);
    const [grados, setGrados] = useState([]);
    const [nacionalidades, setNacionalidades] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [discapacidades, setDiscapacidades] = useState([]);
    const [riesgos, setRiesgos] = useState([]);

    // Leyenda completa debajo de la barra
    const leyendaRiesgos = detalle.Riesgos
        .map((r) => `${r.Riesgo.Nombre} (${r.Minimo}-${r.Maximo})`)
        .join(".\n");

    // Texto de recomendaciones
    const textoRecomendaciones = recomendaciones
        .map((r) => r.Sugerencia)
        .join("\n");

    const handleCatalog = async () => {
        try {
            let catalogos = buscarCatalogo();
            if(!catalogos) return;

            // Use safe parsing with fallbacks
            let lstGeneros = JSON.parse(catalogos.generos) || [];
            setGeneros(lstGeneros);
            
            let lstEtnias = JSON.parse(catalogos.etnias) || [];
            setEtnias(lstEtnias);
            
            let lstGrados = JSON.parse(catalogos.grados) || [];
            setGrados(lstGrados);
            
            let lstPaises = JSON.parse(catalogos.nacionalidades) || [];
            setNacionalidades(lstPaises);
            
            let lstDepartamentos = JSON.parse(catalogos.departamentos) || [];
            setDepartamentos(lstDepartamentos);
            
            let lstMunicipios = JSON.parse(catalogos.municipios) || [];
            setMunicipios(lstMunicipios);
            
            let lstDiscapacidades = JSON.parse(catalogos.discapacidades) || [];
            setDiscapacidades(lstDiscapacidades);
            
            let lstRiesgos = JSON.parse(catalogos.riesgos) || [];
            setRiesgos(lstRiesgos);
        } catch (e) {
            console.log("Error loading catalogs in PasoTres:", e);
        }
    }

    const handleEnviar = async () => {
        if (diligenciar.completa === 1 && diligenciar.enviada === 0) {
            diligenciar.json = JSON.stringify(detalle);
            try {
                const headers = {
                    Authorization: `Bearer ${usuario.token}`,
                };
                const body = JSON.stringify({
                    registro: diligenciar.json,
                });
                const result = await apiPost(ApiBase.apiEnviar, body, headers);
                if (result.success) {
                    if (result.data.response == "OK") {
                        try {
                            detalle.Id = result.data.id;
                            diligenciar.enviada = 1;
                            diligenciar.fechaEnvio = getFechaRegistro();
                            diligenciar.json = JSON.stringify(detalle);
                            actualizarDiligenciar(diligenciar);
                        } catch (e) {
                            // Error al actualizar el registro local tras el envío
                        }
                    }
                }
            } catch (e) {
                // Error al enviar la entrevista al servidor
            }
        }
    }
    useEffect(() => {
        handleCatalog();
        handleEnviar();
    }, []);

    const buscarItemCatalogo = (tabla, id) => {
        let item = { Id: 0, Nombre: "No Aplica" };
        if (id > 0) {
            item = tabla.find(c => c.Id === id);
        }
        return item.Nombre;
    }

    const getSiNo = (id) => {
        let res = "No";
        if (id && id > 0) {
            res = "Sí";
        }
        return res;
    }

    const getRomano = (id) => {
        let res = "I";
        if (id === 2) {
            res = "II";
        } else if (id === 3) {
            res = "III";
        } else if (id === 4) {
            res = "IV";
        }
        return res;
    }

    const manejarDescargar = async () => {
        ("Descargar resultados");
        setLoading(true);
        try {
            const ws = {};
            let merge = [];
            let row = 1;

            const estiloTitulo = {
                font: { bold: true, sz: 18, color: { rgb: "FFFFFF" } },
                alignment: { horizontal: "center", vertical: "center" },
                fill: { patternType: "solid", fgColor: { rgb: "EC008C" } },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };
            ws[`A${row}`] = { v: "REPORTE INDIVIDUAL DE EVALUACIÓN", t: "s" };
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 5, estiloTitulo);
            ws["!rows"] = [];
            ws["!rows"][row - 1] = { hpt: 40 };  // 40 puntos de alto
            row++;

            const estiloSubTitulo = {
                font: { bold: true, sz: 16 },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };

            ws[`A${row}`] = { v: "1. Información general - Datos demográficos", t: "s" };
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 5, estiloSubTitulo);
            row++;

            const estiloNegritaCentrado = {
                font: { bold: true, sz: 14 },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };

            const estiloNegritaDerecha = {
                font: { bold: true, sz: 14 },
                alignment: { horizontal: "right", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };

            const estiloNormalCentrado = {
                font: { bold: false, sz: 14 },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };

            const estiloNegrita = {
                font: { bold: true, sz: 14 },
                alignment: { vertical: "center", wrapText: true },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };

            const estiloNormal = {
                font: { bold: false, sz: 14 },
                alignment: { vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };

            ws[`A${row}`] = { v: "ID", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 0, estiloNegrita);

            ws[`B${row}`] = { v: diligenciar.id, t: "s" };
            merge.push({ s: { r: row - 1, c: 1 }, e: { r: row - 1, c: 2 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 1, 2, estiloNormal);

            ws[`D${row}`] = { v: "Género", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 3, 3, estiloNegrita);

            ws[`E${row}`] = { v: buscarItemCatalogo(generos, detalle.IdGenero), t: "s" };
            merge.push({ s: { r: row - 1, c: 4 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 4, 5, estiloNormal);
            row++;

            ws[`A${row}`] = { v: "Edad", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 0, estiloNegrita);

            ws[`B${row}`] = { v: detalle.Edad, t: "s" };
            merge.push({ s: { r: row - 1, c: 1 }, e: { r: row - 1, c: 2 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 1, 2, estiloNormal);

            ws[`D${row}`] = { v: "Pertenencia étnico-campesina", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 3, 3, estiloNegrita);

            ws[`E${row}`] = { v: buscarItemCatalogo(etnias, detalle.IdEtnia), t: "s" };
            merge.push({ s: { r: row - 1, c: 4 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 4, 5, estiloNormal);
            row++;

            ws[`A${row}`] = { v: "Nacionalidad", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 0, estiloNegrita);

            ws[`B${row}`] = { v: buscarItemCatalogo(nacionalidades, detalle.IdNacionalidad), t: "s" };
            merge.push({ s: { r: row - 1, c: 1 }, e: { r: row - 1, c: 2 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 1, 2, estiloNormal);

            ws[`D${row}`] = { v: "Fecha de Nacimiento", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 3, 3, estiloNegrita);

            ws[`E${row}`] = { v: detalle.FechaNacimiento, t: "s" };
            merge.push({ s: { r: row - 1, c: 4 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 4, 5, estiloNormal);
            row++;

            ws[`A${row}`] = { v: "Escolarizado", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 0, estiloNegrita);

            ws[`B${row}`] = { v: getSiNo(detalle.Escolarizado), t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 1, 1, estiloNormal);

            ws[`C${row}`] = { v: "Victima del conflicto armado (desplazado)", t: "s" };
            merge.push({ s: { r: row - 1, c: 2 }, e: { r: row - 1, c: 3 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 2, 3, estiloNegrita);

            ws[`E${row}`] = { v: getSiNo(detalle.Desplazamineto), t: "s" };
            merge.push({ s: { r: row - 1, c: 4 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 4, 5, estiloNormal);
            row++;

            ws[`A${row}`] = { v: "Migrante", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 0, estiloNegrita);

            ws[`B${row}`] = { v: getSiNo(detalle.Migrante), t: "s" };
            merge.push({ s: { r: row - 1, c: 1 }, e: { r: row - 1, c: 2 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 1, 2, estiloNormal);

            ws[`D${row}`] = { v: "Grado", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 3, 3, estiloNegrita);

            ws[`E${row}`] = { v: buscarItemCatalogo(grados, detalle.IdGrado), t: "s" };
            merge.push({ s: { r: row - 1, c: 4 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 4, 5, estiloNormal);
            row++;

            ws[`A${row}`] = { v: "Zona", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 0, estiloNegrita);
            ws[`B${row}`] = { v: detalle.Zona, t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 1, 1, estiloNormal);
            ws[`C${row}`] = { v: "Departamento", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 2, 2, estiloNegrita);
            let nombre = buscarItemCatalogo(departamentos, detalle.IdDepartamento);
            ws[`D${row}`] = { v: nombre, t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 3, 3, estiloNormal);
            ws[`E${row}`] = { v: "Municipio", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 4, 4, estiloNegrita);
            ws[`F${row}`] = { v: buscarItemCatalogo(municipios, detalle.IdMunicipio), t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 5, 5, estiloNormal);
            row++;
            row++;

            ws[`A${row}`] = { v: "2. Versión aplicada", t: "s" };
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 5, estiloSubTitulo);
            row++;

            ws[`A${row}`] = { v: "Versión " + getRomano(entrevista.IdTipo) + " - " + entrevista.Tipo.Nombre, t: "s" };
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 5, estiloNormal);
            row++;
            row++;

            ws[`A${row}`] = { v: "3. Puntajes por categoría", t: "s" };
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 5, estiloSubTitulo);
            row++;

            ws[`A${row}`] = { v: "N°", t: "s" };
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 0, estiloNegritaCentrado);
            ws[`B${row}`] = { v: "Categoría de evaluación", t: "s" };
            merge.push({ s: { r: row - 1, c: 1 }, e: { r: row - 1, c: 3 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 1, 3, estiloNegritaCentrado);
            ws[`E${row}`] = { v: "Puntaje obtenido", t: "s" };
            merge.push({ s: { r: row - 1, c: 4 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 4, 5, estiloNegritaCentrado);
            row++;

            let n = 0;
            for (let i = 0; i < detalle.Categorias.length; i++) {
                let catg = detalle.Categorias[i];
                n++;

                ws[`A${row}`] = { v: n, t: "s" };
                aplicarEstiloRango(ws, row - 1, row - 1, 0, 0, estiloNormalCentrado);

                ws[`B${row}`] = { v: catg.Categoria, t: "s" };
                merge.push({ s: { r: row - 1, c: 1 }, e: { r: row - 1, c: 3 } });
                aplicarEstiloRango(ws, row - 1, row - 1, 1, 3, estiloNormal);

                ws[`E${row}`] = { v: catg.Puntaje, t: "s" };
                merge.push({ s: { r: row - 1, c: 4 }, e: { r: row - 1, c: 5 } });
                aplicarEstiloRango(ws, row - 1, row - 1, 4, 5, estiloNormalCentrado);

                row++;
            }

            ws[`A${row}`] = { v: "Total general", t: "s" };
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 3 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 3, estiloNegritaDerecha);

            ws[`E${row}`] = { v: detalle.Puntaje, t: "s" };
            merge.push({ s: { r: row - 1, c: 4 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 4, 5, estiloNegritaCentrado);
            row++;
            row++;

            ws[`A${row}`] = { v: "4. Nivel de riesgo general", t: "s" };
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 5, estiloSubTitulo);
            row++;

            let riesgo = riesgos.find(c => c.Id === detalle.IdRiesgo);
            if (riesgo) {
                ws[`A${row}`] = { v: riesgo.Nombre + ": " + riesgo.Descripcion, t: "s" };
            } else {
                ws[`A${row}`] = { v: "No se encontro el riesgo", t: "s" };
            }
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 5, estiloNormal);
            row++;
            row++;

            ws[`A${row}`] = { v: "5. Recomendaciones, Acciones / canalización realizadas", t: "s" };
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 5, estiloSubTitulo);
            row++;


            let sugerencia = "";
            if (textoRecomendaciones) {
                sugerencia = textoRecomendaciones;
            }
            ws[`A${row}`] = { v: sugerencia, t: "s" };
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 5, estiloNormal);
            ws["!rows"][row - 1] = { hpt: 70 };
            row++;
            row++;

            ws[`A${row}`] = { v: "6. Observaciones", t: "s" };
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 5, estiloSubTitulo);
            row++;

            sugerencia = "";
            if (detalle.Observaciones) {
                sugerencia = detalle.Observaciones;
            }
            ws[`A${row}`] = { v: sugerencia, t: "s" };
            merge.push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            aplicarEstiloRango(ws, row - 1, row - 1, 0, 5, estiloNormal);
            ws["!rows"][row - 1] = { hpt: 70 };


            ws["!merges"] = merge;

            ws["!cols"] = [
                { wch: 30 },
                { wch: 20 },
                { wch: 20 },
                { wch: 35 },
                { wch: 20 },
                { wch: 20 },
            ];

            ws["!ref"] = `A1:F${row}`;

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Resultados");
            const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
            const uri = FileSystem.documentDirectory + `reporte_${Date.now()}.xlsx`;
            await FileSystem.writeAsStringAsync(uri, wbout, {
                encoding: 'base64'
            });
            await Sharing.shareAsync(uri);
        } catch (error) {
            Alert.alert('Advertencia', 'Error generando Excel');
        }

        setLoading(false);
    };


    const aplicarEstiloRango = (ws, filaIni, filaFin, colIni, colFin, estilo) => {
        for (let r = filaIni; r <= filaFin; r++) {
            for (let c = colIni; c <= colFin; c++) {
                const addr = XLSX.utils.encode_cell({ r, c }); // {r:0,c:0} -> "A1"
                const celda = ws[addr] || { t: "s", v: "" };   // no pisar v si ya existe
                celda.s = { ...(celda.s || {}), ...estilo };   // mezcla estilos
                ws[addr] = celda;
            }
        }
    };

    const handleAnterior = async => {
        navigation.replace('PasoComentario', { user: user, tipo: tipo, titulo: titulo, entrevista: entrevista, diligenciar: diligenciar, detalle: detalle });
    }

    const handleExit = async => {
        navigation.navigate("Entrevista", { user: usuario });
    }



    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                {/* Botón atrás (icono) */}
                <TouchableOpacity style={styles.headerIconLeft} onPress={handleAnterior}>
                    <Image
                        source={require("../../assets/iconos/retorceder.png")}
                        style={{ width: RelativeSize(25), height: RelativeSize(25) }}
                    />
                </TouchableOpacity>

                {/* Icono de salir (derecha) – puedes cambiar por imagen */}
                <TouchableOpacity
                    style={styles.headerIconRight}
                    onPress={handleExit}
                >
                    <Image
                        source={require("../../assets/iconos/salir.png")}
                        style={{ width: RelativeSize(25), height: RelativeSize(25) }}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Título principal */}
                <Text style={styles.tituloPrincipal}>{t("stepThree.title")}{"\n" + diligenciar.id}</Text>

                {/* ================== PUNTAJES POR CATEGORÍA ================== */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t("stepThree.scoresByCategory")}</Text>

                    {categorias.map((cat) => (
                        <View key={cat.idCategoria} style={styles.row}>
                            <View style={styles.rowDivider} />
                            <Text style={styles.rowText}>{cat.Categoria}</Text>
                            <Text style={styles.rowValue}>{cat.Puntaje}</Text>
                        </View>
                    ))}

                    <View style={[styles.row, { marginTop: 10 }]}>
                        <View style={styles.rowDivider} />
                        <Text style={[styles.rowText, { fontWeight: "bold" }]}>
                            {t("stepThree.totalScore")}
                        </Text>
                        <Text style={[styles.rowValue, { fontWeight: "bold" }]}>
                            {puntuacionTotal}
                        </Text>
                    </View>
                </View>

                {/* ================== NIVEL DE RIESGO ================== */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t("stepThree.riskLevel")}</Text>

                    <Text style={styles.nivelRiesgoTexto}>{nivelRiesgo}</Text>

                    {/* Barra de color según el nivel */}
                    <View style={styles.barraContenedor}>
                        <View style={[styles.barraRiesgo, { backgroundColor: colorBarra }]} />
                    </View>

                    {/* Leyenda de todos los niveles */}
                    <Text style={styles.leyendaRiesgos}>{leyendaRiesgos}</Text>
                </View>

                {/* ================== RECOMENDACIONES ================== */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t("stepThree.recommendations")}</Text>

                    <Text style={styles.subTituloRiesgo}>{nivelRiesgo}</Text>

                    <Text style={styles.textoRecomendaciones}>{textoRecomendaciones}</Text>
                </View>

                {/* ================== BOTÓN DESCARGAR ================== */}
                <TouchableOpacity style={styles.botonDescargar} onPress={manejarDescargar}>
                    <Text style={styles.botonDescargarTexto}>{t("stepThree.download")}</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* ✅ Footer reusable */}
            <FooterNav navigation={navigation} usuario={usuario} active="PasoTres" />
            <LoadingOverlay visible={loading} />
        </View>
    );
}

// =================== ESTILOS ===================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#07133B", // Azul oscuro de fondo
    },
    content: {
        paddingHorizontal: RelativeSize(20),
        paddingTop: RelativeSize(10),
        paddingBottom: RelativeSize(140), // espacio para que el footer no tape contenido
    },
    header: {
        height: RelativeSize(60),
        justifyContent: "center",
        marginBottom: RelativeSize(10),
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
        fontSize: PersonFontSize.titulo,
        textAlign: "center",
        marginBottom: RelativeSize(25),
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: RelativeSize(20),
        padding: RelativeSize(20),
        marginBottom: RelativeSize(20),
    },
    cardTitle: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.subtitulo,
        textAlign: "center",
        marginBottom: RelativeSize(15),
        color: "#000",
    },
    row: {
        flexDirection: "column",
        marginBottom: RelativeSize(12),
    },
    rowDivider: {
        height: RelativeSize(2),
        backgroundColor: "#EC008C", // mismo fucsia
        marginBottom: RelativeSize(6),
        borderRadius: RelativeSize(2),
    },
    rowText: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.normal,
        color: "#333",
        textAlign: "center",
        marginBottom: RelativeSize(4),
    },
    rowValue: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.subtitulo,
        color: "#001A4D",
        textAlign: "center",
    },

    nivelRiesgoTexto: {
        fontFamily: PersonFontSize.bold,
        fontSize: PersonFontSize.titulo,
        textAlign: "center",
        color: "#001A4D",
        marginBottom: RelativeSize(10),
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
        fontSize: PersonFontSize.normal,
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
        fontSize: PersonFontSize.medium,
    },
});
