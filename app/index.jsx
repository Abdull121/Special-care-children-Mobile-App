import { Image, ScrollView, Text, View } from "react-native";
import images from "../constants/images";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  return (
    <>
      <View className="bg-primary h-full">
        <Image source={images.topVector} resizeMode="contain" />
        <SafeAreaView>
          <ScrollView contentContainerStyle={{ height: "100%" }}>
            <View className="w-full justify-center items-center  px-6">
              <Text className="font-heading text-secondary-Default text-[34px] mb-[35px]">
                Special Care
              </Text>
              <Image
                source={images.children}
                className="w-[231px] h-[214px]"
                resizeMode="contain"
              />
              <Text className="text-center text-secondary-Default text-[15px] font-pregular leading-6 ">
                Supporting children with special needs and their caregivers
                Comprehensive care management for physical, educational, and
                emotional needs.
              </Text>
            </View>
          </ScrollView>
          {/* <View className="relative bottom-safe-or-64">
            <Image source={images.bottomVector} resizeMode="contain" />
          </View> */}
        </SafeAreaView>

        <StatusBar backgroundColor="transparent" style="light" />
      </View>
      <Image
        className="absolute -bottom-safe-offset-14 right-0 w-[412px] h-[212px]   "
        source={images.bottomVector}
        resizeMode="contain"
      />
    </>
  );
}
