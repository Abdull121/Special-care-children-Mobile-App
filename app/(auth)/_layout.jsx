import { StatusBar } from "expo-status-bar";
import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        {/* <Stack.Screen name="singUp" options={{ headerShown: false }} /> */}
      </Stack>
      {/* <StatusBar backgroundColor="#fffff" style="light" /> */}
    </>
  );
};

export default AuthLayout;
