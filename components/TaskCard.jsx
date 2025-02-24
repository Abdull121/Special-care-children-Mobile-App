import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import icons from "../constants/icons";
import { style } from "twrnc";

const TaskCard = ({ title, description, date, time, available, category }) => {
  const [checked, setChecked] = useState(false);

  const CustomCheckbox = ({ checked, onPress }) => (
    <Pressable
      onPress={onPress}
      className="absolute right-4 top-10 w-16 h-16 rounded-full border-4 justify-center items-center border-primary b"
    >
      {checked && (
        <View className="w-12 h-12 rounded-full justify-center items-center bg-[#0166FC]">
          {/* Proper text component for checkmark */}
          <Text className="text-white text-3xl">✓</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <View className="bg-gray-100 p-4 rounded-lg mb-3 border border-primary">
      {/* Checkbox positioned absolutely */}
      {available && (
        <CustomCheckbox
          checked={checked}
          onPress={() => setChecked(!checked)}
        />
      )}

      {/* Main Content */}
      <View className="mr-6">
        <Text className="text-lg font-bold mb-1" numberOfLines={1}>
          {title}
        </Text>
        
        {/* Description with proper text containment */}
        {description && (
          
          <Text 
          //style={{borderColor:"red", borderWidth:1}}
            className="text-gray-600 text-sm mb-2 w-64" 
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        )}

        {/* Bottom row with proper text wrapping */}
        <View className="flex-row items-center flex-wrap">
          <Image
            source={icons.flag}
            resizeMode="contain"
            className="w-5 h-5"
          />
          
          {/* Combined date/time text */}
          {(date || time) && (
            <Text 
              className="ml-2 text-sm text-[#484848] font-semibold"
              numberOfLines={1}
            >
              {date} {time}
            </Text>
          )}

          {/* Category badge with proper text containment */}
          {available && category && (
            <View className="bg-primary px-2 py-1 rounded-lg ml-2 max-w-[120px]">
              <Text 
                className="text-white text-xs" 
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {category}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default TaskCard;