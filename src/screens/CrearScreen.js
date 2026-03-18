import React, { useState, useEffect, useCallback } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { Checkbox } from "react-native-paper";

import { useNetInfo } from '@react-native-community/netinfo';
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import ColorShema from "./style/ColorSchema";
import Constantes from "../api/Constantes";
import LoadingOverlay from '../componentes/LoadingOverlay';
import ApiBase from '../api/apiBase';
import apiPost from '../api/apiPost';
import { RelativeSize, validarPasswordSegura } from '../componentes/funciones'

import PersonFontSize from "../api/PersonFontSize";

import { useLang } from "../i18n/LanguageProvider";

export default function CrearScreen({ navigation, route }) {
  const { t } = useLang();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [email2, setEmail2] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [unidad, setUnidad] = useState('');
  const [rol, setRol] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const netInfo = useNetInfo();
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  const titulo = t("create.title");
  const terminosTexto = t("create.terminoTexto");

  // ✅ FUNCIÓN OPTIMIZADA: Reduce espacios y maneja negritas
  const renderTerminosConFormato = (texto) => {
    if (!texto) return null;

    const lineas = texto.split('\n');

    return (
      <Text style={styles.modalText}>
        {lineas.map((linea, index) => {
          const trimmedLinea = linea.trim();
          
          // Condición para Títulos (Mayúsculas o Numerados)
          const esTituloPrincipal = trimmedLinea === "POLÍTICAS, TÉRMINOS Y CONDICIONES DE USO";
          const esLineaNumerada = /^\d+\./.test(trimmedLinea);

          if (esTituloPrincipal || esLineaNumerada) {
            return (
              <Text key={index}>
                {"\n"}
                <Text style={styles.boldText}>{trimmedLinea}</Text>
                {"\n"}
              </Text>
            );
          }

          // Si la línea está vacía, no agregamos espacio extra innecesario
          if (trimmedLinea === "") return null;

          // Párrafo normal (sin saltos de línea adicionales al inicio)
          return <Text key={index}>{trimmedLinea}{"\n"}</Text>;
        })}
      </Text>
    );
  };

  const validarEmail = (email2) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email2);
  };

  const validarTelefono = (texto) => {
    return texto.length === 10;
  };

  const handleRegistrar = async () => {
    if (netInfo.isConnected) {
      if (nombre && apellido && email && email2 && telefono && unidad && rol && password && password2) {
        if (validarEmail(email)) {
          if (validarTelefono(telefono)) {
            if (checked) {
              if (!validarPasswordSegura(password)) {
                Alert.alert(t("create.warn"), t("create.errors.weakPassword"));
                return;
              }
              if (email == email2) {
                if (password == password2) {
                  const body = JSON.stringify({ Nombre: nombre, Apellido: apellido, Email: email, Telefono: telefono, Unidad: unidad, Rol: rol, Password: password });
                  setLoading(true);
                  const result = await apiPost(ApiBase.apiRegistro, body);
                  setLoading(false);
                  if (result.success) {
                    if (result.data.response == "OK") {
                      Alert.alert(t("create.infoAt"), t("create.infoOk"), [{
                        text: "OK",
                        onPress: () => { navigation.goBack(); }
                      }]);
                    } else {
                      Alert.alert(t("create.warn"), result.data.mensaje);
                    }
                  } else {
                    Alert.alert(t("create.warn"), t("create.errors.server"));
                  }
                } else {
                  Alert.alert(t("create.warn"), t("create.errors.passwordMismatch"));
                }
              } else {
                Alert.alert(t("create.warn"), t("create.errors.emailMismatch"));
              }
            } else {
              Alert.alert(t("create.warn"), t("create.errors.mustAgree"));
            }
          } else {
            Alert.alert(t("create.warn"), t("create.errors.invalidPhone"));
          }
        } else {
          Alert.alert(t("create.warn"), t("create.errors.invalidEmail"));
        }
      } else {
        Alert.alert(t("create.warn"), t("create.errors.fillAll"));
      }
    } else {
      Alert.alert(t("create.warn"), t("stepCommon.offline"), [{
        text: "OK",
        onPress: () => { navigation.goBack(); }
      }]);
    }
  }

  const handleIniciar = async () => {
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{t("create.subtitle")}</Text>
        
        <View style={styles.row}>
          <TextInput placeholder={t("create.names")}
            value={nombre}
            onChangeText={setNombre}
            placeholderTextColor="#666"
            style={[styles.input, { flex: 1 }]} />
          <TextInput placeholder={t("create.lastNames")}
            value={apellido}
            onChangeText={setApellido}
            placeholderTextColor="#666"
            style={[styles.input, { flex: 1 }]} />
        </View>

        <TextInput
          placeholder={t("create.email")}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#666"
          keyboardType="email-address"
        />
        <TextInput
          placeholder={t("create.confirmEmail")}
          value={email2}
          onChangeText={setEmail2}
          style={styles.input}
          placeholderTextColor="#666"
          keyboardType="email-address"
        />

        <View style={styles.row}>
          <View style={[styles.input, styles.codigo]}>
            <Text style={{ fontFamily: PersonFontSize.regular, fontSize: PersonFontSize.medium }}>🇨🇴  +57</Text>
          </View>
          <TextInput
            placeholder={t("create.phone")}
            value={telefono}
            onChangeText={setTelefono}
            placeholderTextColor="#666"
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
          />
        </View>

        <TextInput
          placeholder={t("create.institution")}
          value={unidad}
          onChangeText={setUnidad}
          placeholderTextColor="#666"
          style={styles.input}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={rol}
            onValueChange={(itemValue) => setRol(itemValue)}
            style={styles.pickerStyle}
            dropdownIconColor={ColorShema.AZULOSCURO}
            itemStyle={{ color: ColorShema.AZULOSCURO }}
          >
            <Picker.Item style={styles.pickerItem} label={t("create.selectRole")} value="" />
            <Picker.Item style={styles.pickerItem} label={t("create.roleExternal")} value="4" />
            <Picker.Item style={styles.pickerItem} label={t("create.roleAgent")} value="5" />
          </Picker>
        </View>

        <View style={styles.inputIcon}>
          <TextInput
            placeholder={t("create.password")}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#666"
            style={{ flex: 1, color: ColorShema.AZULOSCURO }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputIcon}>
          <TextInput
            placeholder={t("create.confirmPassword")}
            secureTextEntry={!showPassword2}
            value={password2}
            onChangeText={setPassword2}
            placeholderTextColor="#666"
            style={{ flex: 1, color: ColorShema.AZULOSCURO }}
          />
          <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}>
            <Ionicons
              name={showPassword2 ? "eye" : "eye-off"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.check}>
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => setChecked(!checked)}
            color="#ff008c"
          />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.link}>{t("create.agree")} <Text style={styles.bold}>{t("create.terms")}</Text></Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.boton, !checked && { opacity: 0.4 }]}
          disabled={!checked} onPress={handleRegistrar}>
          <Text style={styles.botonTexto}>{t("create.register")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonSecundario} onPress={handleIniciar}>
          <Text style={styles.botonSecundarioTexto}>{t("create.already")}</Text>
        </TouchableOpacity>

        <Modal animationType="slide" visible={modalVisible}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("create.terms")}</Text>
            <ScrollView style={styles.scroll}>
              {/* Llamada a la función de renderizado */}
              {renderTerminosConFormato(terminosTexto)}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>{t("create.close")}</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <LoadingOverlay visible={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: ColorShema.FONDO,
    paddingVertical: RelativeSize(20),
  },
  titulo: {
    color: ColorShema.BLANCO,
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    textAlign: "center",
    marginBottom: RelativeSize(10),
    marginTop: RelativeSize(20),
  },
  subtitulo: { 
    color: ColorShema.BLANCO, 
    fontFamily: PersonFontSize.bold, 
    fontSize: PersonFontSize.subtitulo, 
    textAlign: 'left', 
    width: '90%' 
  },
  row: {
    flexDirection: "row",
    gap: RelativeSize(10),
    marginBottom: RelativeSize(5),
    width: '90%',
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: RelativeSize(12),
    paddingVertical: RelativeSize(10),
    borderRadius: RelativeSize(10),
    marginBottom: RelativeSize(5),
    color: "#0D1249",
    width: '90%',
    minHeight: 44,
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  codigo: {
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    width: '90%',
    marginBottom: RelativeSize(5),
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: RelativeSize(12),
    overflow: "hidden",
    minHeight: 50,
  },
  pickerStyle: {
    height: 50,
    width: '100%',
    backgroundColor: ColorShema.BLANCO,
  },
  pickerItem: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal
  },
  pickerItemBold: {
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal
  },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: RelativeSize(12),
    borderRadius: RelativeSize(10),
    marginBottom: RelativeSize(5),
    gap: RelativeSize(10),
    width: '90%',
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  check: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: RelativeSize(10),
    marginBottom: RelativeSize(5),
  },
  link: {
    color: "#ffffff",
    textDecorationLine: "underline",
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
  },
  bold: {
    fontFamily: PersonFontSize.bold,
  },
  boton: {
    backgroundColor: "#FF007F",
    padding: RelativeSize(12),
    width: '90%',
    borderRadius: RelativeSize(10),
    alignItems: "center",
    marginBottom: RelativeSize(10),
  },
  botonTexto: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.subtitulo,
  },
  botonSecundario: {
    backgroundColor: "white",
    padding: RelativeSize(10),
    borderRadius: RelativeSize(10),
    width: '90%',
    alignItems: "center",
  },
  botonSecundarioTexto: {
    textAlign: "center",
    color: "#000",
    fontFamily: PersonFontSize.bold,
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
    color: '#000',
    marginBottom: 10
  },
  modalText: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: '#333',
    lineHeight: 22, // Ajusta el espacio entre líneas de párrafos
    textAlign: 'justify'
  },
  boldText: {
    fontFamily: PersonFontSize.bold,
    color: '#000',
    fontSize: PersonFontSize.normal + 1, // Un poquito más grande para destacar
  },
  scroll: {
    marginTop: RelativeSize(15),
  },
  closeBtn: {
    backgroundColor: "#ff008c",
    padding: RelativeSize(12),
    borderRadius: RelativeSize(10),
    marginTop: RelativeSize(20),
    marginBottom: RelativeSize(20),
  },
  closeText: {
    textAlign: "center",
    color: "white",
    fontFamily: PersonFontSize.bold,
  },
});