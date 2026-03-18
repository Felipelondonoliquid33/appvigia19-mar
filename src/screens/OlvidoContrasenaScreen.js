import React, { useState } from "react";
import {
  ScrollView,
  Text,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

import { SafeAreaView } from "react-native-safe-area-context";

import ApiBase from "../api/apiBase";
import apiPost from "../api/apiPost";
import Constantes from "../api/Constantes";

import PersonFontSize from "../api/PersonFontSize";

import LoadingOverlay from "../componentes/LoadingOverlay";
import { RelativeSize } from "../componentes/funciones";

import { useLang } from "../i18n/LanguageProvider";

const fwidth = Constantes.width90;
const fheight = (fwidth * 49) / 100;

export default function OlvidoContrasenaScreen({ navigation }) {
  const { t } = useLang();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const netInfo = useNetInfo();

  const enviarEnlace = async () => {
    if (netInfo.isConnected) {
      if (email) {
        setLoading(true);
        const body = [];
        const url = ApiBase.apiOlvido + "?registro=" + email;

        const result = await apiPost(url, body);
        setLoading(false);

        if (result.success) {
          Alert.alert(t("forgot.title"), t("forgot.infoOK"), [
            {
              text: "OK",
              onPress: () => navigation.replace("Login"),
            },
          ]);
        } else {
          Alert.alert(t("forgot.warn"), t("forgot.serverError"));
        }
      } else {
        Alert.alert(t("forgot.warn"), t("forgot.mustEmail"));
      }
    } else {
      Alert.alert(t("forgot.warn"), t("forgot.noInternet"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t("forgot.title")}</Text>

        <Text style={styles.description}>{t("forgot.description")}</Text>

        <Image
          source={require("../../assets/splash.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TextInput
          style={styles.input}
          placeholder={t("forgot.emailPlaceholder")}
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.description2}>{t("forgot.icbfNote")}</Text>

        <TouchableOpacity style={styles.btn} onPress={enviarEnlace}>
          <Text style={styles.btnText}>{t("forgot.sendLink")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.backText}>{t("forgot.backToLogin")}</Text>
        </TouchableOpacity>

        <LoadingOverlay visible={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f3b",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: RelativeSize(30),
    paddingVertical: RelativeSize(40),
    justifyContent: "center",
  },
  title: {
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    color: "white",
    textAlign: "center",
  },
  description: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "white",
    textAlign: "center",
    marginTop: RelativeSize(15),
    lineHeight: RelativeSize(22),
  },
  description2: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "white",
    textAlign: "center",
    marginTop: RelativeSize(15),
    lineHeight: RelativeSize(22),
  },
  logo: {
    width: fwidth,
    height: fheight,
    alignSelf: "center",
    marginTop: RelativeSize(20),
  },
  input: {
    backgroundColor: "white",
    borderRadius: RelativeSize(12),
    height: RelativeSize(50),
    paddingHorizontal: RelativeSize(15),
    marginTop: RelativeSize(20),
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
  },
  btn: {
    backgroundColor: "#ff008c",
    paddingVertical: RelativeSize(15),
    borderRadius: RelativeSize(12),
    marginTop: RelativeSize(20),
  },
  btnText: {
    color: "white",
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.normal,
    textAlign: "center",
  },
  backText: {
    color: "white",
    textAlign: "center",
    marginTop: RelativeSize(20),
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    textDecorationLine: "underline",
  },
});
