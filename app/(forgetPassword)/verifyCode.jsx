import React, { useRef, useState } from "react";
import { View, Text, TextInput, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { verifyOTP, sendOTP } from "../../Appwrite/forgetPassword"; // Import sendOTP function

import { useEmail } from "../../context/EmailContext";

const VerificationScreen = () => {
  const { getEmail } = useEmail(); // Get email from context  

  const [code, setCode] = useState(["", "", "", "", ""]); // State for 5 digits
  const [focus, setFocus] = useState([false, false, false, false, false]); // Focus state for each input
  const inputs = useRef([]); // Refs for each input box
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false); // State for resending OTP

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;

    if (text && index < 4) {
      inputs.current[index + 1].focus(); // Move to the next input
    }

    setCode(newCode);
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && code[index] === "") {
      inputs.current[index - 1].focus(); // Move to the previous input
    }
  };

  const handleFocus = (index) => {
    const newFocus = [...focus];
    newFocus[index] = true;
    setFocus(newFocus);
  };

  const handleVerifyCode = async () => {
    console.log(code.join(""));

    try {
      setLoading(true);
      const response = await verifyOTP(code.join(""));
      // console.log(response.message)
      if (response.success) {
        router.push("/setNewPass");
      } else {
        Alert.alert("Error", response.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResending(true);
      // Call the sendOTP function with the email
      const response = await sendOTP(getEmail); // Replace with the actual email
      if (response.success) {
        Alert.alert("Success", "OTP has been resent to your email");
      } else {
        Alert.alert("Error", response.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert(error.message || "An error occurred");
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="h-[80vh] justify-center items-center p-5">
          {/* Left-aligned text */}
          <View className="w-full mb-8">
            <Text className="text-xl font-psemibold text-blue-600 mb-2 text-left">
              Check your email
            </Text>
            <Text className="text-sm text-gray-500 font-pregular text-left">
              We sent a reset link to nou...20@your-email.com. Enter the 5-digit code.
            </Text>
          </View>

          {/* Centered inputs */}
          <View className="flex-row justify-center items-center gap-4 mb-8">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)} // Assign ref
                className={`w-16 h-16 border-2 rounded-xl text-center text-xl text-blue-Default font-psemibold ${focus[index] ? "border-[#0166FC]" : "border-gray-300"
                  }`}
                keyboardType="number-pad"
                maxLength={1} // Only allow one digit
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleFocus(index)}
              />
            ))}
          </View>

          <CustomButton
            handlePress={handleVerifyCode}
            title={loading ? (
              <ActivityIndicator size="small" color="#fff" />)
              : ("Reset Password")}
            textStyles="text-center text-white text-[14px] font-psemibold"
            container="w-full h-12 rounded-[4px] bg-[#0166FC]"
            isLoading={code.includes("")}
          />

              <View className="flex-row items-center mt-4">
              <Text className="text-sm text-gray-500">Haven't got the email yet? </Text>
              <TouchableOpacity onPress={handleResendOTP} disabled={resending}>
                <Text className="text-sm text-blue-600 font-bold">
                  {resending ? "Resending..." : "Resend email"}
                </Text>
              </TouchableOpacity>
            </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerificationScreen;