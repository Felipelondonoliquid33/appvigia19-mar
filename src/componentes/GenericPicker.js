import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RelativeSize } from "./funciones";
import PersonFontSize from "../api/PersonFontSize";

export default function GenericPicker({
  visible,
  items = [],
  value,
  onSelect,
  onClose,
  placeholder = "Seleccione...",
  searchPlaceholder = "Buscar...",
  title = "Seleccione una opción",
  disabled = false,
}) {
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    if (visible) {
      setSearchText("");
      setFilteredItems(items);
    }
  }, [visible, items]);

  useEffect(() => {
    if (!searchText) {
      setFilteredItems(items);
    } else {
      const lower = searchText.toLowerCase();
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(lower)
      );
      setFilteredItems(filtered);
    }
  }, [searchText]);

  const handleSelect = (item) => {
    onSelect(item.value);
    onClose(false);
  };

  const selectedLabel = items.find((i) => i.value === value)?.label || placeholder;

  return (
    <>
      <TouchableOpacity
        style={[styles.pickerButton, disabled && styles.disabledButton]}
        onPress={disabled ? null : () => onClose(true)} // onClose(true) acts as open here if typical usage matches
      >
        <Text style={[styles.pickerText, !value && styles.placeholderText]}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={() => onClose(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchText}
              onChangeText={setSearchText}
            />

            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.value.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    item.value === value && styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      item.value === value && styles.selectedItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No se encontraron resultados</Text>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    backgroundColor: "#F2F2F2",
    borderRadius: RelativeSize(10),
    paddingHorizontal: RelativeSize(10),
    paddingVertical: RelativeSize(12),
    borderWidth: 1,
    borderColor: "#D0D0D0",
    minHeight: 44,
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  pickerText: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", // Bottom sheet effect
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: RelativeSize(20),
    borderTopRightRadius: RelativeSize(20),
    maxHeight: "80%",
    padding: RelativeSize(20),
    paddingBottom: RelativeSize(40),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: RelativeSize(15),
  },
  title: {
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    color: "#333",
  },
  closeButton: {
    padding: RelativeSize(5),
  },
  closeText: {
    fontSize: RelativeSize(24),
    color: "#666",
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: "#F9F9F9",
    borderRadius: RelativeSize(10),
    paddingHorizontal: RelativeSize(15),
    paddingVertical: RelativeSize(10),
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: RelativeSize(15),
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
  },
  item: {
    paddingVertical: RelativeSize(15),
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  selectedItem: {
    backgroundColor: "#FFF0F8",
    paddingHorizontal: RelativeSize(10),
    marginHorizontal: RelativeSize(-10),
    borderRadius: RelativeSize(8),
  },
  itemText: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "#333",
  },
  selectedItemText: {
    fontFamily: PersonFontSize.bold,
    color: "#E91E63", // Pink from the app
  },
  emptyText: {
    textAlign: "center",
    marginTop: RelativeSize(20),
    color: "#999",
    fontFamily: PersonFontSize.regular,
  },
});
