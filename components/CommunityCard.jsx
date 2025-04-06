import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import * as Linking from 'expo-linking';

const CommunitySection = ({CommunitySection, data}) => {
  // console.log(data, "data in community card")
   const { title, description, author, date, featuredImage, postLink} = data;
  return (
    <View >
      {CommunitySection && (
        <View className="flex-row justify-between mb-3 ">
        <Text className="text-xl font-bold">Community</Text>
        <TouchableOpacity>
          <Text className="text-blue-600 font-bold">View all</Text>
        </TouchableOpacity>
      </View>
      )}


      {data && (
        <TouchableOpacity
        activeOpacity={0.9}
          onPress={() => {
            // Open the link in the default browser
            Linking.openURL(postLink)
              .catch((err) => console.error("Failed to open URL:", err));
          }}
        >
        <View className="border border-primary rounded-lg p-4 bg-gray-100 ">
        <Text className="text-lg font-bold" numberOfLines={1}>{author}</Text>
        <Text className="text-gray-500 text-sm mb-2">{date}</Text>

        <Image
          source={{uri:featuredImage}} // Replace with actual image
          className="w-full h-40 rounded-lg"
        />

        
          <Text className="text-blue-600 font-bold mt-2" numberOfLines={1}>{title}</Text>
       

        <Text className="text-gray-500 text-sm mt-1 " numberOfLines={3}>
          {description}
        </Text>

        
          <Text className="text-blue-600 font-bold mt-2">read more</Text>
       
      </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommunitySection;
