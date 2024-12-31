import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const login = () => {
  return (
    <SafeAreaView className="h-full px-4">
      <ScrollView>
        <View className="w-full justify-center mt-6 h-full">
          <Text className="font-heading text-primary text-[34px] mb-[35px] text-center">
            SPECIAL CARE
          </Text>
          <View>
            <Text className="font-psemibold text-[24px]">Started Now</Text>
            <Text className="font-pregular text-gary-Default">
              Welcome! select method to login
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
