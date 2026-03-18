import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Platform,
  SafeAreaView
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

  // Reset search when modal opens
  useEffect(() => {
    if (visible) {
      setSearchText("");
    }
  }, [visible]);

  // Derived state to avoid sync issues
  const filteredItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    if (!searchText) return items;
    const lower = searchText.toLowerCase();
    return items.filter((item) =>
      item && item.label && item.label.toLowerCase().includes(lower)
    );
  }, [items, searchText]);

  const handleSelect = (item) => {
    if (onSelect) {
      onSelect(item.value);
    }
    if (onClose) {
      onClose(false);
    }
  };

  const selectedLabel = useMemo(() => {
    if (!items || !Array.isArray(items)) return placeholder;
    const found = items.find((i) => i && i.value === value);
    return found ? found.label : placeholder;
  }, [items, value, placeholder]);

  return (
    <>
      <TouchableOpacity
        style={[styles.pickerButton, disabled && styles.disabledButton]}
        onPress={disabled ? null : () => onClose(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.pickerText, !value && styles.placeholderText]}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => onClose(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
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
              placeholderTextColor="#999"
              autoCorrect={false}
            />

            <FlatList
              data={filteredItems}
              keyExtractor={(item, index) => (item && item.value != null) ? String(item.value) : `item_${index}`}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={15}
              maxToRenderPerBatch={15}
              windowSize={10}
              removeClippedSubviews={false} // Crucial optimization for Android Modals
              renderItem={({ item }) => {
                if (!item) return null;
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      isSelected && styles.selectedItem,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        isSelected && styles.selectedItemText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No se encontraron resultados</Text>
                </View>
              }
            />
          </View>
        </View>
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
    backgroundColor: "#E0E0E0",
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
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: RelativeSize(20),
    borderTopRightRadius: RelativeSize(20),
    maxHeight: "80%",
    padding: RelativeSize(20),
    paddingBottom: RelativeSize(40),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: RelativeSize(15),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: RelativeSize(10),
  },
  title: {
    fontFamily: PersonFontSize.bold,
    fontSize: PersonFontSize.titulo,
    color: "#333",
    flex: 1,
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
    color: "#333",
  },
  item: {
    paddingVertical: RelativeSize(15),
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingHorizontal: RelativeSize(5),
  },
  selectedItem: {
    backgroundColor: "#FFF0F8",
    borderRadius: RelativeSize(8),
  },
  itemText: {
    fontFamily: PersonFontSize.regular,
    fontSize: PersonFontSize.normal,
    color: "#333",
  },
  selectedItemText: {
    fontFamily: PersonFontSize.bold,
    color: "#E91E63",
  },
  emptyContainer: {
    padding: RelativeSize(20),
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontFamily: PersonFontSize.regular,
  },
});
