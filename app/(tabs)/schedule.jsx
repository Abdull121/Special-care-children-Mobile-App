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
  Alert,
  ActivityIndicator
} from "react-native";
import { unstable_batchedUpdates } from 'react-dom';
import React, { useState, useEffect, useCallback, useMemo } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NotificationService from "../../services/NotificationService";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import config from "../../Appwrite/config";
import TaskCard from "../../components/TaskCard";
import { format, isToday, isTomorrow, parse, } from "date-fns";


const categories = ["Appointment", "Activity", "Therapy", "Medication"];

const Schedule = () => {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
  const getTaskStatistics = (tasks, completedTasks) => {
    const totalTasks = tasks.length + completedTasks.length;
    const pendingTasks = tasks.length;
    const completedCount = completedTasks.length;

    const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    if (tasks.length || responses.length > 0) {
      if (completionPercentage >= 90)
        return {
          emoji: "😍",
          childMood: "Happy",
          percentage: completionPercentage,
          pendingTasks: pendingTasks,
          completedCount: completedCount,
          totalTasks: totalTasks,
        };
      if (completionPercentage >= 80)
        return {
          emoji: "🤩",
          childMood: "Energetic",
          percentage: completionPercentage,
          pendingTasks: pendingTasks,
          completedCount: completedCount,
          totalTasks: totalTasks,
        };
      if (completionPercentage >= 50)
        return {
          emoji: "😇",
          childMood: "Calm ",
          percentage: completionPercentage,
          pendingTasks: pendingTasks,
          completedCount: completedCount,
          totalTasks: totalTasks,
        };
      if (completionPercentage >= 30)
        return {
          emoji: "😔",
          childMood: "Sad",
          percentage: completionPercentage,
          pendingTasks: pendingTasks,
          completedCount: completedCount,
          totalTasks: totalTasks,
        };
      return {
        emoji: "😡",
        childMood:"Angry", 
        percentage: completionPercentage,
        pendingTasks: pendingTasks,
        completedCount: completedCount,
        totalTasks: totalTasks,
      };
    }

    return {
      emoji: "😍",
      childMood: "Happy",
      percentage: completionPercentage,
      pendingTasks: pendingTasks,
      completedCount: completedCount,
      totalTasks: totalTasks,
    };
  };
  const taskStatistics = useMemo(() => getTaskStatistics(tasks, completedTasks), [tasks, completedTasks]);
  useEffect(() => {
    //console.log(taskStatistics);
    const { emoji, childMood, completedCount, totalTasks } = taskStatistics;
    //console.log("useEffect", emoji, childMood, completedCount, totalTasks);
    updateChildMood(emoji, childMood, completedCount, totalTasks);
    createChildMood(emoji, childMood, completedCount, totalTasks);

    
    
  }, [taskStatistics]);

  const fetchTasks = async () => {
    //console.log("fetching tasks..");
    setIsLoading(true);
    try {
      const response = await config.getAllTasks();

      setResponses(response);

      // Separate tasks based on status
      const pending = response.filter((task) => task.status !== "completed");
      const completed = response.filter((task) => task.status === "completed");

      unstable_batchedUpdates(() => {
        setTasks(pending);
        setCompletedTasks(completed);
      });

      // console.log("fetching tasks Complete");
    } catch (error) {
      Alert.alert("Error", "No tasks found");
    }
    finally {
      setIsLoading(false); // Stop loading spinner
    }
  };


  //create Child Mode in appWrite

  const createChildMood = async (emoji, childMood, completedCount, totalTasks  ) => {
    try {
      //console.log("before sending", emoji, childMood, completedCount, totalTasks);
      const response = await config.createChildMood(emoji, childMood,  completedCount, totalTasks);
      // console.log("crete Child Mood",response);
    } catch (error) {
      console.log(error);
    }
  };
  

  //update Child Mood in AppWrite
  const updateChildMood = async (emoji, childMood, completedCount, totalTasks  ) => {

    
    
    try {
      
        const  getAllChildMood = await config.fetchChildMood();
        // if(!getAllChildMood.length > 0) throw new Error("No child mood found");
    

         
       //console.log("getAllChildMood", getAllChildMood);
      
        const documentId = getAllChildMood[0].$id
      
      
      const response = await config.updateChildMood(emoji, childMood,  completedCount, totalTasks, documentId );
      //console.log("updated",response);
      
      
      

    } catch (error) {
      console.log(error);
    }
  };

  const setupNotifications = async () => {
    try {
      await NotificationService.initialize();
    } catch (error) {
      Alert.alert("Notification Error", error.message);
    }
  };

  const handleDateConfirm = (date) => {
    const formattedDate = date.toLocaleDateString("en-GB"); // DD/MM/YYYY
    handleInputChange("date", formattedDate);
    setDatePickerVisible(false);
  };

  const handleTimeConfirm = (time) => {
    const formattedTime = time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    handleInputChange("time", formattedTime);
    setTimePickerVisible(false);
  };



  //reduce the number of calls to the handleInputChange function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };



  const handleInputChange = useCallback(
    debounce((field, value) => {
      setTaskDetails((prev) => ({ ...prev, [field]: value }));
    }, 200),
    [] // 00Empty dependency array ensures the same debounced function is used
  );

  const validateTaskDetails = () => {
    if (
      !taskDetails.title ||
      !taskDetails.date ||
      !taskDetails.time ||
      !taskDetails.description ||
      !taskDetails.category
    ) {
      Alert.alert("Invalid Input", "Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleCreateTask = async () => {
    if (!validateTaskDetails()) return;
    setIsLoading(true); // Set loading state to true

    try {
      // Add task to local state first
      const newTask = {
        id: Date.now().toString(),
        ...taskDetails,
        status: "pending",
      };
      //console.log("newTask", newTask);

      // Schedule the notification
      const notificationId = await NotificationService.scheduleTaskNotification(
        newTask
      );
      // console.log("Created notificationId is:", notificationId);

      // Add notification ID to task
      newTask.notificationId = notificationId;

      // Update tasks list
      setTasks((prevTasks) => [...prevTasks, newTask]);
      // Update task statistics
      // getTaskStatistics(tasks, completedTasks);

      // Save task to database appWrite

      const result = await config.taskCreated({
        title: taskDetails.title,
        description: taskDetails.description,
        date: taskDetails.date,
        time: taskDetails.time,
        category: taskDetails.category,
        status: "pending",
        notificationId,
        id: newTask.id,
      });
      if (!result) throw new Error("Task creation failed");
      //console.log('Task created successfully', result);


      //destructuring taskStatistics
      const { emoji, childMood, completedCount, totalTasks } = taskStatistics;
      //call the childMood function for creating childMood
      createChildMood(emoji, childMood, completedCount, totalTasks);
  



      setModalVisible(false);
      setIsLoading(false); // Set loading state to false


      // Reset form
      setTaskDetails({
        title: "",
        description: "",
        date: "",
        time: "",
        category: null,
      });

      // Alert.alert("Success", "Task scheduled successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
      setIsLoading(false); // Set loading state to false
    }
  };

  const handleToggleTaskStatus = useCallback(
    async (taskId, notificationId) => {
      try {
        //console.log(taskId);
        // Determine new status
        const isCurrentlyCompleted = completedTasks.some(
          (task) => task.id === taskId
        );

        // Fetch the task document ID
        const response = await config.getAllTasks(taskId);
        //console.log(response)
        const updateId = response[0].$id;

        const newStatus = isCurrentlyCompleted ? "pending" : "completed";
        //console.log("task Status", newStatus);  

        // Update backend
        await config.updateTaskStatus(updateId, newStatus);

        // Update local state

        setTimeout(() => {
          setTasks((prevTasks) => {
            if (isCurrentlyCompleted) {
              // Move from completedTasks back to pending tasks
              const taskToMove = completedTasks.find(
                (task) => task.id === taskId
              );
              return taskToMove
                ? [...prevTasks, { ...taskToMove, status: "pending" }]
                : prevTasks;
            }
            
            
            else {
              // Remove from tasks (pending) when completed

              const result = prevTasks.filter((task) => task.id !== taskId);
              // Update statistics correctly
              // console.log(
              //   getTaskStatistics([...prevTasks], [...completedTasks])
              // );
              const { emoji, childMood,  completedCount, totalTasks} = getTaskStatistics(
                [...prevTasks],
                [...completedTasks]
              );
              updateChildMood(emoji, childMood, completedCount, totalTasks );

              return result;

              
            }
          });
        }, 2000);

        setCompletedTasks((prevCompleted) => {
          if (isCurrentlyCompleted) {
            // Remove from completedTasks when marking as pending
            return prevCompleted.filter((task) => task.id !== taskId);
          } else {
            // Move from pending tasks to completedTasks
            const taskToMove = tasks.find((task) => task.id === taskId);
            if (taskToMove) {
              NotificationService.cancelNotification(notificationId);
              return [...prevCompleted, { ...taskToMove, status: "completed" }];
            }
          }
          return prevCompleted;
        });
      } catch (error) {
        Alert.alert("Error", "Failed to update task status");
        console.error("Update error:", error);
      }
    },
    [tasks, completedTasks]
  );

  
  const TaskBox = React.memo(({ title, bgColor, tasks = [], isCompleted }) => {
    


    const formatDate = (taskDate, taskTime) => {
      try {
        if (!taskDate || !taskTime) return "Invalid Date";
    
        // Convert taskDate into a Date object
        const parsedDate = parse(taskDate, "dd/MM/yyyy", new Date());
        if (isNaN(parsedDate)) return "Invalid Date";
    
        // Extract time components
        const timeParts = taskTime.match(/(\d+):(\d+) ([APap][Mm])/);
        if (!timeParts) return "Invalid Time";
    
        let [hours, minutes] = timeParts.slice(1, 3).map(Number);
        const period = timeParts[3].toUpperCase();
        
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
    
        // Set the correct time
        parsedDate.setHours(hours, minutes, 0, 0);
    
        if (isNaN(parsedDate)) return "Invalid Date";
    
        const formattedTime = format(parsedDate, "h:mm a");
        if (isToday(parsedDate)) return `Today, ${formattedTime}`;
        if (isTomorrow(parsedDate)) return `Tomorrow, ${formattedTime}`;
        
        return `${format(parsedDate, "MMM d")}, ${formattedTime}`;
      } catch (error) {
        console.error("Date formatting error:", error);
        return "Invalid Date";
      }
    };
    return (
      <View className="mb-4">
        <Text className="text-lg font-semibold text-black mb-2">{title}</Text>
        <View className={`border ${bgColor} rounded-lg h-[285px]`}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 8 }} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
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
                    checked={completedTasks.some((ct) => ct.id === task.id)}
                    onToggle={(taskId) => handleToggleTaskStatus(taskId, task.notificationId)}
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
  });

  return (
    <SafeAreaView className="flex-1 bg-white mb-20">
      {isLoading ? (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ):(
      <ScrollView
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
            <Text className="text-white font-semibold text-lg">
              Create New Task
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )}
      

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
              <TextInput
                className="bg-white rounded-lg px-4 py-4 mb-4 text-black"
                placeholder="Enter task title"
                onChangeText={(text) => handleInputChange("title", text)}
              />

              {/* Description Input */}
              <Text className="text-white font-medium mb-1">Description</Text>
              <TextInput
                className="bg-white rounded-lg px-4 py-4 mb-4 text-black"
                placeholder="Enter task description"
                // value={taskDetails.description}
                onChangeText={(text) => handleInputChange("description", text)}
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
                        taskDetails.category === item
                          ? "text-blue-600"
                          : "text-white"
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
                      style={{
                        width: 35,
                        height: 35,
                        position: "absolute",
                        left: 3,
                        top: 3,
                      }}
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
                      style={{
                        width: 35,
                        height: 35,
                        position: "absolute",
                        left: 3,
                        top: 3,
                      }}
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
                  title={isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                              ) : (
                                "Create"
                              )}
                  // container="bg-white rounded-md py-2 flex-1"
                  container={`bg-white rounded-md py-2 flex-1 ${isLoading ? "opacity-50" : ""}`}
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
