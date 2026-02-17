import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";
import GlobalAlert from "@/components/GlobalAlert";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="(main)/newConversationModal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="(main)/profileModal"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StackLayout />
        <GlobalAlert />
      </GestureHandlerRootView>
    </AuthProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
