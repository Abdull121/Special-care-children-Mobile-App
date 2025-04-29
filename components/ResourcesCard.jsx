import React from "react";
import { View, Text, Image, TouchableOpacity,} from "react-native";
// import images from "../constants/images";
import * as Linking from 'expo-linking';
import{router} from "expo-router";

const ResourcesSection = ({resourcesSection, data}) => {
  //sconsole.log(resourcesSection, "resourcesSection")
  return (
    <View className=" mb-8">
    {resourcesSection && (<View className="flex-row justify-between mt-5 mb-3 pr-3">
        <Text className="text-xl font-bold">Resources</Text>
        <TouchableOpacity
          onPress={() => router.push("/resources")}
        >
          <Text className="text-blue-600 font-bold">View all</Text>
          
        </TouchableOpacity>
      </View>)}
      
      {data? (
        <View
        style={{
          borderWidth: 1,
          borderColor: '#60A5FA', 
          borderRadius: 8,         
          padding: 16,             
          backgroundColor: '#F3F4F6', 
          width: resourcesSection ? '100%' :314,
        }}
      >

     
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
