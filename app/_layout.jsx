// Import your global CSS file
import "../global.css";

import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";

import { EmailProvider } from "../context/EmailContext";
import GlobalProvider from "../context/GlobalProvider"

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Anton-Regular": require("../assets/fonts/Anton-Regular.ttf"),
  });
  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <GlobalProvider>
    
    <EmailProvider>   
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(forgetPassword)" options={{ headerShown: false }} />
      <Stack.Screen name="(userProfile)" options={{ headerShown: false }} />
    </Stack>
    </EmailProvider>
    </GlobalProvider>
  );
  // <StatusBar backgroundColor= "#000000" style="light" />
};

export default RootLayout;
