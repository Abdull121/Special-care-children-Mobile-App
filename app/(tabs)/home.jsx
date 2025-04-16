import React, { useCallback, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import icons from "../../constants/icons";
import TaskCard from "../../components/TaskCard";
import CommunitySection from "../../components/CommunityCard";
import ResourcesSection from "../../components/ResourcesCard";
import FormFields from "../../components/FormFields";
import CustomButton from "../../components/CustomButton";
import { Dropdown } from "react-native-element-dropdown";
import config from "../../Appwrite/config";
import authService from "../../Appwrite/auth";

//image picker 
import * as ImagePicker from 'expo-image-picker';


import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";




const Home = () => {
  const { user,setUser } = useGlobalContext();
  //console.log(user)
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [profileLoader, setProfileLoader] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(null); 

  const [childData,setChildData] = useState(false);

  const [form, setForm] = useState({
      childName: "",
      age: "",
    });
    const [selectedValue, setSelectedValue] = useState("");
  
    //console.log(selectedValue)
  
    const [isFocus, setIsFocus] = useState(false);
    const data = [
      { label: "Autism", value: "autism" },
      { label: "ADHD", value: "adhd" },
      { label: "Down Syndrome", value: "down_syndrome" },
      { label: "Cerebral Palsy", value: "cerebral_palsy" },
    ];
  

  useFocusEffect(
      useCallback(() => {
        
        fetchTasks();
      }, [])
    );


  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = [
        { id: 1, title: "Interview with doctor for therapy.", description: "An insightful conversation with a doctor.", time: "Today, 8:00 AM " },
        { id: 2, title: "Session on ADHD Awareness.", description: "Understanding ADHD therapy in depth.", time: "Today, 1:00 AM " },
        
      ];
      setTasks(fetchedTasks);

      const fetchChildMode =  await config.getChildModeData()
      
      setChildData(fetchChildMode)
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };


  const handelUpdate = async () => {
    setIsLoading(true);
    console.log(form.age, form.childName);

    try {
      for (const item of data) {
        if (item.value === selectedValue) {
          console.log(item.value);
          const result = await config.updateChildProfile(
             form.childName,
             form.age,
             item.value,
             tempAvatar || user.avatar,
             
          );
          if (result) {
            setIsLoading(false);
            console.log("Child profile update successfully");
            // Set updated user info in global context
              setUser(prev => ({
                ...prev,
                childName: form.childName,
                age: form.age,
                primaryCondition: item.value,
                avatar: tempAvatar || prev.avatar,
              }));
             setModal(false)
             setTempAvatar(null); 
          }
          break; // Exit the loop once the matching item is found and processed
        }
      }
    } catch (error) {
      console.log("Appwrite serive :: createChildeProfile :: error", error);
    }
  }
        const handleModalClose = () => {
          setTempAvatar(null); // Discard temporary 
          // avatar
        
          setProfileLoader(false); // Reset profile loader state
          setModal(false);
        };


       // image picker function
       const pickImage = async () => {
        try {
          const result = await ImagePicker.launchImageLibraryAsync({
           mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
      
          // Handle new Expo image picker structure
          if (!result.canceled && result.assets && result.assets.length > 0) {
            return result.assets[0];
          }
          return null;
        } catch (error) {
          console.error("Image picker error:", error);
          return null;
        }
      };

 

  return (
      <SafeAreaView className="flex-1 bg-white">
      {loading ? (<View className="flex items-center justify-center h-screen">
                    <ActivityIndicator size="large" color="blue" />
                </View>):
                         (  <ScrollView style={{
        flex: 1,
        backgroundColor: modal ? 'rgba(0, 0, 0, 0.8)' : '#FFFFFF',
        paddingHorizontal: 20,  // px-5
        paddingTop: 50,         // pt-10
        marginBottom: 64,       // mb-16
      }}>





      {/* Profile Section */}
      <View 
      style={{
          flexDirection:'row',
          alignItems:'center',
          backgroundColor: modal ? 'rgba(0, 0, 0, 0)' : '#FFFFFF',
          marginBottom: 16,  
          marginBottom: 20,
        }}
      >

        <TouchableOpacity
          onPress={() => {
              setForm({
                childName: user?.childName || "",
                age: user?.age || "",
              });
              setSelectedValue(user?.primaryCondition || "");
              setModal(true);
          }}
          >
        <Image
          source={{ uri: user?.avatar }}
          className="w-12 h-12 rounded-full mr-3"
        />
        </TouchableOpacity>
        <View>
          <Text className="text-lg font-bold">{user?.childName}</Text>
          <Text className="text-gray-500 text-sm">Age, {user?.age} Years</Text>
        </View>
      </View>

      {/* Greeting */}
      <Text className="text-2xl font-bold">Hello, {user?.childName}</Text>
      <Text className="text-gray-500 text-base mb-5">Make your day easy with us.</Text>

      {/* Reflection & Task Progress */}
      <View className="flex-row justify-between">
        {/* Reflection Card */}
        <View className="bg-primary p-5 rounded-[16px] flex-1 h-60 mr-2">
          {/* <Image
            source={childData?.emoji || icons.smile}
            resizeMode="contain"
            className="w-14 h-14"
          /> */}
          <Text className="text-[36px] mt-2">{childData?.emoji || '😍'}</Text>
          <Text className="text-white text-sm mt-8">Daily Reflection</Text>
          <Text className="text-white text-lg font-bold mt-1">
            Hello, {user?.childName} is feeling {childData?.childMood} now!
          </Text>
        </View>

        {/* Progress Card */}
        <View className="bg-gray-200 p-5 rounded-[16px] flex-1">
          <FontAwesome name="check-circle" size={24} color="gray" />
          <Text className="text-sm mt-1">{childData?.completedTask || '2'}/{childData?.totalTask || '3'
          } Tasks done</Text>
          <Text className="text-lg font-bold mt-1">Activity tasks Completed.</Text>
        </View>
      </View>

      {/* Video Resource */}
      <View className="bg-gray-300 p-4 rounded-xl flex-row items-center mt-4">
        <FontAwesome name="play-circle" size={24} color="black" />
        <View className="ml-3">
          <Text className="text-gray-600 text-sm">5 min watch</Text>
          <Text className="text-lg font-bold">Understanding ADHD Therapy</Text>
        </View>
        <TouchableOpacity className="ml-auto">
          <Text className="text-blue-600 font-bold">View</Text>
        </TouchableOpacity>
      </View>

      {/* Tasks Section */}
      <View className="mt-7  pb-10">
        <View className="flex-row justify-between mb-3">
          <Text className="text-xl font-bold">Today Tasks</Text>
          <TouchableOpacity>
            <Text className="text-blue-600 font-bold">View all</Text>
          </TouchableOpacity>
        </View>

        {/* Task Cards */}
        {loading ? (
          <Text className="text-gray-500">Loading tasks...</Text>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} title={task.title} description={task.description} time={task.time} />
          ))
        )}

         {/* Community & Resources Sections */}
      {/* <CommunitySection /> */}
      <ResourcesSection />

      {/* Child Mode Usage Chart */}
      {/* <ChildModeChart /> */}

        {/* Modal for profile */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={()=> setModal(false)}>
         
          <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
        
          showsVerticalScrollIndicator={false}
          
          >
          <View className="flex-1 h-full  justify-end  ">
          <View className="bg-white  w-full h-[98%] rounded-3xl p-5">
          <TouchableOpacity

            onPress={handleModalClose}
          
          >
            <View className="flex-row  justify-end items-center p-2">
            
            <FontAwesome name="close" size={24} color="gray" />

            </View>
            </TouchableOpacity>
              <Text className="text-center justify-center mt-8 text-lg font-bold">Edit Profile & Mood Tracking</Text>
              <Text className="text-center justify-center mt-8 text-base font-pregular">Personalize your child journey and track their daily behaviour</Text>
              <View className="justify-center items-center mt-8">
                    {profileLoader ? (<ActivityIndicator size="small" color="#0166FC" />) : (
                      <Image
                    source={{ uri: tempAvatar || user?.avatar }}
                    className="w-24 h-24 rounded-full mr-3"
                  />
                    )}
                  <TouchableOpacity
                  onPress={async () => {
                    
                    try{
                      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (status !== 'granted') {
                  alert('Permission to access media library is required!');
                  }
    
                    const selectedImage = await pickImage();
                    if (!selectedImage) {
                      console.log("No image selected");
                      return;
                    }
                    setProfileLoader(true);
                    
                    // console.log(selectedImage);
                    
                      const uploaded = await config.uploadToCloudinary(selectedImage.uri);
                      console.log(uploaded);
                      setTempAvatar(uploaded);
                      

                  
                    }catch (error) {

                      console.error("Full component error:", {
                        name: error.name,
                        message: error.message,
                        stack: error.stack
                      });
                      
                    }
                    finally{
                      setProfileLoader(false);
                    }
                  }}
                  
                  >

                    <Text className="text-blue-600  mt-3 font-bold">Change Picture</Text>
                  </TouchableOpacity>
              </View>
                  
                  <FormFields
                  title="Child Name"
                  placeholder="Enter your child name"
                  keyboardType="default"
                  secureTextEntry={false}
                  value={form.childName}
                  handleChangeText={(e) => setForm({ ...form, childName: e })}
                  otherStyle="mt-7"
                />
                      <FormFields
                    title="Age"
                    placeholder="Enter your child age"
                    keyboardType="number-pad"
                    secureTextEntry={false}
                    value={form.age}
                    handleChangeText={(e) => setForm({ ...form, age: e })}
                    otherStyle="mt-7"
                  />

                    {/* Drop Down Field */}

                    <View className="mt-7">
                      <Text className="text-black-Default text-lg font-psemibold mb-2 text-[14px] line-hight-[24px]">
                        Primary Condition
                      </Text>
                      <Dropdown
                        data={data}
                        maxHeight={200}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? "Select Condition" : "..."}
                        value={selectedValue}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(item) => {
                        setSelectedValue(item.value);
                        setIsFocus(false);
                        }}
                        style={{
                          height: 48,
                          
                          
                           borderColor: isFocus ? "#0166FC" : "#A4A6A6",
                        
                          borderWidth: 2,
                          borderRadius: 4,
                          paddingHorizontal: 8,
                          justifyContent: "center",
                        }}
                        placeholderStyle={{
                          color: "#A4A6A6",
                          fontSize: 14,
                          fontFamily: "Poppins-Regular", // Replace with your font
                        }}
                        selectedTextStyle={{
                          color: "#000",
                          fontSize: 14,
                          fontFamily: "Poppins-Regular", // Replace with your font
                        }}
                        
                      />
                    </View>

                      <CustomButton
                        handlePress={handelUpdate}
                        title={isLoading ? (
                                      <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                      "Update"
                                    )}
                        textStyles="text-center text-white text-[14px] font-psemibold "
                        container="mt-7 w-full h-12 w-[99.6%] rounded-[4px] bg-[#0166FC]"
                      />
                      <CustomButton
                        handlePress={async()=>{

                          try{
                            await authService.logout(); 
                            setUser(null);                       
                            setModal(false);                    
                            router.replace('/login');
                          }catch (error) {
                            console.error("Appwrite serive :: logout :: error", error);
                          }
                          
                        }}
                        title="Log Out"
                        textStyles="text-center text-white text-[14px] font-psemibold "
                        container="mt-7 mb-3 w-full h-12 w-[99.6%] rounded-[4px] bg-[#cc0415]"
                      />

         
          
          

          </View>

          </View>
          </ScrollView>

          

        </Modal>

      </View>
    </ScrollView>)}
      
   </SafeAreaView>
  );
};

export default Home;
