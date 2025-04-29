// components/DoctorCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Linking , Dimensions, Image} from "react-native";
import icons from "../constants/icons";
const { width } = Dimensions.get('window');
const cardWidth = width * 0.8;

const DoctorCard = ({ clinic }) => {
  // console.log(clinic);
   
  const openDirections = () => {
    const url = `geo:0,0?q=${clinic.lat},${clinic.lon}(${clinic.address})`;
    Linking.openURL(url);
  };

  return (
      <View
        className="border border-blue-500 rounded-xl px-4 pt-2 bg-white shadow-lg"
        style={{ width: cardWidth, height: cardWidth * 0.5 }}
      >
        <View className="mt-2">
          <Text className="text-2xl font-semibold text-black" numberOfLines={2} ellipsizeMode="tail">
            {clinic.name}
          </Text>
          
          <Text className="text-gray-500 text-md my-2 w-94"  numberOfLines={2}>Address: {''} {clinic.address}
          </Text>
          <View className="flex-row items-center  gap-3">
          <Text className="text-gray-500 text-md my-2" >Clinic: {' '}{clinic.openHours?"Open":"Close"}</Text>
          <Text className="text-primary text-md">
            {clinic.rating}{' '}
            {Array.from({ length: 5 }, (_, index) => (
                index < Math.floor(clinic.rating) ? '★' : '☆'
            )).join('')}
            </Text>
           </View>
           {/* direction */}
           
           
        </View>

        <TouchableOpacity className="absolute bottom-1 right-6"
         onPress={openDirections}>
        <Image
              source={icons.direction}
              resizeMode="contain"
              className="w-16 h-16"/>
        </TouchableOpacity>
      </View>
    );
};

export default DoctorCard;