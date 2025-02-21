import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from "react-native";
import React, { useRef, useState, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";

const categories = ["Appointment", "Activity", "Therapy", "Education"];

const Schedule = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);

  // Consolidated state
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    date: "",
    time: "",
    category: null,
  });

  // Function to update state
  const handleInputChange = (field, value) => {
    console.log(`Field: ${field}, Value: ${value}`);
    console.log(taskDetails.field)
    
    
    setTaskDetails((prev) => ({ ...prev, [field]: value }));
   
  };

  // Open Bottom Sheet
  const handleOpenModal = () => {
    navigation.setOptions({
      tabBarStyle: {
        display: "none",
        height: 0,
        borderTopWidth: 0,
        elevation: 0, // For Android
        zIndex: 0,    // For iOS
      }
    });
    setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(0);
      console.log("opening")
    }, 460);
  };

  // Close Bottom Sheet
  const handleCloseModal = () => {
    bottomSheetRef.current?.close();
    // Reset task details 
  setTaskDetails({ title: "", date: "", time: "", category: null });
    setTimeout(() => {
      navigation.setOptions({
        tabBarStyle: {
          display: "flex",
          height: 74,
          borderTopWidth: 1,
          borderTopColor: "#232533",
          elevation: 1,
          zIndex: 1,
        }
      });
    },350);
  };

  // Control tab bar visibility
  useFocusEffect(
    useCallback(() => {
      return () => {
        navigation.setOptions({
          tabBarStyle: {
            display: "flex",
            height: 74,
            borderTopWidth: 1,
            borderTopColor: "#232533",
            elevation: 1,
            zIndex: 1,
          }
        });
      };
    }, [navigation])
  );

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1 py-16">
          <View className="flex-1 justify-center items-center px-6 w-full">
            {["Completed Task", "Pending Task"].map((title, index) => (
              <View key={index} className="w-full mb-4">
                <Text className="text-black font-semibold text-lg mb-2 text-left">{title}</Text>
                <View className="border border-blue-400 rounded-lg p-6 h-[250px] flex justify-center items-center w-full">
                  <Text className="text-gray-500">No {title} Available</Text>
                </View>
              </View>
            ))}

            {/* Create New Button */}
            <TouchableOpacity
              className="bg-blue-600 rounded-lg py-3 items-center w-full"
              onPress={handleOpenModal}
            >
              <Text className="text-white font-semibold text-lg">Create New</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
            
          snapPoints={["66%"]}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={false}
          index={-1}
          backgroundComponent={null}
          handleIndicatorStyle={{ backgroundColor: "transparent" }}
          // animationConfigs={{
          //   duration: 400,
          //   easing: Easing.out(Easing.ease),
          // }}
        >
          <BottomSheetScrollView
            className="flex-1 p-5 bg-primary rounded-t-xl"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {/* Drag Indicator */}
            <View className="w-12 h-1 bg-white rounded-full self-center mb-2" />

            {/* Header */}
            <Text className="text-white text-lg font-semibold text-center mb-4">New Schedule Todo</Text>

            {/* Title Input */}
            <Text className="text-white font-medium mb-1">Title Task</Text>
            <TextInput
              className="bg-white rounded-lg px-4 py-4 mb-4 text-black"
              placeholder="Enter task title"
              value={taskDetails.title}
              onChangeText={(text) => handleInputChange("title", text)}
            />

            {/* Category Selection */}
            <Text className="text-white font-medium mb-2">Category</Text>
            <View className="h-14 pl-[10px]">
              <BottomSheetFlatList
                horizontal
                data={categories}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`py-3 mr-4 rounded-lg h-[45px] w-[160px] ${
                      taskDetails.category === item ? "bg-white" : "bg-blue-400"
                    }`}
                    onPress={() => handleInputChange("category", item)}
                  >
                    <Text className={taskDetails.category === item ? "text-blue-600 font-semibold text-center" : "text-white font-semibold text-center"}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Date & Time Input */}
            <View className="flex-row justify-between mt-4">
              {/* Date Input */}
              <View className="flex-1 mr-2">
                <Text className="text-white font-medium mb-1">Date</Text>
                <TextInput
                  className="bg-white rounded-lg px-4 py-2 text-black"
                  placeholder="dd/mm/yy"
                  value={taskDetails.date}
                  onChangeText={(text) => handleInputChange("date", text)}
                />
              </View>

              {/* Time Input */}
              <View className="flex-1 ml-2">
                <Text className="text-white font-medium mb-1">Time</Text>
                <TextInput
                  className="bg-white rounded-lg px-4 py-2 text-black"
                  placeholder="hh:mm"
                  value={taskDetails.time}
                  onChangeText={(text) => handleInputChange("time", text)}
                />
              </View>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-5 mt-8">
              <CustomButton
                title="Cancel"
                container="border border-white rounded-md py-2 px-16"
                textStyles="text-white font-semibold"
                handlePress={handleCloseModal}
              />
              <CustomButton
                title="Create"
                container="bg-white rounded-md py-2 px-16 w-[48%]"
                textStyles="text-black font-semibold"
                handlePress={handleCloseModal}
              />
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Schedule;
