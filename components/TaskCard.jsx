import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import icons from "../constants/icons";

const TaskCard = ({ 
  taskId,
  checked,  // Receive checked status from parent
  title, 
  description, 
  date, 
  time, 
  available, 
  category,
  onToggle,
  status,
  notificationId,
}) => {
  const handlePress = () => {
    if (onToggle) {
      onToggle(taskId, notificationId);
    }
  };
  
  const StatusIndicator = ({ checked }) => (
    <View className="absolute right-4 top-10 items-center justify-center w-16 h-16">
      {status ? (
        // Completed text for completed tasks
        <View className="w-full h-full justify-center items-center">
          <View className="px-3 py-1 rounded-full max-w-[120px]">
            <Text className="text-primary text-sm font-semibold w-20">
              Completed
            </Text>
          </View>
        </View>
      ) : (
        // Checkbox for pending tasks
        <Pressable
          onPress={handlePress}
          className="w-full h-full rounded-full border-4 justify-center items-center border-primary"
        >
          {checked && (
            <View className="w-12 h-12 rounded-full justify-center items-center bg-[#0166FC]">
              <Text className="text-white text-3xl">✓</Text>
            </View>
          )}
        </Pressable>
      )}
    </View>
  );

  return (
    <View className="bg-gray-100 p-4 rounded-lg mb-3 border border-primary">
      {/* Status indicator (checkbox or completed text) */}
      {available && <StatusIndicator checked={checked} />}

      {/* Rest of your card content remains the same */}
      <View className="mr-6">
        <Text className="text-lg font-bold mb-1" numberOfLines={1}>
          {title}
        </Text>
        
        {description && (
          <Text 
            className="text-gray-600 text-sm mb-2 w-64" 
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        )}

        <View className="flex-row items-center flex-wrap">
          <Image
            source={icons.flag}
            resizeMode="contain"
            className="w-5 h-5"
          />
          
          {(date || time) && (
            <Text 
              className="ml-2 text-sm text-[#484848] font-semibold"
              numberOfLines={1}
            >
              {date} {time}
            </Text>
          )}

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