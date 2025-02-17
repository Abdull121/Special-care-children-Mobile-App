import React from "react";
import { View, Text, Image } from "react-native";   
import  icons  from "../constants/icons";
const TaskCard = ({ title, description, time }) => {
  return (
    <View className="bg-gray-100 p-4 rounded-lg mb-3 border border-primary">
      <Text className="text-lg font-bold">{title}</Text>
      <Text className="text-gray-600 text-sm">{description}</Text>
      <View className="flex-row items-center mt-3">
      <Image
              source={icons.flag}
              resizeMode="contain"
              
              className="w-5 h-5"
            />
      
        <Text className="ml-2 text-sm text-[#484848] font-[600px]">{time}</Text>
      </View>
    </View>
  );
};

export default TaskCard;
