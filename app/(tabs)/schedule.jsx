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
import React, { useState, useEffect, useCallback } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import  NotificationService  from '../../services/NotificationService';
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import config from "../../Appwrite/config";
import TaskCard from "../../components/TaskCard";
import { format,isToday, isTomorrow } from "date-fns";


const categories = ["Appointment", "Activity", "Therapy", "Education"];

const Schedule = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  //console.log(tasks);
  
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    category: null,
  });

  useEffect(() => {
     setupNotifications();
     
     fetchTasks();

     

     
  }, []);

  const fetchTasks = async () => {
    console.log("fetching tasks..");
    try {
      const response = await config.getAllTasks();
      console.log(response);
  
      // Separate tasks based on status
      const pending = response.filter(task => task.status !== "completed");
      const completed = response.filter(task => task.status === "completed");
  
      setTasks(pending);
      setCompletedTasks(completed);
  
      console.log("fetching tasks Complete");
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tasks');
    }
  };
  
  



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
    const formattedTime = time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    handleInputChange("time", formattedTime);
    setTimePickerVisible(false);
  };

  const handleInputChange = (field, value) => {
    setTaskDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateTaskDetails = () => {
    if (!taskDetails.title || !taskDetails.date || !taskDetails.time || !taskDetails.description || !taskDetails.category) {
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
      //console.log("newTask", newTask);


      // Schedule the notification
      const notificationId = await NotificationService.scheduleTaskNotification(newTask);
      console.log("Created notificationId is:", notificationId);
      
      // Add notification ID to task
      newTask.notificationId = notificationId;
      
      // Update tasks list
      setTasks(prevTasks => [...prevTasks, newTask]);

      // Save task to database appWrite

      

     const result =  await config.taskCreated({
                title: taskDetails.title,
                description: taskDetails.description,
                date: taskDetails.date,
                time: taskDetails.time,
                category: taskDetails.category,
                status: 'pending',
                notificationId,
                id: newTask.id,
            });
            if(!result) throw new Error('Task creation failed');
            //console.log('Task created successfully', result);
            setModalVisible(false);
      // Reset form
      setTaskDetails({
        title: "",
        description: "",
        date: "",
        time: "",
        category: null,
      });
      
      
      Alert.alert('Success', 'Task scheduled successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };



  // const handleToggleTaskStatus = useCallback ((taskId, ) => {
  //   //console.log("toggle task id", taskId);
  //   setCompletedTasks((prevCompleted) => {
  //     if (prevCompleted.some((task) => task.id === taskId)) {
  //       // If task is already completed, remove it from completed tasks
  //       return prevCompleted.filter((task) => task.id !== taskId);
  //     } else {
  //       // Add to completed tasks
  //       const task = tasks.find((task) => task.id === taskId);
  //       if (task) {
  //         return [...prevCompleted, { ...task, status: "completed" }];
  //       }
  //     }
  //     return prevCompleted;
  //   });
  // },[tasks]);


  const handleToggleTaskStatus = useCallback(async (taskId, updateId, notificationId) => {
    // console.log(updateId)
    console.log(taskId)
    try {
      // Determine new status
      const isCurrentlyCompleted = completedTasks.some(ct => ct.id === taskId);

      const response = await config.getAllTasks(taskId);
      console.log("get Document",response[0].$id)
      const updateId = response[0].$id;



      const newStatus = isCurrentlyCompleted ? 'pending' : 'completed';
  
      // Update backend first
      await config.updateTaskStatus(updateId, newStatus);
  
      // Then update local state
      setCompletedTasks(prevCompleted => {
        if (isCurrentlyCompleted) {
          // Cancel completion
          return prevCompleted.filter(task => task.id !== taskId);
        } else {
          // Mark as completed and cancel notification
          const task = tasks.find(task => task.id === taskId);
          if (task) {
            NotificationService.cancelNotification(notificationId);
            return [...prevCompleted, { ...task, status: "completed" }];
          }
        }
        return prevCompleted;
      });
  
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status');
      console.error('Update error:', error);
    }
  }, [tasks, completedTasks]);



  const TaskBox = ({ title, bgColor, tasks = [], isCompleted }) => {

    // console.log("tasks:", tasks);
    // console.log("title:", title);
  
    const formatDate = (taskDate, taskTime) => {
      try {
        if (!taskDate || !taskTime) return "Invalid Date";
  
        // Parse date (DD/MM/YYYY)
        const [day, month, year] = taskDate.split('/').map(Number);
        
        // Parse 12-hour time with AM/PM
        const timeParts = taskTime.match(/(\d+):(\d+) ([APap][Mm])/);
        if (!timeParts) return "Invalid Time";
        
        let [hours, minutes] = timeParts.slice(1, 3).map(Number);
        const period = timeParts[3].toUpperCase();
  
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
  
        // Create Date object (months are 0-indexed)
        const taskDateTime = new Date(year, month - 1, day, hours, minutes);
  
        if (isNaN(taskDateTime)) return "Invalid Date";
  
        // Format output
        const formattedTime = format(taskDateTime, 'h:mm a');
        
        if (isToday(taskDateTime)) {
          return `Today, ${formattedTime}`;
        }
        if (isTomorrow(taskDateTime)) {
          return `Tomorrow, ${formattedTime}`;
        }
        return `${format(taskDateTime, 'MMM d')}, ${formattedTime}`;
  
      } catch (error) {
        console.error('Date formatting error:', error);
        return "Invalid Date";
      }
    };
  
    return (
      <View className="mb-4 ">
        <Text className="text-lg font-semibold text-black mb-2">{title}</Text>
        <View className={`border ${bgColor} rounded-lg  h-[285px]`}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingTop: 10,
              paddingHorizontal: 8,
              
            }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <View key={task.id}>
                  <TaskCard
                    title={task.title}
                    description={task.description}
                    time={formatDate(task.date, task.time)}
                    category={task.category}
                    available={true}
                    taskId={task.id}
                    checked={completedTasks.some(ct => ct.id === task.id)}
                    onToggle={(taskId) => handleToggleTaskStatus(
                      taskId, 
                      // task.updateId, 
                      task.notificationId
                    )}
                    updateId={task.updateId}
                    status={isCompleted}
                    notificationId={task.notificationId}
                    
                    
                  />  
                </View>
              ))
            ) : (
              <View className="flex-1 h-[200px] justify-center items-center">
                <Text className="text-gray-600">No {title} Available</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    );
  };

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
            
            tasks={completedTasks}
            isCompleted={true}
            
            
            // tasks={tasks.filter(task => task.status === 'completed')}
          />
          <TaskBox 
            title="Pending Tasks" 
            bgColor="border-primary" 
            tasks={tasks}
            isCompleted={false}
    
            //  tasks={tasks.filter(task => task.status === 'pending')}
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

              {/* Description Input */}
              <Text className="text-white font-medium mb-1">Description</Text>
              <TextInput 
                className="bg-white rounded-lg px-4 py-4 mb-4 text-black" 
                placeholder="Enter task description" 
                value={taskDetails.description} 
                onChangeText={(description) => handleInputChange("description", description)} 
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