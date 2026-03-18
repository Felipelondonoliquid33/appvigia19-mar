import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Checkbox } from "react-native-paper";
import { useNetInfo } from '@react-native-community/netinfo';

import { useLang } from "../i18n/LanguageProvider";

import ApiBase from '../api/apiBase';
import apiPost from '../api/apiPost';
import LoadingOverlay from '../componentes/LoadingOverlay';

import PersonFontSize from "../api/PersonFontSize";


import {buscarParametros} from  '../database/parametros';
import { RelativeSize } from '../componentes/funciones'


export default function TerminosScreen({ navigation , route }) {
  const { t } = useLang();
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = route.params || {};
  const [loading, setLoading] = useState(false);
  const netInfo = useNetInfo();
  const terminosTexto = t("create.terminoTexto");

  const handleRechazar = async () => {
      navigation.replace('TerminoRechazado', { user: user});
  } 

  const handleAceptar = async () => {
    if (netInfo.isConnected) {
         setLoading(true);
        const url = ApiBase.apiAceptar + "?idUser=" + user.id;
        const result = await apiPost(url,"body");
        if (result.success) {
            setLoading(false);
            if (result.data.response == "OK") {
                const reg = result.data;
                try {
                    actualizarUsuario(reg.id, reg.userName, reg.nombre, reg.email, reg.telefono, reg.rolId, reg.rolNombre, reg.rolSuperUsuario, user.password, reg.token, reg.terminos);
                } catch(ex) {}
                user.terminos = true;
                navigation.replace('Home', { user: user});
            } else {
                Alert.alert(t("create.warn"),result.data.mensaje);
            }
        } else {
            setLoading(false);
            Alert.alert(t("create.warn"),t("create.serverError"));
        }
    } else {
        Alert.alert(t("create.warn"),t("create.noInternetLater"));
    }
  } 

  return (
    <View style={styles.container}>
      <Image resizeMode="contain"
          source={require('../../assets/iconos/seguridad.png')}
          style={{ width: RelativeSize(72), height: RelativeSize(72),marginTop: RelativeSize(50)}}
        />

      <Text style={styles.title}>{t("terms.title")}</Text>
      <Text style={styles.subtitle}>{t("terms.subtitle")}</Text>

      <Text style={styles.paragraph}>{t("terms.p1")}</Text>

      <Text style={styles.paragraph}>{t("terms.p2")}</Text>

      {/* Checkbox + Link */}
      <View style={styles.row}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={() => setChecked(!checked)}
          color="#ff008c"
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.link}>{t("terms.link")}</Text>
        </TouchableOpacity>
      </View>

      {/* Botón Continuar */}
      <TouchableOpacity
        style={[styles.btn, !checked && { opacity: 0.4 }]}
        disabled={!checked} onPress={handleAceptar}
      >
        <Text style={styles.btnText}>{t("terms.continue")}</Text>
      </TouchableOpacity>

      {/* Botón Rechazar */}
      <TouchableOpacity style={styles.rejectBtn} onPress={handleRechazar} >
        <Text style={styles.rejectText}>{t("terms.reject")}</Text>
      </TouchableOpacity>

      {/* ✅ Modal con contenido del Word */}
      <Modal animationType="slide" visible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{t("terms.modalTitle")}</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.modalText}>{terminosTexto}</Text>
          </ScrollView>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeText}>{t("terms.close")}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <LoadingOverlay visible={loading} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f3b",
    padding: RelativeSize(25),
     alignItems: "center",
  },
  title: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    marginTop: RelativeSize(10),
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
    textAlign: "center",
    marginTop: RelativeSize(8),
  },
  paragraph: {
    color: "white",
    marginTop: RelativeSize(20),
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    lineHeight: RelativeSize(22),
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: RelativeSize(25),
  },
  link: {
    color: "#ffffff",
    textDecorationLine: "underline",
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
  },
  btn: {
    backgroundColor: "#ff008c",
    padding: RelativeSize(15),
    borderRadius: 10,
    marginTop: RelativeSize(30),
  },
  btnText: {
    color: "white",
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.medium,
    textAlign: "center",
  },
  rejectBtn: {
    marginTop: 15,
  },
  rejectText: {
    color: "white",
    textAlign: "center",
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
  },
  modalContainer: {
    flex: 1,
    padding: RelativeSize(20),
    backgroundColor: "white",
  },
  modalTitle: {
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    textAlign: "center",
  },
  modalText: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.titulo,
    marginTop: RelativeSize(10),
  },
  scroll: {
    marginTop: RelativeSize(15),
  },
  closeBtn: {
    backgroundColor: "#ff008c",
    padding: RelativeSize(12),
    borderRadius: RelativeSize(10),
    marginTop: RelativeSize(20),
  },
  closeText: {
    textAlign: "center",
    color: "white",
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
  },
});
