import React from "react";
import { View, Text, Image, TouchableOpacity,} from "react-native";
// import images from "../constants/images";
import * as Linking from 'expo-linking';

const ResourcesSection = ({resourcesSection, data}) => {
  // console.log(data, "data in resources card")
  return (
    <View className=" mb-8">
    {resourcesSection && (<View className="flex-row justify-between mb-3">
        <Text className="text-xl font-bold">Resources</Text>
        <TouchableOpacity>
          <Text className="text-blue-600 font-bold">View all</Text>
        </TouchableOpacity>
      </View>)}
      
      {data? (
        <View className="border border-blue-400 rounded-lg p-4 bg-gray-100 w-[360px] ">
     
    <View className="flex-row items-center">
      <Image
        source={{ uri: data.avatar }}
        className="w-10 h-10 rounded-full"
        onError={(error) => console.error("Image load error:", error)}
      />
      <Text className="text-lg font-bold ml-3">{data.title}</Text>
    </View>
  

        <Text className="text-gray-500 text-sm mt-2">{data?.rating} </Text>
        <Text className="text-black font-bold mt-1">{data?.downloads}</Text>

        <Text ellipsizeMode="tail"
              numberOfLines={3} 
            className="text-gray-500 text-sm mt-2 "  >
         {data?.description} 
        </Text>

        <TouchableOpacity className="bg-blue-500 p-2 rounded-lg mt-3"
        onPress={() => {
          // Open the link in the default browser
        
          Linking.openURL(data?.downloadLink )
            .catch((err) => console.error("Failed to open URL:", err));
        }
        
        }>
          <Text className="text-white font-bold text-center">Install</Text>
        </TouchableOpacity>
      </View>
      ):(<Text>Loading...</Text>)}
      
    </View>
  );
};

export default ResourcesSection;
