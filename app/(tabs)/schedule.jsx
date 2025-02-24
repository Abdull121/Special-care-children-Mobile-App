import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Modal, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NotificationService } from '../services/NotificationService';
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";

const categories = ["Appointment", "Activity", "Therapy", "Education"];

const Schedule = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    date: "",
    time: "",
    category: null,
  });

  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {
      await NotificationService.initialize();
    } catch (error) {
      Alert.alert('Notification Error', error.message);
    }
  };

  const handleDateConfirm = (date) => {
    const formattedDate = date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    handleInputChange("date", formattedDate);
    setDatePickerVisible(false);
  };

  const handleTimeConfirm = (time) => {
    const formattedTime = time.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    handleInputChange("time", formattedTime);
    setTimePickerVisible(false);
  };

  const handleInputChange = (field, value) => {
    setTaskDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateTaskDetails = () => {
    if (!taskDetails.title || !taskDetails.date || !taskDetails.time || !taskDetails.category) {
      Alert.alert('Invalid Input', 'Please fill in all fields');
      return false;
    }
    return true;
  };

  const handleCreateTask = async () => {
    if (!validateTaskDetails()) return;
    

    try {
      // Add task to local state first
      const newTask = {
        id: Date.now().toString(),
        ...taskDetails,
        status: 'pending'
      };
      console.log("newTask", newTask);


      // Schedule the notification
      const notificationId = await NotificationService.scheduleTaskNotification(newTask);
      
      // Add notification ID to task
      newTask.notificationId = notificationId;
      
      // Update tasks list
      setTasks(prevTasks => [...prevTasks, newTask]);

      // Save task to database appWrite

      // await TaskService.createTask({
      //           title: taskDetails.title,
      //           date: taskDetails.date,
      //           time: taskDetails.time,
      //           category: taskDetails.category,
      //           status: 'pending',
      //           notificationId
      //       });

      // Reset form
      setTaskDetails({
        title: "",
        date: "",
        time: "",
        category: null,
      });
      
      setModalVisible(false);
      Alert.alert('Success', 'Task scheduled successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const TaskBox = ({ title, bgColor, tasks = [] }) => (
    <View className="mb-4">
      <Text className="text-lg font-semibold text-black mb-2">{title}</Text>
      <View className={`border ${bgColor} rounded-lg p-6 h-[285px]`}>
        <ScrollView>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <View key={task.id} className="mb-3 bg-white p-3 rounded-lg shadow">
                <Text className="font-semibold">{task.title}</Text>
                <Text className="text-gray-600">{`${task.date} at ${task.time}`}</Text>
                <Text className="text-blue-600">{task.category}</Text>
              </View>
            )))
           : (
            <Text className="text-gray-600 text-center">No {title} Available</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white mb-20">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: 50,
          marginTop: 40,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 mb-4">
        <TaskBox 
            title="Completed Task" 
            bgColor="border-primary" 
            tasks={tasks.filter(task => task.status === 'completed')}
          />
          <TaskBox 
            title="Pending Tasks" 
            bgColor="border-primary" 
            tasks={tasks.filter(task => task.status === 'pending')}
          />
          
          <TouchableOpacity 
            className="bg-blue-600 rounded-lg py-3 items-center w-full mt-4"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white font-semibold text-lg">Create New Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
        minimumDate={new Date()}
      />

      {/* Time Picker */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisible(false)}
      />

      {/* Create Task Modal */}
      <Modal 
        animationType="slide" 
        transparent 
        visible={modalVisible} 
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-primary p-6 pt-3 rounded-t-2xl">
              <View className="w-12 h-1 my-2 bg-white rounded-full self-center mb-2" />
              
              <Text className="text-white text-2xl font-semibold text-center mb-4">
                New Task
              </Text>

              {/* Title Input */}
              <Text className="text-white font-medium mb-1">Title</Text>
              <TextInput 
                className="bg-white rounded-lg px-4 py-4 mb-4 text-black" 
                placeholder="Enter task title" 
                value={taskDetails.title} 
                onChangeText={(text) => handleInputChange("title", text)} 
              />

              {/* Category Selection */}
              <Text className="text-white font-medium mb-2">Category</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingVertical: 8 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`py-3 rounded-lg mr-4 w-48 ${
                      taskDetails.category === item ? "bg-white" : "bg-blue-400"
                    }`}
                    onPress={() => handleInputChange("category", item)}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        taskDetails.category === item ? "text-blue-600" : "text-white"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />

              {/* Date and Time Selection */}
              <View className="flex-row gap-5 mt-4">
                <View className="w-[48%]">
                  <Text className="text-white font-medium mb-2">Date</Text>
                  <TouchableOpacity 
                    onPress={() => setDatePickerVisible(true)}
                    className="relative"
                  >
                    <TextInput 
                      className="bg-white rounded-lg p-3 text-center" 
                      placeholder="Select Date" 
                      value={taskDetails.date}
                      editable={false}
                    />
                    <Image 
                      source={icons.date} 
                      style={{ width: 35, height: 35, position: "absolute", left: 3, top: 3 }}
                    />
                  </TouchableOpacity>
                </View>

                <View className="w-[48%]">
                  <Text className="text-white font-medium mb-2">Time</Text>
                  <TouchableOpacity 
                    onPress={() => setTimePickerVisible(true)}
                    className="relative"
                  >
                    <TextInput 
                      className="bg-white rounded-lg p-3 text-center" 
                      placeholder="Select Time"
                      value={taskDetails.time}
                      editable={false}
                    />
                    <Image 
                      source={icons.time} 
                      style={{ width: 35, height: 35, position: "absolute", left: 3, top: 3 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-5 mt-8">
                <CustomButton
                  title="Cancel"
                  container="border border-white rounded-md py-2 flex-1"
                  textStyles="text-white font-semibold"
                  handlePress={() => setModalVisible(false)}
                />
                <CustomButton
                  title="Create"
                  container="bg-white rounded-md py-2 flex-1"
                  textStyles="text-black font-semibold"
                  handlePress={handleCreateTask}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default Schedule;