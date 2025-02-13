import { View, Text, SafeAreaView, ScrollView, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import FormFields from "../../components/FormFields";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { sendOTP, checkEmail } from "../../Appwrite/forgetPassword";
import { useEmail } from "../../context/EmailContext";


const ResetPassword = () => {
  const { setEmail } = useEmail();
  const [form, setForm] = useState({
    email: "",
    loading: false // Added loading state
  });

  const handleResetPassword = async () => {
    if (!form.email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      setForm(prev => ({ ...prev, loading: true }));
      console.log(form.email)
      
      // 1. Check if email exists
    const validEmail=  await checkEmail(form.email);
    if(validEmail.success){
      // 2. Store email in context
      setEmail(form.email);
      

      // 3. Send OTP
      const response = await sendOTP(form.email);
      console.log("OTP Response:", response);

      if (response.success) {
        
        router.push("/verifyCode");
      } else {
        
        Alert.alert("Error", response.message || "Failed to send OTP");
      }
     

    }
    else{
      console.log("email is not valid!")
      Alert.alert("Error", "Email is not found");
      
    }
     
      

      
    } catch (error) { // Fixed error parameter
      console.log("Error:", error);
      Alert.alert("Error", error.message || "An error occurred");
    } finally {
      setForm(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <SafeAreaView className="bg-white">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full px-6 min-h-[75vh] items-start justify-center">
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
            value={form.email}
            handleChangeText={(e) => setForm(prev => ({ ...prev, email: e }))}
            otherStyle="mt-7"
          />

          <CustomButton
            handlePress={handleResetPassword}
            title={form.loading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          "Reset Password"
                        )}
            textStyles="text-center text-white text-[14px] font-psemibold"
            container="mt-7 w-full h-12 rounded-[4px] bg-[#0166FC]"
            isLoading={form.loading} // Use proper loading state
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;
