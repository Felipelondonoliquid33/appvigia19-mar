import { View } from "react-native";
import { useInactivity } from "../context/InactivityContext";

export default function InactivityWrapper({ children }) {
  const { resetTimer } = useInactivity();

  return (
    <View
      style={{ flex: 1 }}
      onStartShouldSetResponder={() => {
        resetTimer();
        return false; // ⬅️ CLAVE
      }}
    >
      {children}
    </View>
  );
}
