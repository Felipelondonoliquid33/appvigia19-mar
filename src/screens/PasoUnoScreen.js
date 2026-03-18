// EntrevistaScreen.js
import React, { useState, useEffect, useMemo } from "react";
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
  InteractionManager,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import GenericPicker from "../componentes/GenericPicker";
import { useLang } from "../i18n/LanguageProvider";

import PersonFontSize from "../api/PersonFontSize";

import FooterNav from "../componentes/FooterNav";

import { validarMayor18, validarMayorToYear, getFechaNacimiento, getFechaRegistro, calcularEdad, RelativeSize } from '../componentes/funciones';
import { buscarCatalogo } from '../database/catalogos';
import { insertarDiligenciar, actualizarDiligenciar, buscarDiligenciaroById } from "../database/diligenciar";

import { InactivityProvider } from "../context/InactivityContext";
import InactivityWrapper from "../componentes/InactivityWrapper";
import InactivityModal from "../componentes/InactivityModal";

export default function PasoUnoScreen({ navigation, route }) {
  const { user, tipo, titulo, entrevista, diligenciar, detalle } = route.params || {};
  const usuario = user;
  const { t } = useLang();
  const [cambio, setCambio] = useState(false);
  const [viewExit, setViewExit] = useState(null);
  const [isDisabled, setIsDisabled] = useState(detalle.VictimaConflicto == null || detalle.VictimaConflicto === 0 || diligenciar.completa === 1);
  const [isDisabled2, setIsDisabled2] = useState(detalle.Migrante == null || detalle.Migrante === 0 || diligenciar.completa === 1);
  const [isDisabled3, setIsDisabled3] = useState(detalle.Escolarizado == null || detalle.Escolarizado === 0 || diligenciar.completa === 1);
  const [formData, setFormData] = useState({
    IdReferencia: diligenciar.id,
    fechaNacimiento: detalle.FechaNacimiento,
    edad: detalle.Edad,
    genero: detalle.IdGenero,
    victimaConflicto: detalle.VictimaConflicto,
    migrante: detalle.Migrante,
    permanente: detalle.Permanente,
    etnia: detalle.IdEtnia,
    escolarizado: detalle.Escolarizado,
    grado: detalle.IdGrado,
    nacionalidad: detalle.IdNacionalidad,
    departamento: detalle.IdDepartamento,
    municipio: detalle.IdMunicipio,
    zona: detalle.Zona,
    asistenciaRegular: detalle.AsistenciaRegular,
    desplazamineto: detalle.Desplazamineto,
    discapacidad: detalle.IdDiscapacidad,
  });
  const [deshabilitados] = useState(diligenciar.completa === 1);

  const ZONAS = useMemo(() => ([
    { value: "Urbano", label: t("stepOne.urban") },
    { value: "Rural", label: t("stepOne.rural") },
  ]), [t]);

  const [generos, setGeneros] = useState([]);
  const [openEtnia, setOpenEtnia] = useState(false);
  const [valueEtnia, setValueEtnia] = useState(detalle.IdEtnia);
  const [itemsEtnia, setItemsEtnia] = useState([]);

  const [openGrado, setOpenGrado] = useState(false);
  const [valueGrado, setValueGrado] = useState(detalle.IdGrado);
  const [itemsGrado, setItemsGrado] = useState([]);

  const [openDiscapacidad, setOpenDiscapacidad] = useState(false);
  const [valueDiscapacidad, setValueDiscapacidad] = useState(detalle.IdDiscapacidad);
  const [itemsDiscapacidad, setItemsDiscapacidad] = useState([]);

  const [openNac, setOpenNac] = useState(false);
  const [valueNac, setValueNac] = useState(detalle.IdNacionalidad);
  const [itemsNac, setItemsNac] = useState([]);

  // Estados para Departamento
  const [openDep, setOpenDep] = useState(false);
  const [valueDep, setValueDep] = useState(detalle.IdDepartamento);
  const [itemsDep, setItemsDep] = useState([]);

  // Estados para Municipio
  const [municipios, setMunicipios] = useState([]);
  const [openMun, setOpenMun] = useState(false);
  const [valueMun, setValueMun] = useState(detalle.IdMunicipio);
  const [itemsMun, setItemsMun] = useState([]);

  // ------------------------------------------
  // Modal de Salir de la Encuesta
  // ------------------------------------------
  const [modalVisible, setModalVisible] = useState(false);
  const [motivoSalida, setMotivoSalida] = useState("");

  const handlerMotivo = () => {
    if (!motivoSalida) {
      Alert.alert(t("stepCommon.warning"), t("stepCommon.stateReason"));
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


  const handleCatalog = async () => {
    try {
    let catalogos = buscarCatalogo();
    if (!catalogos) return;

    let lstGeneros = JSON.parse(catalogos.generos) || [];
    setGeneros(lstGeneros);

    let lstEtnias = JSON.parse(catalogos.etnias) || [];
    setItemsEtnia([
      { label: t("stepOne.notApplicable"), value: 0 },
      ...(Array.isArray(lstEtnias) ? lstEtnias : []).map(d => ({
        label: d?.Nombre ?? "",
        value: d?.Id
      })).filter(item => item.value != null)
    ]);

    let lstGrados = JSON.parse(catalogos.grados) || [];
    setItemsGrado([
      { label: t("stepOne.notApplicable"), value: 0 },
      ...(Array.isArray(lstGrados) ? lstGrados : []).map(d => ({
        label: d?.Nombre ?? "",
        value: d?.Id
      })).filter(item => item.value != null)
    ]);

    let lstPaises = JSON.parse(catalogos.nacionalidades) || [];
    setItemsNac(
      (Array.isArray(lstPaises) ? lstPaises : []).map(g => ({
        label: g?.Nombre ?? "",
        value: g?.Id
      })).filter(item => item.value != null)
    );

    let lstDepartamentos = JSON.parse(catalogos.departamentos) || [];
    setItemsDep(
      (Array.isArray(lstDepartamentos) ? lstDepartamentos : []).map(d => ({
        label: d?.Nombre ?? "",
        value: d?.Id
      })).filter(item => item.value != null)
    );

    let lstMunicipios = JSON.parse(catalogos.municipios) || [];
    setMunicipios(Array.isArray(lstMunicipios) ? lstMunicipios : []);

    let lstDiscapacidades = JSON.parse(catalogos.discapacidades) || [];
    setItemsDiscapacidad([
      { label: t("stepOne.notApplicable"), value: 0 },
      ...(Array.isArray(lstDiscapacidades) ? lstDiscapacidades : []).map(d => ({
        label: d?.Nombre ?? "",
        value: d?.Id
      })).filter(item => item.value != null)
    ]);

    } catch (e) {
      // Error cargando catalogos - la pantalla sigue funcional con listas vacias
    }
  }

  useEffect(() => {
    if (municipios && detalle.IdDepartamento && detalle.IdMunicipio) {
      let lstMunicipios = municipios.filter(d => d.IdDepartamento === detalle.IdDepartamento);

      setItemsMun(
        lstMunicipios.map(m => ({
          label: m.Nombre,
          value: m.Id
        }))
      );
      setValueMun(detalle.IdMunicipio);
      updateForm("municipio", detalle.IdMunicipio, false);
    }
  }, [municipios]);

  useEffect(() => {
    if (!cambio) return;
    const task = InteractionManager.runAfterInteractions(() => {
      try {
        detalle.FechaNacimiento = formData.fechaNacimiento;
        detalle.Edad = formData.edad;
        detalle.IdGenero = formData.genero;
        detalle.VictimaConflicto = formData.victimaConflicto;
        detalle.Migrante = formData.migrante;
        detalle.IdEtnia = formData.etnia;
        detalle.Escolarizado = formData.escolarizado;
        detalle.IdGrado = formData.grado;
        detalle.IdNacionalidad = formData.nacionalidad;
        detalle.IdDepartamento = formData.departamento;
        detalle.IdMunicipio = formData.municipio;
        detalle.Permanente = formData.permanente;
        detalle.Zona = formData.zona;
        detalle.AsistenciaRegular = formData.asistenciaRegular;
        detalle.Desplazamineto = formData.desplazamineto;
        detalle.IdDiscapacidad = formData.discapacidad;

        let reg = buscarDiligenciaroById(diligenciar.id);
        diligenciar.json = JSON.stringify(detalle);
        if (reg) {
          actualizarDiligenciar(diligenciar);
        } else {
          insertarDiligenciar(diligenciar);
        }
      } catch (e) {
        // Error al guardar cambios en PasoUno
      }
    });
    return () => task.cancel();
  }, [formData]);

  const handlerSiguiente = async () => {

    if (formData.fechaNacimiento == null
      || formData.genero == null
      || formData.victimaConflicto == null
      || formData.migrante == null
      || formData.etnia == null
      || formData.escolarizado == null
      || formData.grado == null
      || formData.nacionalidad == null
      || formData.departamento == null
      || formData.municipio == null
      || formData.zona == null
      || formData.discapacidad == null
    ) {
      Alert.alert(t("stepCommon.warning"), t("stepCommon.fillAll"));
    } else if (formData.victimaConflicto && formData.desplazamineto == null) {
      Alert.alert(t("stepCommon.warning"), t("stepCommon.fillAll"));
    } else if (formData.migrante && formData.permanente == null) {
      Alert.alert(t("stepCommon.warning"), t("stepCommon.fillAll"));
    } else if (formData.escolarizado && formData.asistenciaRegular == null) {
      Alert.alert(t("stepCommon.warning"), t("stepCommon.fillAll"));
    } else {

      let index = null;

      let contestadas = 0;
      let puntaje = 0;

      for (let i = 0; i < detalle.Indicadores.length; i++) {
        let indicador = detalle.Indicadores[i];

        if (indicador.Demografico && indicador.Demografico === "edad") {
          if (detalle.Edad < 8) {
            indicador.Valor = 0;
          } else if (detalle.Edad < 8) {
            indicador.Valor = 1;
          } else {
            indicador.Valor = 3;
          }
        } else if (indicador.Demografico && indicador.Demografico === "indigena") {
          if (detalle.IdEtnia && detalle.IdEtnia > 0) {
            indicador.Valor = 3;
          } else {
            indicador.Valor = 0;
          }
        } else if (indicador.Demografico && indicador.Demografico === "migracion") {
          if (detalle.Permanente && detalle.Permanente > 0) {
            indicador.Valor = 3;
          } else {
            indicador.Valor = 0;
          }
        } else if (indicador.Demografico && indicador.Demografico === "desplazamineto") {
          if (detalle.Desplazamineto && detalle.Desplazamineto > 0) {
            indicador.Valor = 3;
          } else {
            indicador.Valor = 0;
          }
        } else if (indicador.Demografico && indicador.Demografico === "educacionregular") {
          if (detalle.AsistenciaRegular && detalle.AsistenciaRegular > 0) {
            indicador.Valor = 3;
          } else {
            indicador.Valor = 0;
          }
        } else if (indicador.Demografico && indicador.Demografico === "impedimento") {
          if (detalle.IdDiscapacidad && detalle.IdDiscapacidad > 0) {
            indicador.Valor = 3;
          } else {
            indicador.Valor = 0;
          }
        } else if (indicador.Demografico && indicador.Demografico.trim() !== "") {
          // Tipo demográfico no reconocido — auto-responder con 0 para no bloquear la entrevista
          indicador.Valor = 0;
        }

        if (indicador.Valor == null && index == null) {
          index = i;
        }

        if (indicador.Valor != null) {
          contestadas++;
          puntaje += indicador.Valor;
        }

        detalle.Indicadores[i] = indicador;
      }

      if (index == null) {
        index = detalle.Indicadores.length - 1;
      }

      detalle.IndexIndicador = index;
      detalle.Puntaje = puntaje;
      detalle.Avance = Math.round((contestadas / detalle.TotalIndicadores) * 100);

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

      navigation.replace('PasoDos', { user: user, tipo: tipo, titulo: titulo, entrevista: entrevista, diligenciar: diligenciar, detalle: detalle });


    }
  }


  useEffect(() => {
    handleCatalog();
  }, [navigation]);

  useEffect(() => {
    if (!valueDep) {
      setItemsMun([]);
      setValueMun(null);
      updateForm("municipio", null, false);
      return;
    }

    let lstMunicipios = municipios.filter(d => d.IdDepartamento === valueDep);

    if (lstMunicipios) {
      setItemsMun(
        lstMunicipios.map(m => ({
          label: m.Nombre,
          value: m.Id
        }))
      );

      if (valueDep === detalle.IdDepartamento && detalle.IdMunicipio) {
        setValueMun(detalle.IdMunicipio);
        updateForm("municipio", detalle.IdMunicipio, false);
      } else {
        setValueMun(null);
        updateForm("municipio", null, false);
      }
    }
  }, [valueDep]);


  const handleBack = async () => {
    // Acción de retroceso — sin implementación activa
  };

  const validarSalida = (ruta) => {
    setViewExit(ruta);
    if (cambio) {
      setModalVisible(true);
      return false;
    }
    return true;
  }

  const handleExit = async () => {
    if (validarSalida("Entrevista")) {
      navigation.navigate("Entrevista", { user: usuario });
    }
  };

  // ------------------------------------------
  // Manejador genérico para actualizar JSON
  // ------------------------------------------

  const updateForm = (key, value, actCambio) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
    if (actCambio) {
      setCambio(true);
    }
  };

  // ------------------------------------------
  // Date Picker
  // ------------------------------------------
  const [showDate, setShowDate] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    setShowDate(false);
    if (selectedDate && validarMayor18(selectedDate)) {
      Alert.alert(t("stepCommon.warning"), t("stepOne.mustBe18"));
      return;
    } else if(!validarMayorToYear(selectedDate,diligenciar.edadEntrevista)) {  
      Alert.alert(t("stepCommon.warning"), t("stepOne.mustBeAge", { count: diligenciar.edadEntrevista }));
      return;
    } else {
      if (selectedDate) {
        updateForm("fechaNacimiento", getFechaNacimiento(selectedDate), true);

        try {
          let edad = calcularEdad(selectedDate);
          updateForm("edad", edad, true);
        } catch (e) { }
      }
    }
  };

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
          {/* Header con iconos */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconBtnRight} onPress={handleExit}>
              <Image
                source={require("../../assets/iconos/salir.png")}
                style={{ width: RelativeSize(25), height: RelativeSize(25) }}
              />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>
              {t("stepOne.title")}
              {"\n"}
              {titulo}
            </Text>

            {/* Card */}
            <View style={styles.card}>
              <Text style={styles.label}>ID</Text>
              <TextInput
                readOnly={true}
                style={styles.input}
                value={formData.IdReferencia.toString()}
                placeholderTextColor="#9A9A9A"
              />

              {/* Fecha de nacimiento */}
              <Text style={styles.label}>{t("stepOne.birthDate")}</Text>
              <TouchableOpacity
                disabled={deshabilitados}
                style={styles.input}
                onPress={() => setShowDate(true)}
              >
                <Text>
                  {formData.fechaNacimiento
                    ? formData.fechaNacimiento
                    : t("stepOne.selectDate")}
                </Text>
              </TouchableOpacity>

              {showDate && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  onChange={onChangeDate}
                />
              )}

              {/* GENERO */}
              <Text style={styles.label}>{t("stepOne.gender")}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  enabled={!deshabilitados}
                  selectedValue={formData.genero}
                  onValueChange={(v) => updateForm("genero", v, true)}
                >
                  <Picker.Item label={t("stepOne.select")} value={null} />
                  {generos.map((g) => (
                    <Picker.Item
                      key={g.Id}
                      label={g.Nombre}
                      value={g.Id}
                    />
                  ))}
                </Picker>
              </View>

              {/* RADIO: Victima conflicto */}
              <Text style={styles.label}>{t("stepOne.victimConflict")}</Text>
              <View style={styles.radioGroup}>
                {[t("stepCommon.yes"), t("stepCommon.no")].map((txt) => (
                  <TouchableOpacity
                    key={txt}
                    disabled={deshabilitados}
                    style={[
                      styles.radioItem,
                      deshabilitados && { opacity: 0.4 }, // solo para que se vea deshabilitado
                    ]}
                    onPress={() => {

                      let vDis = txt === t("stepCommon.yes") ? false : true;

                      setIsDisabled(vDis);

                      if (vDis) {
                        updateForm("desplazamineto", 0, true); // No
                      }

                      updateForm("victimaConflicto", txt === t("stepCommon.yes") ? 1 : 0, true)
                    }}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        formData.victimaConflicto === (txt === t("stepCommon.yes") ? 1 : 0) &&
                        styles.radioOuterSelected,
                      ]}
                    >
                      {formData.victimaConflicto === (txt === t("stepCommon.yes") ? 1 : 0) && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.radioText}>{txt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* RADIO: Desplazamiento Forzado */}
              <Text style={styles.label}>{t("stepOne.displaced")}</Text>
              <View style={styles.radioGroup}>
                {[t("stepCommon.yes"), t("stepCommon.no")].map((txt) => {

                  return (
                    <TouchableOpacity
                      key={txt}
                      style={[
                        styles.radioItem,
                        isDisabled && { opacity: 0.4 }, // solo para que se vea deshabilitado
                      ]}
                      disabled={isDisabled}
                      onPress={() =>
                        updateForm("desplazamineto", txt === t("stepCommon.yes") ? 1 : 0, true)
                      }
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          formData.desplazamineto === (txt === t("stepCommon.yes") ? 1 : 0) &&
                          styles.radioOuterSelected,
                        ]}
                      >
                        {formData.desplazamineto === (txt === t("stepCommon.yes") ? 1 : 0) && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text style={styles.radioText}>{txt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* RADIO: Migrante */}
              <Text style={styles.label}>{t("stepOne.migrant")}</Text>
              <View style={styles.radioGroup}>
                {[t("stepCommon.yes"), t("stepCommon.no")].map((txt) => (
                  <TouchableOpacity
                    key={txt}
                    disabled={deshabilitados}
                    style={[
                      styles.radioItem,
                      deshabilitados && { opacity: 0.4 }, // solo para que se vea deshabilitado
                    ]}
                    onPress={() => {

                      let vDis = txt === t("stepCommon.yes") ? false : true;

                      setIsDisabled2(vDis);

                      if (vDis) {
                        updateForm("permanente", null, true); // No
                      }

                      updateForm("migrante", txt === t("stepCommon.yes") ? 1 : 0, true)
                    }}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        formData.migrante === (txt === t("stepCommon.yes") ? 1 : 0) &&
                        styles.radioOuterSelected,
                      ]}
                    >
                      {formData.migrante === (txt === t("stepCommon.yes") ? 1 : 0) && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.radioText}>{txt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* RADIO: Es migrante */}
              <Text style={styles.label}>{t("stepOne.migrantType")}</Text>
              <View style={styles.radioGroup}>
                {[t("stepOne.permanent"), t("stepOne.transit")].map((txt) => {

                  return (
                    <TouchableOpacity
                      key={txt}
                      style={[
                        styles.radioItem,
                        isDisabled2 && { opacity: 0.4 }, // solo para que se vea deshabilitado
                      ]}
                      disabled={isDisabled2}
                      onPress={() =>
                        updateForm("permanente", txt === t("stepOne.permanent") ? 1 : 0, true)
                      }
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          formData.permanente === (txt === t("stepOne.permanent") ? 1 : 0) &&
                          styles.radioOuterSelected,
                        ]}
                      >
                        {formData.permanente === (txt === t("stepOne.permanent") ? 1 : 0) && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text style={styles.radioText}>{txt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>


              {/*Combo: etnias */}
              <Text style={styles.label}>{t("stepOne.ethnicity")}</Text>
              <GenericPicker
                visible={openEtnia}
                items={itemsEtnia}
                value={valueEtnia}
                onSelect={(val) => {
                  setValueEtnia(val);
                  updateForm("etnia", val, true);
                  setOpenEtnia(false);
                }}
                onClose={setOpenEtnia}
                title={t("stepOne.ethnicity")}
                disabled={deshabilitados}
                placeholder={t("stepOne.select")}
                searchPlaceholder={t("stepOne.searchEthnicity")}
              />

              {/*Combo: Discapacidades */}
              <Text style={styles.label}>{t("stepOne.disability")}</Text>
              <GenericPicker
                visible={openDiscapacidad}
                items={itemsDiscapacidad}
                value={valueDiscapacidad}
                onSelect={(val) => {
                  setValueDiscapacidad(val);
                  updateForm("discapacidad", val, true);
                  setOpenDiscapacidad(false);
                }}
                onClose={setOpenDiscapacidad}
                title={t("stepOne.disability")}
                disabled={deshabilitados}
                placeholder={t("stepOne.select")}
                searchPlaceholder={t("stepOne.searchDisability")}
              />


              {/* RADIO: Escolarizado */}
              <Text style={styles.label}>{t("stepOne.schooled")}</Text>
              <View style={styles.radioGroup}>
                {[t("stepCommon.yes"), t("stepCommon.no")].map((txt) => (
                  <TouchableOpacity
                    key={txt}
                    disabled={deshabilitados}
                    style={[
                      styles.radioItem,
                      deshabilitados && { opacity: 0.4 }, // solo para que se vea deshabilitado
                    ]}
                    onPress={() => {

                      let vDis = txt === t("stepCommon.yes") ? false : true;

                      setIsDisabled3(vDis);

                      if (vDis) {
                        updateForm("asistenciaRegular", null, true); // No
                      }

                      updateForm("escolarizado", txt === t("stepCommon.yes") ? 1 : 0, true)
                    }}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        formData.escolarizado === (txt === t("stepCommon.yes") ? 1 : 0) &&
                        styles.radioOuterSelected,
                      ]}
                    >
                      {formData.escolarizado === (txt === t("stepCommon.yes") ? 1 : 0) && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.radioText}>{txt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* RADIO: Asistencia Regular */}
              <Text style={styles.label}>{t("stepOne.schoolAttendance")}</Text>
              <View style={styles.radioGroup}>
                {[t("stepCommon.yes"), t("stepCommon.no")].map((txt) => {

                  return (
                    <TouchableOpacity
                      key={txt}
                      style={[
                        styles.radioItem,
                        isDisabled3 && { opacity: 0.4 }, // solo para que se vea deshabilitado
                      ]}
                      disabled={isDisabled3}
                      onPress={() =>
                        updateForm("asistenciaRegular", txt === t("stepCommon.yes") ? 1 : 0, true)
                      }
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          formData.asistenciaRegular === (txt === t("stepCommon.yes") ? 1 : 0) &&
                          styles.radioOuterSelected,
                        ]}
                      >
                        {formData.asistenciaRegular === (txt === t("stepCommon.yes") ? 1 : 0) && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text style={styles.radioText}>{txt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.label}>{t("stepOne.grade")}</Text>
              <GenericPicker
                visible={openGrado}
                items={itemsGrado}
                value={valueGrado}
                onSelect={(val) => {
                  setValueGrado(val);
                  updateForm("grado", val, true);
                  setOpenGrado(false);
                }}
                onClose={setOpenGrado}
                title={t("stepOne.grade")}
                disabled={deshabilitados}
                placeholder={t("stepOne.select")}
                searchPlaceholder={t("stepOne.searchGrade")}
              />

              <Text style={styles.label}>{t("stepOne.nationality")}</Text>
              <GenericPicker
                visible={openNac}
                items={itemsNac}
                value={valueNac}
                onSelect={(val) => {
                  setValueNac(val);
                  updateForm("nacionalidad", val, true);
                  setOpenNac(false);
                }}
                onClose={setOpenNac}
                title={t("stepOne.nationality")}
                disabled={deshabilitados}
                placeholder={t("stepOne.select")}
                searchPlaceholder={t("stepOne.searchNationality")}
              />

              <Text style={styles.label}>{t("stepOne.department")}</Text>
              <GenericPicker
                visible={openDep}
                items={itemsDep}
                value={valueDep}
                onSelect={(val) => {
                  setValueDep(val);
                  updateForm("departamento", val, true);
                  setOpenDep(false);
                }}
                onClose={setOpenDep}
                title={t("stepOne.department")}
                disabled={deshabilitados}
                placeholder={t("stepOne.select")}
                searchPlaceholder={t("stepOne.searchDepartment")}
              />

              <Text style={styles.label}>{t("stepOne.municipality")}</Text>
              <GenericPicker
                visible={openMun}
                items={itemsMun}
                value={valueMun}
                onSelect={(val) => {
                  setValueMun(val);
                  updateForm("municipio", val, true);
                  setOpenMun(false);
                }}
                onClose={setOpenMun}
                title={t("stepOne.municipality")}
                disabled={!valueDep || deshabilitados}
                placeholder={t("stepOne.select")}
                searchPlaceholder={t("stepOne.searchMunicipality")}
              />

              {/* RADIO: Zona */}
              <Text style={styles.label}>{t("stepOne.zone")}</Text>
              <View style={styles.radioGroup}>
                {["Urbano", "Rural"].map((txt) => (
                  <TouchableOpacity
                    key={txt}
                    disabled={deshabilitados}
                    style={[
                      styles.radioItem,
                      deshabilitados && { opacity: 0.4 }, // solo para que se vea deshabilitado
                    ]}
                    onPress={() => updateForm("zona", txt, true)}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        formData.zona === txt && styles.radioOuterSelected,
                      ]}
                    >
                      {formData.zona === txt && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioText}>{txt === "Urbano" ? t("stepOne.urban") : t("stepOne.rural")}</Text>
                  </TouchableOpacity>
                ))}
              </View>


              <TouchableOpacity style={styles.button} onPress={handlerSiguiente}>
                <Text style={styles.buttonText}>{t("stepCommon.next")}</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>

          {/* MODAL SALIR */}
          <Modal visible={modalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={{ fontFamily: PersonFontSize.regular,fontSize: PersonFontSize.titulo, marginBottom: RelativeSize(10) }}>
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


          {/* ✅ Footer reusable */}
          <FooterNav navigation={navigation} usuario={usuario} active="PasoUno" validarAccion={validarSalida} />
          <InactivityModal />
        </View>
      </InactivityWrapper>
    </InactivityProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07133B" },
  header: {
    alignItems: "flex-end",
    marginBottom: RelativeSize(10),
  },
  iconBtnRight: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginTop: RelativeSize(40),
    marginRight: RelativeSize(10),
  },
  pickerContainer: {
    backgroundColor: "#EEE",
    borderRadius: RelativeSize(10),
  },
  radioGroup: {
    flexDirection: "row",
    marginTop: RelativeSize(5),
  },
  radioText: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "#333",
    paddingRight: RelativeSize(5),
    marginLeft: RelativeSize(5), 
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: RelativeSize(20),
  },
  radioOuter: {
    width: RelativeSize(20),
    height: RelativeSize(20),
    borderRadius: RelativeSize(10),
    borderWidth: 2,
    borderColor: "#555",
    marginRight: RelativeSize(5),
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#E91E63",
  },
  radioInner: {
    width: RelativeSize(10),
    height: RelativeSize(10),
    backgroundColor: "#E91E63",
    borderRadius: RelativeSize(5),
  },
  content: { padding: RelativeSize(20), paddingTop: RelativeSize(15), paddingBottom: RelativeSize(140) },
  title: {
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    marginBottom: RelativeSize(5),
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: RelativeSize(20),
    padding: RelativeSize(20),
  },
  label: { marginTop: RelativeSize(10), marginBottom: RelativeSize(5), fontFamily: PersonFontSize.regular, fontSize: PersonFontSize.normal, color: "#333" },
  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: RelativeSize(10),
    paddingHorizontal: RelativeSize(10),
    paddingVertical: RelativeSize(8),
    borderWidth: 1,
    borderColor: "#D0D0D0",
    minHeight: 44,
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "#333",
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
  input2: {
    backgroundColor: "#F2F2F2",
    borderRadius: RelativeSize(10),
    padding: RelativeSize(10),
    borderWidth: 1,
    borderColor: "#D0D0D0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: RelativeSize(20),
    marginRight: RelativeSize(40),
    marginTop: RelativeSize(6),
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: RelativeSize(24),
  },
  radio: {
    width: RelativeSize(20),
    height: RelativeSize(20),
    borderWidth: 2,
    borderColor: "#444",
    borderRadius: RelativeSize(50),
    marginRight: RelativeSize(8),
  },
  radioSelected: {
    backgroundColor: "#EC008C",
    borderColor: "#EC008C",
  },
  button: {
    backgroundColor: "#EC008C",
    padding: RelativeSize(15),
    marginTop: RelativeSize(25),
    borderRadius: RelativeSize(10),
    alignItems: "center",
  },
  buttonText: { color: "white", fontFamily: PersonFontSize.bold, fontSize: PersonFontSize.normal },
  dropdown: {
    backgroundColor: "#F2F2F2",
    borderColor: "#D0D0D0",
    borderRadius: RelativeSize(10),
  },
  dropdownContainer: {
    borderColor: "#D0D0D0",
    backgroundColor: "#fff",
    borderRadius: RelativeSize(10),
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

  btnGuardar: {
    backgroundColor: "#ff0099",
    paddingVertical: RelativeSize(5),
    paddingHorizontal: RelativeSize(5),
    borderRadius: RelativeSize(10),
    flex: 1,
    marginRight: RelativeSize(10),
    alignItems: "center",
  },

  btnCancelar: {
    backgroundColor: "gray",
    paddingVertical: RelativeSize(5),
    paddingHorizontal: RelativeSize(5),
    borderRadius: RelativeSize(10),
    flex: 1,
    marginLeft: RelativeSize(10),
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
  },
});
