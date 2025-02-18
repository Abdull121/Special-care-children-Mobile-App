import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
import images from "../constants/images";

const CommunitySection = () => {
  return (
    <View className="mt-6 px-0">
      <View className="flex-row justify-between mb-3 ">
        <Text className="text-xl font-bold">Community</Text>
        <TouchableOpacity>
          <Text className="text-blue-600 font-bold">View all</Text>
        </TouchableOpacity>
      </View>

      <View className="border border-primary rounded-lg p-4 bg-gray-100 ">
        <Text className="text-lg font-bold">Tehreem</Text>
        <Text className="text-gray-500 text-sm mb-2">Date: Feb 10, 2025, 3 min read</Text>

        <Image
          source={images.childResources} // Replace with actual image
          className="w-full h-40 rounded-lg"
        />

        <TouchableOpacity>
          <Text className="text-blue-600 font-bold mt-2">Special children need special care</Text>
        </TouchableOpacity>

        <Text className="text-gray-500 text-sm mt-1">
          Several differently abled children walk every morning into specialized schools with a hope of
          getting basic education and skills...
        </Text>

        <TouchableOpacity>
          <Text className="text-blue-600 font-bold mt-2">read more</Text>
        </TouchableOpacity>

        <TouchableOpacity className="absolute bottom-2 right-2">
          {/* <FontAwesome name="bookmark-o" size={20} color="gray" /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommunitySection;
