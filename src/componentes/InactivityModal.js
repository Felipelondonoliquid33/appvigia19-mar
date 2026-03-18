import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RelativeSize } from "./funciones";
import { useInactivity } from "../context/InactivityContext";
import { useLang } from "../i18n/LanguageProvider";

export default function InactivityModal() {
  const { t} = useLang();
  const ctx = useInactivity();
  if (!ctx) return null;

  const { showModalLogout, resetTimer } = ctx;

  return (
    <Modal visible={showModalLogout} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{t("inactivity.title")}</Text>
          <Text style={styles.text}>{t("inactivity.info")}</Text>

          <TouchableOpacity style={styles.btn} onPress={resetTimer}>
            <Text style={styles.btnText}>{t("inactivity.yes")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: RelativeSize(20),
    alignItems: "center",
  },
  title: {
    fontSize: RelativeSize(18),
    fontWeight: "bold",
    color: "#ff008c",
    marginBottom: RelativeSize(10),
  },
  text: {
    textAlign: "center",
    marginBottom: RelativeSize(20),
  },
  btn: {
    backgroundColor: "#ff008c",
    paddingVertical: RelativeSize(10),
    paddingHorizontal: RelativeSize(40),
    borderRadius: 8,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});
