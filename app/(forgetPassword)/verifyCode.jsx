import React, { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

const VerificationScreen = () => {
  const [code, setCode] = useState(["", "", "", "", ""]); // State for 5 digits
  const [focus, setFocus] = useState([false, false, false, false, false]); // Focus state for each input
  const inputs = useRef([]); // Refs for each input box

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

  const handleBlur = (index) => {
    const newFocus = [...focus];
    newFocus[index] = false;
    setFocus(newFocus);
  };

  const handleSubmit = () => {
    alert(`Verification Code: ${code.join("")}`);
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
              // onBlur={() => handleBlur(index)}
              />
            ))}
          </View>

          <CustomButton
            handlePress={() => { router.push("/setNewPass") }}
            title="Verify Code"
            textStyles="text-center text-white text-[14px] font-psemibold"
            container="w-full h-12 rounded-[4px] bg-[#0166FC]"
            isLoading={code.includes("")}
          />

          <Text className="text-sm text-gray-500 mt-4">
            Haven't got the email yet?{" "}
            <Text className="text-blue-600 font-bold">Resend email</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerificationScreen;
