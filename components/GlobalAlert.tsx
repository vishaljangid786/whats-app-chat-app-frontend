import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { registerAlert } from "@/utils/globalAlert";
import { colors } from "@/constants/theme";

type AlertOptions = {
  title: string;
  message: string;
  onConfirm?: () => void;
};

const GlobalAlert = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<AlertOptions | null>(null);

  useEffect(() => {
    registerAlert((options) => {
      setData(options);
      setVisible(true);
    });
  }, []);

  const handleClose = () => {
    setVisible(false);
    data?.onConfirm?.();
  };

  if (!data) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.message}>{data.message}</Text>

          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={{ color: "white" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default GlobalAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    marginBottom: 20,
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
});
