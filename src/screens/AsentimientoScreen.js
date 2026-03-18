import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { buscarCatalogo } from '../database/catalogos';
import { getFechaFormato, getFechaRegistro, RelativeSize } from '../componentes/funciones'
import { buscarDiligenciaroById } from "../database/diligenciar";

import PersonFontSize from "../api/PersonFontSize";

import { useLang } from "../i18n/LanguageProvider";

export default function AsentimientoScreen({ navigation, route }) {
  const { user, tipo, titulo, informacion, idReg } = route.params || {};
  const usuario = user;
  const { t } = useLang();

  const handleRechazar = async () => {
    navigation.replace('AsentimientoRechazo', { user: user, tipo: tipo, titulo: titulo, informacion: informacion, idReg: idReg });
  }

  const handleAceptar = async () => {
    // Load catalog synchronously here to avoid stale-closure issues with re-renders
    let entrevista = null;
    const catalogos = buscarCatalogo();
    if (catalogos) {
      const entrevistas = JSON.parse(catalogos.entrevistas);
      for (const item of entrevistas) {
        if (item.IdTipo == tipo) {
          entrevista = item;
        }
      }
    }
    if (!entrevista) return; // catalog not ready, do nothing

    let id = usuario.id.toString() + getFechaFormato();
    if (!idReg) {
      let diligenciar = { id: id,idUsuario: user.id,idTipo: entrevista.IdTipo, nombreTipo: "V" + entrevista.IdTipo + "- " + entrevista.Tipo.Nombre, edadEntrevista: entrevista.Edad, momentoUno: entrevista.MomentoUno, momentoDos: entrevista.MomentoDos, momentoTres: entrevista.MomentoTres, json: "", fechaRegistro: getFechaRegistro(), completa: 0, textoCompleta: "Pendiente", enviada: 0, fechaEnvio: null, motivo: null, fechaMotivo: null };
      let detalle = {
        Id: null
        , IdEntrevista: entrevista.Id
        , IdReferencia: diligenciar.id
        , FechaNacimiento: null
        , Edad: null
        , Zona: null
        , AsistenciaRegular: null
        , IdGenero: null
        , VictimaConflicto: null
        , Desplazamineto: null
        , Migrante: null
        , Permanente: null
        , IdDiscapacidad: null
        , IdEtnia: null
        , Escolarizado: null
        , IdGrado: null
        , IdNacionalidad: null
        , IdDepartamento: null
        , IdMunicipio: null
        , FechaRegistro: diligenciar.fechaRegistro
        , motivos: []
        , Indicadores: []
        , Categorias: []
        , Riesgos: []
        , Sugerencias: []
        , Puntaje: 0
        , Avance: 0
        , IndexIndicador: null
        , TotalIndicadores: null
        , IdRiesgo: null
        , NombreRiesgo: null
        , Observaciones: null
        , IdUsuario: usuario.id,
      };

      detalle.Riesgos = entrevista.Riesgos;

      let indicadores = [];

      for (let i = 0; i < entrevista.Categorias.length; i++) {
        let catg = entrevista.Categorias[i];

        let categoria = {
          idCategoriaRespuesta: null
          , idCategoria: catg.Id
          , Categoria: catg.Categoria.Nombre 
          , CategoriaEn: catg.Categoria.NombreEn
          , CategoriaColor: catg.Categoria.Color
          , Puntaje: null
          , IdRiesgo: null
          , NombreRiesgo: null
          , Riesgos: catg.Riesgos
        };
        detalle.Categorias.push(categoria);

        for (let j = 0; j < catg.Preguntas.length; j++) {
          let preg = catg.Preguntas[j];

          for (let k = 0; k < preg.Indicadores.length; k++) {
            let indi = preg.Indicadores[k];

            let indicador = {
              IdRespuesta: null
              , IdCategoria: catg.Id
              , Categoria: catg.Categoria.Nombre
              , CategoriaEn: catg.Categoria.NombreEn
              , CategoriaColor: catg.Categoria.Color
              , IdCategoriaRespuesta: null
              , IdPregunta: preg.Id
              , Pregunta: preg.Enunciado
              , Dirigida: preg.Tipo ? preg.Tipo.Nombre : null
              , IdPreguntaRespuesta: null
              , IdIndicador: indi.Id
              , Indicador: indi.Enunciado
              , Demografico: indi.Demografico
              , Valor: null
              , Nota: indi.Nota
              , NotaPregunta: null
              , NotaRespuesta: null
              , Opciones: indi.Opciones
            };

            detalle.Indicadores.push(indicador);
          }
        }
      }

      detalle.TotalIndicadores = detalle.Indicadores.length;

      navigation.replace('PasoUno', { user: user, tipo: tipo, titulo: titulo, entrevista: entrevista, diligenciar: diligenciar, detalle: detalle });
    } else {
      let diligenciar = buscarDiligenciaroById(idReg);
      let detalle = JSON.parse(diligenciar.json);

      if(diligenciar.completa === 0) {
        navigation.replace('PasoUno', { user: user, tipo: tipo, titulo: titulo, entrevista: entrevista, diligenciar: diligenciar, detalle: detalle });
      } else {
        navigation.replace('PasoTres', { user: user, tipo: tipo, titulo: titulo, entrevista: entrevista, diligenciar: diligenciar, detalle: detalle });
      }
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView resizeMode="contain"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Ícono */}
        <Image resizeMode="contain"
          source={require("../../assets/iconos/seguridad.png")}
          style={{ width: RelativeSize(60), marginTop: RelativeSize(10), marginBottom: RelativeSize(10) }}
        />

        {/* Título */}
        <Text style={styles.title}>{t("assent.title")}</Text>

        {/* Texto principal */}
        <Text style={styles.description}>{informacion}</Text>

        {/* Botón Aceptar */}
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={handleAceptar}
        >
          <Text style={styles.acceptText}>{t("assent.accept")}</Text>
        </TouchableOpacity>

        {/* Rechazar */}
        <TouchableOpacity onPress={handleRechazar}>
          <Text style={styles.rejectText}>{t("assent.reject")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f3b",
    paddingHorizontal: RelativeSize(30),
  },

  scrollContent: {
    alignItems: "center",
    paddingTop: RelativeSize(50),
    paddingBottom: RelativeSize(40),
  },

  icon: {
    width: RelativeSize(50),
    height: RelativeSize(50),
    marginBottom: RelativeSize(20),
    tintColor: "#ff0099",
    resizeMode: "contain",
  },

  title: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    textAlign: "center",
    marginBottom: RelativeSize(20),
    lineHeight: RelativeSize(28),
  },

  description: {
    color: "white",
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    textAlign: "center",
    lineHeight: RelativeSize(24),
    marginBottom: RelativeSize(25),
  },

  acceptButton: {
    backgroundColor: "#ff0099",
    width: "70%",
    height: RelativeSize(48),
    borderRadius: RelativeSize(12),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: RelativeSize(25),
  },

  acceptText: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
  },

  rejectText: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
    textDecorationLine: "underline",
  },
});
