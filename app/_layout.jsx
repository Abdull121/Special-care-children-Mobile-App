// Import your global CSS file
import "../global.css";
import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";

import { EmailProvider } from "../context/EmailContext";
import GlobalProvider from "../context/GlobalProvider";
import { LoadingProvider } from './../context/Loader'

import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';


SplashScreen.preventAutoHideAsync();


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env file");
}

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
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
    <GlobalProvider>
    
    <EmailProvider>  
      <LoadingProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false}} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(forgetPassword)" options={{ headerShown: false }} />
      <Stack.Screen name="(userProfile)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ChatScreen" options={{ headerShown: false }} />
      
  
     
      
      
    </Stack>
    </LoadingProvider> 
    </EmailProvider>
    </GlobalProvider>
    </ClerkLoaded>
    </ClerkProvider>
  );
  // <StatusBar backgroundColor= "#000000" style="light" />
};

export default RootLayout;
