import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import FormFields from "../../components/FormFields";
import { useState } from "react";
import { Link } from "expo-router";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = () => {};
  return (
    <SafeAreaView className="h-full px-4">
      <ScrollView>
        <View className="w-full justify-center mt-6 min-h-[85vh]">
          <Text className="font-heading text-primary text-[34px] mb-[35px] text-center">
            SPECIAL CARE
          </Text>
          <View>
            <Text className="font-psemibold text-[24px]">Create Account</Text>
            <Text className="font-pregular text-gary-Default">
              Welcome! select method to Sign Up
            </Text>
          </View>
          <FormFields
            title="Full Name"
            placeholder="Enter your name"
            keyboardType="default"
            secureTextEntry={false}
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyle="mt-7"
          />
          <FormFields
            title="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            secureTextEntry={false}
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyle="mt-7"
          />
          <FormFields
            title="Password"
            placeholder="Enter your password"
            secureTextEntry={true}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyle="mt-7"
          />

          <CustomButton
            handlePress={() => {
              onSubmit;
            }}
            title="Sign Up"
            textStyles="text-center text-white text-[14px] font-psemibold "
            container="mt-7 w-full h-12 rounded-[4px] bg-[#0166FC]"
          />

          <View className="flex-row items-center my-6">
            {/* Left line */}
            <View className="flex-1 h-[1px] bg-gray-300" />
            {/* Center text */}
            <Text className="mx-4 text-[#A4A6A6]">OR</Text>
            {/* Right line */}

            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>
          <CustomButton
            handlePress={() => {}}
            title={
              <View className="flex-row items-center justify-center">
                <Image
                  source={icons.google}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text className="text-center text-black-Default text-[14px] font-psemibold">
                  SignUp with Google
                </Text>
              </View>
            }
            textStyles=""
            container="mt-2 w-full h-12 rounded-[4px] bg-white border-2 border-black bg-transparent"
          />

          <View className="mt-6 flex-row justify-center">
            <Text className="text-black-Default text-[14px] font-pregular">
              Already Have an account? {""}
            </Text>
            <Link href="/login" className="text-blue-Default ">
              Login Now
            </Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="transparent" style="dark" />
    </SafeAreaView>
  );
};

export default SignUp;
