import React, { useCallback, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal, ActivityIndicator, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import icons from "../../constants/icons";
import TaskCard from "../../components/TaskCard";
import CommunityCard from "../../components/CommunityCard";
import ResourceCard from "../../components/ResourcesCard";
import FormFields from "../../components/FormFields";
import CustomButton from "../../components/CustomButton";
import { Dropdown } from "react-native-element-dropdown";
import config from "../../Appwrite/config";
import authService from "../../Appwrite/auth";
import useYouTubeVideoFetcher from "../../components/YoutubeVideos";
import YouTubeVideoPreview from "../../components/VideoPreview";
import {router} from "expo-router";
import useGamesFetcher from "../../components/FetchGmaes";



//image picker 
import * as ImagePicker from 'expo-image-picker';


import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth} from '@clerk/clerk-expo';




const Home = () => {
  const { user,setUser } = useGlobalContext();
 

  //get videos
  const SEARCH_QUERY = user?.primaryCondition 
  ? `Parenting special needs ${user.primaryCondition} children Urdu `
  : 'Parenting special needs children Urdu ';
  const { 
    videos = [], 
    isLoading: videosLoading = false,
    error: videosError 
  } = useYouTubeVideoFetcher(SEARCH_QUERY) || {};

  //get Gamess
   const { games, isLoading: gamesLoading } = useGamesFetcher();
  
  
  
  //console.log(user)
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [profileLoader, setProfileLoader] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(null); 

  const [childData,setChildData] = useState(false);
  const [communityData,setCommunityData] = useState(false);
  const { signOut } = useAuth();

  const [form, setForm] = useState({
      childName: "",
      age: "",
    });

    const [errors, setErrors] = useState({
      childName: "",
      age: "",
    });
    const [selectedValue, setSelectedValue] = useState("");
  
    //console.log(selectedValue)
  
    //menu dropdown in profile modal
    const [isFocus, setIsFocus] = useState(false);
    const data = [
      { label: "Autism", value: "autism" },
      { label: "ADHD", value: "adhd" },
      { label: "Down Syndrome", value: "down_syndrome" },
      { label: "Cerebral Palsy", value: "cerebral_palsy" },
    ];
  

  useFocusEffect(
      useCallback(() => {
        setLoading(true);
        setTimeout(()=>{
          fetchTasks();
        },[3000])
      }, [])
    );


  const fetchTasks = async () => {
    
    setLoading(true);

    try {
        // console.log("userData",user)
      
      
      const fetchChildMode =  await config.getChildModeData()
      setChildData(fetchChildMode)

      const todayChildTask = await config.getTodayTask();
      // console.log(todayChildTask);
      setTasks(todayChildTask);
      const communityData = await config.getPosts();
      //console.log(communityData); // Check the fetched data
      setCommunityData(communityData);


    } catch (error) {
      //console.error("Error fetching tasks:", error);
      return null;
    } finally {
      
        setLoading(false);
      
      
    }
  };


  const handelUpdate = async () => {

    // Reset errors
    setErrors({
      childName: "",
      age: "",
    });
    // Validate inputs
    let isValid = true;

    // Validate child name
    if (!form.childName.trim()) {
      setErrors(prev => ({...prev, childName: "Name is required"}));
      Alert.alert("Validation Error", "Child name is required");
      isValid = false;
    } else if (form.childName.trim().length > 30) {
      setErrors(prev => ({...prev, childName: "Name is too long (max 50 characters)"}));
      Alert.alert("Validation Error", "Child name is too long (maximum 50 characters)");
      isValid = false;
    }
    else if (!/^[a-zA-Z\s]+$/.test(form.childName.trim())) {
      // Regex to allow only letters and spaces
      setErrors(prev => ({...prev, childName: "Only letters and spaces allowed"}));
      Alert.alert("Validation Error", "Child name can only contain letters and spaces");
      isValid = false;
    }

    // Validate age
    if (!form.age.trim()) {
      setErrors(prev => ({...prev, age: "Age is required"}));
      Alert.alert("Validation Error", "Age is required");
      isValid = false;
    } else {
      const ageValue = parseInt(form.age.trim(), 10);
      if (isNaN(ageValue) || ageValue < 1 || ageValue > 99) {
        setErrors(prev => ({...prev, age: "Age must be between 1 and 99"}));
        Alert.alert("Validation Error", "Age must be between 1 and 99");
        isValid = false;
      }
    }


      // Validate condition selection
    if (!selectedValue) {
      Alert.alert("Validation Error", "Please select a primary condition");
      isValid = false;
    }


    if (!isValid) {
      return;
    }

    setIsLoading(true);
    //console.log(form.age, form.childName);

    try {
      for (const item of data) {
        if (item.value === selectedValue) {
          //console.log(item.value);
          const result = await config.updateChildProfile(
             form.childName,
             form.age,
             item.value,
             tempAvatar || user.avatar,
             
          );
          if (result) {
            setIsLoading(false);
            //console.log("Child profile update successfully");
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
      setIsLoading(false);
      Alert.alert("Update Failed", "There was a problem updating the profile. Please try again.");
      return null;
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
          //console.error("Image picker error:", error);
          return null;
        }
      };

      // Function to navigate to resources screen
  const handleViewAllVideos = useCallback(() => {
    router.push('/resources');
  }, []);

 

  return (
      <SafeAreaView className="flex-1 bg-white">
      {loading ? 
      (<View className="flex items-center justify-center h-screen">
        <ActivityIndicator size="large" color="blue" />
          </View>):
        (  <ScrollView style={{
        flex: 1,
        backgroundColor: modal ? 'rgba(0, 0, 0, 0.8)' : '#FFFFFF',
        paddingHorizontal: 20, 
        paddingTop: 50,         
        marginBottom: 48,       
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
          
          <Text className="text-[36px] mt-2">{childData?.emoji || '😍'}</Text>
          <Text className="text-white text-sm mt-8">Daily Reflection</Text>
          <Text className="text-white text-lg font-bold mt-1">
            Hello, {user?.childName} is feeling {childData?.childMood} now!
          </Text>
        </View>

        {/* Progress Card */}
        <View className="bg-gray-200 p-5 rounded-[16px] flex-1">
          <FontAwesome name="check-circle" size={24} color="gray" />
          <Text className="text-sm mt-1">{childData?.completedTask || '0'}/{childData?.totalTask || '0'
          } Tasks done</Text>
          <Text className="text-lg font-bold mt-1">Activity tasks Completed.</Text>
        </View>
      </View>

      {/* Video Resource */}
     
          {videosLoading ? (
        <View style={{ 
          backgroundColor: '#f0f0f0', 
          padding: 16, 
          borderRadius: 12, 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginTop: 16 
        }}>
            <View style={{ height: 24, width: 24, borderRadius: 12, backgroundColor: '#ddd' }} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <View style={{ height: 14, width: 80, backgroundColor: '#ddd', borderRadius: 4, marginBottom: 8 }} />
                <View style={{ height: 18, width: '100%', backgroundColor: '#ddd', borderRadius: 4 }} />
              </View>
            </View>
          ) : videos && videos.length > 0 ? (
            <YouTubeVideoPreview 
              video={videos[0]} 
              onViewAll={handleViewAllVideos}
            />
          ) : (
            <View style={{ 
              backgroundColor: '#f0f0f0', 
              padding: 16, 
              borderRadius: 12, 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginTop: 16 
            }}>
              <FontAwesome name="play-circle" size={24} color="black" />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: '#666', fontSize: 14 }}>5 min watch</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Understanding ADHD Therapy</Text>
              </View>
              <TouchableOpacity onPress={handleViewAllVideos}>
                <Text style={{ color: '#0066cc', fontWeight: 'bold' }}>View All</Text>
              </TouchableOpacity>
            </View>
          )}
      

     
      <View className="my-10 pb-10 ">

         {/* Tasks Section */}
        <View className="flex-row justify-between mb-3 pr-2">
          <Text className="text-xl font-bold">Today Tasks</Text>
          <TouchableOpacity
            onPress={() => router.push('/schedule')} >
            <Text className="text-blue-600 font-bold">View all</Text>
          </TouchableOpacity>
        </View>

        {/* Task Cards */}
        {loading ? (
          <Text className="text-gray-500">Loading tasks...</Text>
        ) : ( tasks.length > 0 ? (
          tasks.map((task) => (
            
            <TaskCard 
             key={task.$id}
             title={task?.title} 
             description={task?.description}
             time={task?.time} 
             category={task?.category}
             date="Today"
            />
          )) 

        ):(
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 160 , borderColor: '#0166FC', borderWidth: 1, borderRadius: 8 , marginBottom:20}}>
            <Text className="text-gray-500 text-center" >No tasks available for today.  </Text>
          </View>
        ))
        }

         {/* Community & Resources Sections */}
         <CommunityCard
          CommunitySection={true}
          data={communityData && communityData.length > 0 
            ? communityData[Math.floor(Math.random() * communityData.length)] 
            : null}
        />


      <ResourceCard 
        resourcesSection={true}
        data={games[0]}
      
      />

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
                      //console.log("No image selected");
                      return;
                    }
                    setProfileLoader(true);
                    
                    // console.log(selectedImage);
                    
                      const uploaded = await config.uploadToCloudinary(selectedImage.uri);
                      //console.log(uploaded);
                      setTempAvatar(uploaded);
                      

                  
                    }catch (error) {

                      // console.error("Full component error:", {
                      //   name: error.name,
                      //   message: error.message,
                      //   stack: error.stack
                      // });
                      return null;
                      
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
                  handleChangeText={(e) => {
                    setForm({ ...form, childName: e });
                    if (errors.childName) setErrors(prev => ({...prev, childName: ""}));
                  }}
                  otherStyle="mt-7"
                />
                {errors.childName ? (
                  <Text className="text-red-500 text-[12px] mt-1">{errors.childName}</Text>
                ) : null}


                      <FormFields
                        title="Age"
                        placeholder="Enter your child age (1-99)"
                        keyboardType="number-pad"
                        secureTextEntry={false}
                        value={form.age}
                        handleChangeText={(e) => {
                          // Only allow numbers
                          const numericValue = e.replace(/[^0-9]/g, '');
                          setForm({ ...form, age: numericValue });
                          if (errors.age) setErrors(prev => ({...prev, age: ""}));
                        }}
                        otherStyle="mt-7"
                      />
                      {errors.age ? (
                        <Text className="text-red-500 text-[12px] mt-1">{errors.age}</Text>
                      ) : null}

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
                        handlePress={async() => {
                          try {
                              await authService.logout(signOut);
                              setUser(null);
                              setModal(false);
                              // await signOut();
                              
                              // Add a small delay before redirecting to ensure all cleanup is complete
                              setTimeout(() => {
                                  router.replace('/login');
                              }, 600);
                          } catch (error) {
                              //console.error("Logout error:", error);
                              // Show an error message to the user
                              Alert.alert("Logout Failed", "There was a problem logging out. Please try again.");
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
