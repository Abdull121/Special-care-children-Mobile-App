import {
  Image,
  ScrollView,
  Text,
  View,
  ImageBackground,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import images from "../constants/images";
import background from "../assets/images/background.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";
import React from "react";


export default function Index() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  

  return (
    <>
      {loading ? (
        <View style={styles.fullScreenContainer}>
                  {/* Your app logo */}
                  <Image 
                    source={require('../assets/images/children.png')}  // Update path to your logo
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  
                  <Text style={styles.appTitle}>SPECIAL CARE</Text>
                  
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0166FC" />
                  </View>
                </View>
      ) : (
        <ImageBackground
          source={background}
          resizeMode="cover"
          className="flex-1 justify-center items-center"
        >
          <SafeAreaView>
            <ScrollView contentContainerStyle={{ height: "100%" }}>
              <View className="w-full justify-center items-center px-6 h-[85vh]">
                <Text className="font-heading text-secondary-Default text-[34px] mb-[35px]">
                  SPECIAL CARE
                </Text>
                <Image
                  source={images.children}
                  className="w-[231px] h-[214px]"
                  resizeMode="contain"
                />
                <Text className="text-center text-secondary-Default text-[15px] font-pregular leading-6 mt-[20px]">
                  Supporting children with special needs and their caregivers
                  Comprehensive care management for physical, educational, and
                  emotional needs.
                </Text>
                <CustomButton
                  testID="get-started-button"
                  // handlePress={() => router.push("/login")}
                  handlePress={() => router.push("/(auth)/login")}
                  title="Get Started"
                  textStyles="text-center text-black-Default text-[14px] font-psemibold"
                  container="mt-[41px] w-[231px] h-[42px] rounded-[4px] bg-white"
                />
              </View>
            </ScrollView>
          </SafeAreaView>
          <StatusBar backgroundColor="transparent" style="light" />
        </ImageBackground>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Use your app's background color
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0166FC', // Use your primary color
    marginBottom: 40,
    fontFamily: 'Poppins-Bold',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  
});
