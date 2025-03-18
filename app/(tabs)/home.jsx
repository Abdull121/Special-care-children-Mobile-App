import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import icons from "../../constants/icons";
import TaskCard from "../../components/TaskCard";
import CommunitySection from "../../components/CommunityCard";
import ResourcesSection from "../../components/ResourcesCard";
//  import ChildModeChart from "../../components/ChildModeChart";

import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { user } = useGlobalContext();
  //console.log(user)
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = [
          { id: 1, title: "Interview with doctor for therapy.", description: "An insightful conversation with a doctor.", time: "Today, 8:00 AM " },
          { id: 2, title: "Session on ADHD Awareness.", description: "Understanding ADHD therapy in depth.", time: "Today, 1:00 AM " },
          
        ];
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
   <SafeAreaView className="flex-1 bg-white">
     <ScrollView className="flex-1 bg-white px-5 pt-10 mb-16">
      {/* Profile Section */}
      <View className="flex-row items-center mt-5 mb-4 bg-white">
        <Image
          source={{ uri: user?.avatar }}
          className="w-12 h-12 rounded-full mr-3"
        />
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
          <Image
            source={icons.smile}
            resizeMode="contain"
            className="w-14 h-14"
          />
          <Text className="text-white text-sm mt-8">Daily Reflection</Text>
          <Text className="text-white text-lg font-bold mt-1">
            Hello, {user?.childName} is feeling joyful now!
          </Text>
        </View>

        {/* Progress Card */}
        <View className="bg-gray-200 p-5 rounded-[16px] flex-1">
          <FontAwesome name="check-circle" size={24} color="gray" />
          <Text className="text-sm mt-1">2/3 Tasks done</Text>
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
      <CommunitySection />
      <ResourcesSection />

      {/* Child Mode Usage Chart */}
      {/* <ChildModeChart /> */}
      </View>
    </ScrollView>
   </SafeAreaView>
  );
};

export default Home;
