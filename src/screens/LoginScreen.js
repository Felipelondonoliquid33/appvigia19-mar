import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import MD5 from "crypto-js/md5";
import { Ionicons } from "@expo/vector-icons";

import { i18n } from "../i18n/i18n";

import ApiBase from "../api/apiBase";
import apiPost from "../api/apiPost";
import LoadingOverlay from "../componentes/LoadingOverlay";

import ColorShema from "./style/ColorSchema";
import Constantes from "../api/Constantes";

import PersonFontSize from "../api/PersonFontSize";

import {
  insertarUsuario,
  buscarUsuarioByUserName,
  actualizarUsuario,
  buscarUsuarioById,
} from "../database/usuarios";

import { truncateParametros, insertarParametros, buscarParametros } from "../database/parametros";
import { getCompletasSinEnviar, actualizarDiligenciar, insertarDiligenciar,buscarDiligenciaroById } from "../database/diligenciar";
import { getFechaRegistro, RelativeSize } from "../componentes/funciones";

import { useLang } from "../i18n/LanguageProvider";

const mheight = (Constantes.width60 * 53.71) / 100;
const fheight = (Constantes.width85 * 17.79) / 100;

export default function LoginScreen({ navigation }) {
  const { t, lang, setLang } = useLang();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [langMenuVisible, setLangMenuVisible] = useState(false);

  const netInfo = useNetInfo();

  const iniciarTerminos = async () => {
    if (netInfo.isConnected) {
      const body = [];
      const result = await apiPost(ApiBase.apiParametros, body);

      if (result.success) {
        if (result.data.response == "OK") {
          let parametro = JSON.parse(result.data.mensaje);
          truncateParametros();
          insertarParametros(parametro.Terminos, parametro.Asentamiento, parametro.Atencion, parametro.TerminosEn, parametro.AsentamientoEn, parametro.AtencionEn);

          i18n.translations.es.create.terminoTexto = parametro.Terminos;
          i18n.translations.en.create.terminoTexto = parametro.TerminosEn;
          i18n.translations.es.routes.description = parametro.Atencion;
          i18n.translations.en.routes.description = parametro.AtencionEn;
          i18n.translations.es.interview.terminoTexto = parametro.Asentamiento;
          i18n.translations.en.interview.terminoTexto = parametro.AsentamientoEn;
        }
      }
    }
  };

  useEffect(() => {
    if (netInfo.isConnected != null) {
      iniciarTerminos();
    }
  }, [netInfo.isConnected]);

  const handleOlvido = async () => navigation.navigate("Olvido");
  const handleCrear = async () => {
    if (lang == "es") {
      navigation.navigate("Crear");
    } else {
      navigation.navigate("Crear");
    }
  };

  const handleEnviarDiligencias = async (usuario) => {
    try {
      let lst = getCompletasSinEnviar();
      if (lst && lst.length > 0) {
        const headers = { Authorization: `Bearer ${usuario.token}` };

        for (let i = 0; i < lst.length; i++) {
          try {
            const body = JSON.stringify({ registro: lst[i].json });
            const result = await apiPost(ApiBase.apiEnviar, body, headers);

            if (result.success) {
              if (result.data.response == "OK") {
                try {
                  let diligenciar = lst[i];
                  let detalle = JSON.parse(diligenciar.json);
                  detalle.Id = result.data.id;
                  diligenciar.enviada = 1;
                  diligenciar.fechaEnvio = getFechaRegistro();
                  diligenciar.json = JSON.stringify(detalle);
                  actualizarDiligenciar(diligenciar);
                } catch (e) { }
              }
            }
          } catch (e) { }
        }
      }
    } catch (e) { }
  };

const handleRecibirDiligencias = async (usuario) => {
  try {
    const headers = { Authorization: `Bearer ${usuario.token}` };
    const body = JSON.stringify({ idUsuario: usuario.id });

    const result = await apiPost(ApiBase.apiRecibir, body, headers);

    if (result.success && result.data.response === "OK") {
      const listado = JSON.parse(result.data.jsonListado || result.data.JsonListado || "[]");
      for (let i = 0; i < listado.length; i++) {
        const reg = listado[i];

        const esta = buscarDiligenciaroById(reg.IdReferencia); // o reg.Id si usas PK
        if (!esta) {
          const diligenciar = {
            id: reg.IdReferencia,             // recomendado: usa IdReferencia como key
            idUsuario: reg.IdUsuario,
            idTipo: reg.IdTipo,
            nombreTipo: reg.NombreTipo,
            json: JSON.stringify(reg),
            fechaRegistro: reg.FechaRegistro,
            edadEntrevista: reg.EdadEntrevista,
            momentoUno: reg.MomentoUno,
            momentoDos: reg.MomentoDos,
            momentoTres: reg.MomentoTres,
            completa: 1,
            textoCompleta: "Completa",
            enviada: 1,
            fechaEnvio: reg.FechaEnvio,
            motivo: null,
            fechaMotivo: null
          };
          insertarDiligenciar(diligenciar);
        }
      }
    }
  } catch (e) {
    // Error al sincronizar entrevistas desde el servidor
  }
};


  const handleLogin = async () => {
    if (username && password) {
      setLoading(true);

      if (netInfo.isConnected) {
        const body = JSON.stringify({
          UserName: encodeURI(username.toLowerCase()),
          PassWord: encodeURI(password),
        });
        const result = await apiPost(ApiBase.apiLogin, body);

        if (result.success) {
          if (result.data.response == "OK") {
            const reg = result.data;
            const usuarios = buscarUsuarioById(reg.id);
            try {
              if (usuarios == null) {
                insertarUsuario(
                  reg.id,
                  reg.userName,
                  reg.nombre,
                  reg.email,
                  reg.telefono,
                  reg.rolId,
                  reg.rolNombre,
                  reg.rolSuperUsuario,
                  MD5(password).toString(),
                  reg.token,
                  reg.terminos
                );
              } else {
                actualizarUsuario(
                  reg.id,
                  reg.userName,
                  reg.nombre,
                  reg.email,
                  reg.telefono,
                  reg.rolId,
                  reg.rolNombre,
                  reg.rolSuperUsuario,
                  MD5(password).toString(),
                  reg.token,
                  reg.terminos
                );
              }
            } catch (ex) { }

            await handleEnviarDiligencias(usuarios);
            handleRecibirDiligencias(usuarios);

            setLoading(false);
            if (reg.terminos) {
              navigation.replace("Home", { user: result.data });
            } else {
              navigation.replace("Terminos", { user: result.data });
            }
          } else {
            setLoading(false);
            Alert.alert(t("login.warn"), `${t("login.authError")}: ${result.data.mensaje}`);
          }
        } else {
          setLoading(false);
          Alert.alert(t("login.warn"), t("login.serverError"));
        }
      } else {
        setLoading(true);
        const usuario = buscarUsuarioByUserName(username);

        if (usuario == null) {
          setLoading(false);
          Alert.alert(t("login.warn"), t("login.offlineNoUser"));
        } else {
          const clave = MD5(password).toString();
          if (clave == usuario.password) {
            setLoading(false);
            if (usuario.terminos) {
              navigation.replace("Home", { user: usuario });
            } else {
              Alert.alert(t("login.warn"), t("login.offlineNoTerms"));
            }
          } else {
            setLoading(false);
            Alert.alert(t("login.warn"), t("login.authError"));
          }
        }
      }
    } else {
      Alert.alert(t("login.warn"), t("login.fillAll"));
    }
  };

  const chooseLanguage = async (newLang) => {
    await setLang(newLang);     // ✅ guarda y aplica global
    setLangMenuVisible(false);  // ✅ cierra menú
  };

  return (
    <View style={styles.container}>
      {/* Icono idioma (abre menú) */}
      <Pressable
        onPress={() => setLangMenuVisible(true)}
        style={styles.langIconWrap}
        hitSlop={10}
      >
        <Image
          resizeMode="contain"
          source={require("../../assets/iconos/idioma.png")}
          style={styles.langIcon}
        />
      </Pressable>

      {/* Menú de idioma */}
      <Modal
        visible={langMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangMenuVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setLangMenuVisible(false)}>
          <Pressable style={styles.langMenu} onPress={() => { }}>
            <Text style={styles.langTitle}>{t("login.language")}</Text>

            <Pressable
              style={[styles.langOption, lang === "es" && styles.langOptionActive]}
              onPress={() => chooseLanguage("es")}
            >
              <Text style={styles.langOptionText}>{t("login.spanish")}</Text>
            </Pressable>

            <Pressable
              style={[styles.langOption, lang === "en" && styles.langOptionActive]}
              onPress={() => chooseLanguage("en")}
            >
              <Text style={styles.langOptionText}>{t("login.english")}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Image
        resizeMode="contain"
        source={require("../../assets/icbfblanco.png")}
        style={{ width: Constantes.width60, height: mheight, marginBottom: RelativeSize(10) }}
      />

      <View style={styles.cajasesion}>
        <Text style={styles.title}>{t("login.title")}</Text>

        <Text style={styles.label}>{t("login.user")}</Text>
        <TextInput style={styles.input}
          placeholderTextColor="#666"
          placeholder={t("login.placeholderUser")}
          value={username} onChangeText={setUsername} />

        <Text style={styles.label}>{t("login.password")}</Text>
        <View style={styles.inputIcon}>
          <TextInput
            placeholder={t("create.password")}
            placeholderTextColor="#666"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.inputSin}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>


        {netInfo.isConnected && (
          <Text style={styles.link} onPress={handleOlvido}>
            {t("login.forgot")}
          </Text>
        )}

        <Pressable
          onPress={handleLogin}
          style={styles.btn}
        >
          <Text style={styles.btnText}>{t("login.signIn")}</Text>
        </Pressable>

        {netInfo.isConnected && (
          <Text style={styles.link} onPress={handleCrear}>
            {t("login.createAccount")}
          </Text>
        )}
      </View>

      <Image
        resizeMode="contain"
        source={require("../../assets/logomodoseguro.png")}
        style={{ width: Constantes.width50, height: mheight, marginTop: RelativeSize(10) }}
      />

      <Image
        resizeMode="stretch"
        source={require("../../assets/creditos.png")}
        style={{ width: Constantes.width85, height: fheight, marginTop: RelativeSize(10) }}
      />

      <LoadingOverlay visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: ColorShema.FONDO },

  langIconWrap: {
    position: "absolute",
    right: RelativeSize(22),
    top: RelativeSize(30),
    zIndex: 10,
  },
  langIcon: { width: RelativeSize(24), height: RelativeSize(24), marginTop: RelativeSize(20), tintColor: "#ffffff" },
  inputIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: RelativeSize(12),
    borderRadius: RelativeSize(5),
    marginBottom: RelativeSize(5),
    borderWidth: 1,          
    borderColor: "#ccc",      
    gap: RelativeSize(10),
    width: '90%',
    minHeight: 44,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: RelativeSize(70),
    paddingRight: RelativeSize(18),
  },
  langMenu: {
    width: RelativeSize(180),
    backgroundColor: ColorShema.BLANCO,
    borderRadius: RelativeSize(12),
    padding: RelativeSize(10),
  },
  langTitle: {
    fontFamily: PersonFontSize.bold,    
    fontSize: PersonFontSize.normal,
    color: ColorShema.AZULOSCURO,
    marginBottom: RelativeSize(8),
  },
  langOption: {
    paddingVertical: RelativeSize(10),
    paddingHorizontal: RelativeSize(10),
    borderRadius: RelativeSize(10),
  },
  langOptionActive: {
    backgroundColor: "#F0F2F7",
  },
  langOptionText: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: ColorShema.AZULOSCURO,
  },

  title: {
    fontFamily: PersonFontSize.bold,    
    fontSize: PersonFontSize.titulo,
    marginTop: RelativeSize(3),
    textAlign: "center",
    color: ColorShema.AZULOSCURO,
  },
  label: {fontFamily: PersonFontSize.regular, fontSize: PersonFontSize.normal, textAlign: "left", width: "85%", color: ColorShema.AZULOSCURO },
  input: {
    width: "90%",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: RelativeSize(5),
    paddingHorizontal: RelativeSize(10),
    paddingVertical: RelativeSize(8),
    borderRadius: RelativeSize(5),
    minHeight: 44,
    backgroundColor: "#FFFFFF",
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "#0D1249",
  },
  inputSin: {
    flex: 1,
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "#0D1249",
    paddingVertical: RelativeSize(8),
    minHeight: 40,
  },
  cajasesion: { borderRadius: RelativeSize(20), width: Constantes.width85, justifyContent: "center", alignItems: "center", backgroundColor: ColorShema.BLANCO },
  link: {fontFamily: PersonFontSize.regular, fontSize: PersonFontSize.small, color: ColorShema.AZULOSCURO, marginBottom: Constantes.height02 },

  btn: {
    backgroundColor: ColorShema.MORADOCLARO,
    paddingVertical: RelativeSize(5),
    borderRadius: RelativeSize(10),
    alignItems: "center",
    width: "90%",
    marginBottom: Constantes.height01,
  },
  btnText: { color: "white", fontFamily: PersonFontSize.regular, fontSize: PersonFontSize.normal, fontWeight: "bold" },
});
