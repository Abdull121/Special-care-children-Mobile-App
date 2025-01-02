import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useState } from "react";
import FormFields from "../../components/FormFields";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

const SetNewPassword = () => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  // console.log(form.email);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full px-6 min-h-[75vh] items-start justify-center ">
          <Text className="font-psemibold text-blue-Default text-[20px]">
            Set a new password
          </Text>
          <Text className="font-pregular text-gary-Default">
            Create a new password. Ensure it differs from previous ones for
            security
          </Text>
          <FormFields
            title="Password"
            placeholder="Enter your new password"
            secureTextEntry={true}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyle="mt-7"
          />
          {/* confirm password field */}
          <FormFields
            title="confirm password"
            placeholder="Re-enter password"
            secureTextEntry={true}
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            otherStyle="mt-7"
          />

          <CustomButton
            handlePress={() => {
              router.push("/setNewPass");
            }}
            title="update password"
            textStyles="text-center text-white text-[14px] font-psemibold "
            container="mt-7 w-full h-12 rounded-[4px] bg-[#0166FC]"
            isLoading={
              (!form.password || !form.confirmPassword || form.password !== form.confirmPassword)
                ? true
                : false
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SetNewPassword;
