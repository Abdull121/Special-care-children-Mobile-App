import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useState } from "react";
import FormFields from "../../components/FormFields";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

const ResetPassword = () => {
  const [form, setForm] = useState({
    email: "",
  });
  // console.log(form.email);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full px-6 min-h-[75vh] items-start justify-center ">
          <Text className="font-psemibold text-blue-Default text-[20px]">
            Forget Password
          </Text>
          <Text className="font-pregular text-gary-Default">
            Please enter your email to reset the password
          </Text>
          <FormFields
            title="Email"
            placeholder="Enter your email address"
            keyboardType="email-address"
            secureTextEntry={false}
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyle="mt-7"
          />
          <CustomButton
            handlePress={() => {
              router.push("/verifyCode");
            }}
            title="Reset Password"
            textStyles="text-center text-white text-[14px] font-psemibold "
            container="mt-7 w-full h-12 rounded-[4px] bg-[#0166FC]"
            isLoading={form.email === "" ? true : false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;
