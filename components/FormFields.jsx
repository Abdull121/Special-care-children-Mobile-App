import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import icons from "../constants/icons"; // Ensure `icons` contains

const FormFields = ({
  title,
  value,
  handleChangeText,
  placeholder,
  otherStyle,
  secureTextEntry,
  textColor,
 
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focus, setFocus] = useState(false);
  // console.log(title);

  return (
    <View style={tw`mt-7 ${otherStyle}`}>
      <Text
      className="` font-psemibold text-[14px] line-hight-[24px] ${textColor}`"
      // style={tw`font-psemibold text-[14px] line-hight-[24px] ${textColor}`}
        
      // style={{
      //   fontFamily: "Poppins-SemiBold",
      //   fontSize: 14,
      //   lineHeight: 24,
      // }}
      >
        {title}
      </Text>
      <View
        style={tw`w-full h-12 px-2  border-2 border-[#A4A6A6] rounded-[4px] items-center flex-row
        ${focus ? "border-[#0166FC]" : "border-[#A4A6A6]"}
        
        `}
      >
        <TextInput
          style={{
            flex: 1,
            fontFamily: "Poppins-Regular",
            fontSize: 15,
            lineHeight: 24,

            textAlignVertical: "center",
          }}
          
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#A4A6A6"
          onChangeText={handleChangeText}
          secureTextEntry={
            (title === "Password" || title === "confirm password") && !showPassword
          } // Ensure `showPassword` is toggled correctly.
          {...props}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        {(title === "Password" || title === "confirm password") && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.6}
          >
            <Image
              source={showPassword ? icons.eye : icons.eyehide} // Use appropriate icons.
              style={{ width: 24, height: 20, marginRight: 10 }}
              resizeMethod="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormFields;
