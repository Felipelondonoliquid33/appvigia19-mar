import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

import FooterNav from "../componentes/FooterNav";
import { insertarDiligenciar, actualizarDiligenciar, buscarDiligenciaroById } from "../database/diligenciar";
import { getFechaRegistro, RelativeSize } from '../componentes/funciones';
import LoadingOverlay from '../componentes/LoadingOverlay';
import { InactivityProvider } from "../context/InactivityContext";
import InactivityWrapper from "../componentes/InactivityWrapper";
import InactivityModal from "../componentes/InactivityModal";

import PersonFontSize from "../api/PersonFontSize";


const { height } = Dimensions.get("window");

import { useLang } from "../i18n/LanguageProvider";

export default function PasoComentarioScreen({ navigation, route }) {
  const { t } = useLang();
  const { user, tipo, titulo, entrevista, diligenciar, detalle } = route.params || {};
  const usuario = user;
  const [cambio, setCambio] = useState(false);
  const [progreso, setProgreso] = useState(detalle.Avance);
  const [currentIndex, setCurrentIndex] = useState(detalle.IndexIndicador);
  const [indicadorActual, setIndicadorActual] = useState(detalle.Indicadores[detalle.IndexIndicador]);
  const [respuestaActual, setRespuestaActual] = useState(detalle.Indicadores[detalle.IndexIndicador]?.Valor ?? 1);
  const [radioDeshabilitado, setRadioDeshabilitado] = useState((typeof detalle.Indicadores[detalle.IndexIndicador]?.Demografico === "string" &&
   (detalle.Indicadores[detalle.IndexIndicador]?.Demografico ?? "").trim() !== "") || Number(diligenciar.completa) === 1);
  const [esUltimo, setEsUltimo] = useState(detalle.IndexIndicador === detalle.TotalIndicadores - 1);
  const [botonTexto, setBotonTexto] = useState(esUltimo ? (diligenciar.completa === 1 ? t("stepCommon.viewResults") : t("stepCommon.save")) : t("stepCommon.next"));
  const scrollRef = React.useRef();
  const [loading, setLoading] = useState(false);
  const [observaciones, setObservaciones] = useState(detalle.Observaciones ? detalle.Observaciones : "");
  const [confirmVisible, setConfirmVisible] = useState(false);
  // ------------------------------------------
  // Modal de Salir de la Encuesta
  // ------------------------------------------
  const [modalVisible, setModalVisible] = useState(false);
  const [motivoSalida, setMotivoSalida] = useState("");
  const [viewExit, setViewExit] = useState(null);



  const seleccionarOpcion = (idOpcion) => {
    setCambio(true);
    setRespuestaActual(idOpcion);
    indicadorActual.Valor = idOpcion;
  };

  const guardarDetalle = () => {
    try {
    let reg = buscarDiligenciaroById(diligenciar.id);
    let bEsta = false;
    if (reg) {
      bEsta = true;
    }
    diligenciar.json = JSON.stringify(detalle);

    if (bEsta) {
      actualizarDiligenciar(diligenciar);
    } else {
      insertarDiligenciar(diligenciar);
    }
    } catch(e) { /* error al guardar */ }
  }

  useEffect(() => {
    if (observaciones) {
      detalle.Observaciones = observaciones;
      guardarDetalle();
    }
  }, [observaciones]);

  useEffect(() => {
    if (cambio) {
      guardarDetalle();
    }

  }, [respuestaActual]);

  const handlerMotivo = () => {
    if (!motivoSalida) {
      Alert.alert('Advertencia', 'Debe indicar el motivo');
    } else {
      diligenciar.motivo = motivoSalida;
      diligenciar.fechaMotivo = getFechaRegistro();

      let objMotivo = { motivo: diligenciar.motivo, fechaMotivo: diligenciar.fechaMotivo }
      detalle.motivos.push(objMotivo);
      diligenciar.json = JSON.stringify(detalle);
      actualizarDiligenciar(diligenciar);
      setModalVisible(false);
      navigation.replace(viewExit, { user: usuario });
    }
  };

  const validarSalida = (ruta) => {
    setViewExit(ruta);
    if (cambio) {
      setModalVisible(true);
      return false;
    }
    return true;
  };

  const handleExit = () => {
    if (validarSalida("Entrevista")) {
      navigation.navigate("Entrevista", { user: usuario });
    }
  };

  const handleAnterior = async () => {
        detalle.IndexIndicador = detalle.TotalIndicadores - 1;
        navigation.replace('PasoDos', { user: user, tipo: tipo, titulo: titulo, entrevista: entrevista, diligenciar: diligenciar, detalle: detalle });
  };

  const handleSiguiente = async () => {
      if (diligenciar.completa === 0) {
        setConfirmVisible(true);
      } else {
        navigation.replace('PasoTres', { user: user, tipo: tipo, titulo: titulo, entrevista: entrevista, diligenciar: diligenciar, detalle: detalle });
      }
  }

  const finalizarEntrevista = async => {
    setLoading(true);
    detalle.Observaciones = observaciones;
    diligenciar.json = JSON.stringify(detalle);
    diligenciar.completa = 1;
    diligenciar.textoCompleta = "Completa";

    let puntaje = 0;

    for (let i = 0; i < detalle.Categorias.length; i++) {
      let pts = 0;
      let categoria = detalle.Categorias[i];
      for (let j = 0; j < detalle.Indicadores.length; j++) {
        let indicador = detalle.Indicadores[j];
        if (categoria.idCategoria === indicador.IdCategoria) {
          if (indicador.Valor != null) {
            pts += indicador.Valor;
            puntaje += indicador.Valor;
          }
        }
      }
      categoria.Puntaje = pts;

      for (let j = 0; j < categoria.Riesgos.length; j++) {
        let riesgo = categoria.Riesgos[j];
        if (pts >= riesgo.Minimo && pts <= riesgo.Maximo) {
          categoria.IdRiesgo = riesgo.Id;
          categoria.NombreRiesgo = riesgo.Riesgo.Nombre;
        }
      }
      detalle.Categorias[i] = categoria;

    }

    detalle.Puntaje = puntaje;

    for (let j = 0; j < detalle.Riesgos.length; j++) {
      let riesgo = detalle.Riesgos[j];
      if (puntaje >= riesgo.Minimo && puntaje <= riesgo.Maximo) {
        detalle.IdRiesgo = riesgo.Riesgo.Id;
        detalle.NombreRiesgo = riesgo.Riesgo.Nombre;
        detalle.Sugerencias = riesgo.Sugerencias;
      }
    }

    guardarDetalle();

    setLoading(false);

    setCambio(false);

    navigation.replace('PasoTres', { user: user, tipo: tipo, titulo: titulo, entrevista: entrevista, diligenciar: diligenciar, detalle: detalle });


  }

  const onTimeout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };


  return (
    <InactivityProvider onTimeout={onTimeout}>
      <InactivityWrapper>

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

          <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
            {/* Card */}
            <View style={styles.card}>

              <Text style={styles.progressText}>{progreso} %</Text>
              {/* Barra de progreso */}
              <View style={styles.progressBar}>
                <View style={[styles.progressBarInner, { width: `${progreso}%` }]} />
              </View>

              <Text style={styles.tituloTres}>
                {t("stepCommon.observacionTitulo")}
              </Text>


                <View style={{ marginTop: 10 }}>
                  <TextInput
                    style={styles.textarea}
                    editable={!radioDeshabilitado}
                    placeholder={t("stepCommon.observationPlaceholder")}
                    value={observaciones}
                    onChangeText={(text) => {
                      setCambio(true);          // activar flag
                      setObservaciones(text);   // guardar texto
                    }} multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              {/* Botón Siguiente / Guardar */}
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  respuestaActual == null && styles.buttonDisabled, // deshabilitar si no ha contestado
                ]}
                disabled={respuestaActual == null}
                onPress={handleSiguiente}
              >
                <Text style={styles.primaryButtonText}>{botonTexto}</Text>
              </TouchableOpacity>


            </View>
          </ScrollView>

          {/* MODAL SALIR */}
          <Modal visible={modalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={{ fontFamily: PersonFontSize.bold, fontSize: PersonFontSize.titulo, marginBottom: RelativeSize(10)}}>
                  {t("stepCommon.exitInterview")}
                </Text>

                <TextInput
                  style={styles.textarea}
                  placeholder={t("stepCommon.reasonPlaceholder")}
                  value={motivoSalida}
                  onChangeText={setMotivoSalida}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity style={styles.btnGuardar} onPress={handlerMotivo}>
                    <Text style={styles.btnText}>{t("stepCommon.accept")}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnCancelar}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.btnText}>{t("stepCommon.cancel")}</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>

          {/* MODAL Confirmación */}
          <Modal visible={confirmVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={{ fontFamily: PersonFontSize.bold, fontSize: PersonFontSize.titulo, marginBottom: RelativeSize(10)}}>
                  {t("stepCommon.finishTitle")}
                </Text>

                <Text style={styles.modalText}>
                  {t("stepCommon.finishWord1")}{" "}
                  <Text style={styles.bold}>{t("stepCommon.finishWord2")}</Text>{t("stepCommon.finishWord3")}{" "}
                  <Text style={styles.bold}>
                    {t("stepCommon.finishWord4")}
                  </Text>
                </Text>

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity style={styles.btnGuardar} onPress={() => {
                    setConfirmVisible(false);
                    finalizarEntrevista();
                  }}>
                    <Text style={styles.btnText}>{t("stepCommon.finishAcept")}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnCancelar}
                    onPress={() => setConfirmVisible(false)}
                  >
                    <Text style={styles.btnText}>{t("stepCommon.finishCancel")}</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </Modal>


          {/* ✅ Footer reusable */}
          <FooterNav navigation={navigation} usuario={usuario} active="PasoDos" validarAccion={validarSalida} />

          <LoadingOverlay visible={loading} />
          <InactivityModal />
        </View>
      </InactivityWrapper>
    </InactivityProvider>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07133B" },
  header: {
    height: RelativeSize(60),
    justifyContent: "center",
    marginTop: RelativeSize(20),
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
  content: { padding: RelativeSize(20), paddingTop: RelativeSize(30), paddingBottom: RelativeSize(140) },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: RelativeSize(20),
    padding: RelativeSize(20),
    minHeight: height * 0.7,
  },
  btnText: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  btnCancelar: {
    height: RelativeSize(40),
    backgroundColor: "gray",
    paddingVertical: RelativeSize(5),
    paddingHorizontal: RelativeSize(5),
    borderRadius: RelativeSize(10),
    flex: 1,
    marginLeft: RelativeSize(10),
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  btnGuardar: {
    height: RelativeSize(40),
    backgroundColor: "#ff0099",
    paddingVertical: RelativeSize(5),
    paddingHorizontal: RelativeSize(5),
    borderRadius: RelativeSize(10),
    flex: 1,
    marginRight: RelativeSize(10),
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: RelativeSize(20),
    borderRadius: RelativeSize(15),
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: RelativeSize(15),
  },
  modalBox: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: RelativeSize(12),
    padding: RelativeSize(20),
  },
  modalTitle: {
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    marginBottom: RelativeSize(10),
    textAlign: "center",
  },
  modalText: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    textAlign: "center",
    marginBottom: RelativeSize(20),
  },
  bold: {
    fontWeight: "bold",
  },
  btnCancel: {
    padding: RelativeSize(10),
    backgroundColor: "#ff008c",
    borderRadius: RelativeSize(8),
  },
  btnConfirm: {
    padding: RelativeSize(10),
    backgroundColor: "#ff008c",
    borderRadius: RelativeSize(8),
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textarea: {
    height: RelativeSize(120),        // Ajusta según necesidad
    borderWidth: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: RelativeSize(8),
    padding: RelativeSize(10),
    minHeight: 100,
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "#333",
  },
  progressText: {
    textAlign: "center",
    color: "#FF1493",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    marginBottom: RelativeSize(8),
  },
  progressBar: {
    height: RelativeSize(24),
    borderRadius: RelativeSize(12),
    borderWidth: 2,
    borderColor: "#FF1493",
    padding: RelativeSize(2),
    marginBottom: RelativeSize(20),
  },
  progressBarInner: {
    flex: 1,
    borderRadius: RelativeSize(8),
    backgroundColor: "#FF1493",
  },
  tituloUno: {
    color: "#FF1493",
    textAlign: "center",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    marginBottom: RelativeSize(5),
  },
  tituloDos: {
    color: "#FF1493",
    textAlign: "center",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
    marginBottom: RelativeSize(5),
  },
  tituloTres: {
    color: "#000000",
    textAlign: "center",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
    marginBottom: RelativeSize(5),
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: RelativeSize(10),
  },
  radioOuter: {
    width: RelativeSize(22),
    height: RelativeSize(22),
    borderRadius: RelativeSize(11),
    borderWidth: 2,
    borderColor: "#777",
    alignItems: "center",
    justifyContent: "center",
    marginRight: RelativeSize(10),
  },
  radioOuterSelected: {
    borderColor: "#EC008C",
  },
  radioInner: {
    width: RelativeSize(12),
    height: RelativeSize(12),
    borderRadius: RelativeSize(6),
    backgroundColor: "#EC008C",
  },
  radioLabel: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "#333",
  },
  primaryButton: {
    marginTop: RelativeSize(30),
    backgroundColor: "#EC008C",
    borderRadius: RelativeSize(16),
    paddingVertical: RelativeSize(14),
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
  },
  buttonDisabled: {
    backgroundColor: "#d98abf",
  },

});