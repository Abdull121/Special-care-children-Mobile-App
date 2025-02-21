import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import images from "../constants/images";

const ResourcesSection = () => {
  return (
    <View className="mt-6 px-0 mb-8">
      <View className="flex-row justify-between mb-3">
        <Text className="text-xl font-bold">Resources</Text>
        <TouchableOpacity>
          <Text className="text-blue-600 font-bold">View all</Text>
        </TouchableOpacity>
      </View>

      <View className="border border-blue-400 rounded-lg p-4 bg-gray-100">
        <View className="flex-row items-center">
          <Image
            source={images.monkey} // Replace with actual icon
            className="w-10 h-10 rounded-full"
          />
          <Text className="text-lg font-bold ml-3">AutiSpark: Kids Autism Games</Text>
        </View>

        <Text className="text-gray-500 text-sm mt-2">3.9 star, 277k reviews</Text>
        <Text className="text-black font-bold mt-1">1M+ Downloads</Text>

        <Text className="text-gray-500 text-sm mt-2">
          AutiSpark is a one-of-a-kind educational app for children with Autism Spectrum Disorder (ASD)
          with specially designed learning games...
        </Text>

        <TouchableOpacity className="bg-blue-500 p-2 rounded-lg mt-3">
          <Text className="text-white font-bold text-center">Install</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResourcesSection;
