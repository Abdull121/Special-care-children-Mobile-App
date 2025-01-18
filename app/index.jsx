import { Image, ScrollView, Text, View, ImageBackground } from "react-native";
import images from "../constants/images";
import background from "../assets/images/background.png";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";

export default function Index() {


  return (
    <>
      <ImageBackground
        source={background}
        resizeMode="cover"
        className="flex-1 justify-center items-center"
      >
        <SafeAreaView>
          <ScrollView contentContainerStyle={{ height: "100%" }}>
            <View className="w-full justify-center items-center  px-6 h-[85vh]">
              <Text className="font-heading text-secondary-Default text-[34px] mb-[35px]">
                SPECIAL CARE
              </Text>
              <Image
                source={images.children}
                className="w-[231px] h-[214px] "
                resizeMode="contain"
              />
              <Text className="text-center t text-secondary-Default text-[15px] font-pregular leading-6 mt-[20px0]  ">
                Supporting children with special needs and their caregivers
                Comprehensive care management for physical, educational, and
                emotional needs.
              </Text>
              <CustomButton
                handlePress={() => router.push("/login")}
                title="Get Started"
                textStyles="text-center text-black-Default text-[14px] font-psemibold "
                container="mt-[41px] w-[231px] h-[42px] rounded-[4px] bg-white"
              //use twrn in container
              />
            </View>
          </ScrollView>
        </SafeAreaView>

        <StatusBar backgroundColor="transparent" style="light" />

      </ImageBackground>

    </>
  );
}
