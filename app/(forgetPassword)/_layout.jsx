import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ForgetPassLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="resetPassword" options={{ headerShown: false }} />
      <Stack.Screen name="setNewPass" options={{ headerShown: false }} />
      <Stack.Screen name="verifyCode" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ForgetPassLayout;
