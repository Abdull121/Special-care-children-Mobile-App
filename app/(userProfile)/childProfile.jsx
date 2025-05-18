import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Alert } from "react-native";
import React, { useState } from "react";
import FormFields from "../../components/FormFields";
import CustomButton from "../../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import service from "../../Appwrite/config";
import { useGlobalContext } from "../../context/GlobalProvider";

const childProfile = () => {
  const { setUser } = useGlobalContext();
  
  // Form state
  const [form, setForm] = useState({
    childName: "",
    age: "",
  });
  
  // Dropdown state
  const [selectedValue, setSelectedValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  
  // Error and loading states
  const [errors, setErrors] = useState({
    childName: "",
    age: "",
    condition: ""
  });
  const [loading, setLoading] = useState(false);
  
  // Dropdown data
  const data = [
    { label: "Autism", value: "autism" },
    { label: "ADHD", value: "adhd" },
    { label: "Down Syndrome", value: "down_syndrome" },
    { label: "Cerebral Palsy", value: "cerebral_palsy" },
  ];

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return "Child name is required";
    } else if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    } else if (name.trim().length > 50) {
      return "Name must be less than 50 characters";
    }
    return "";
  };

  const validateAge = (age) => {
    if (!age.trim()) {
      return "Age is required";
    }
    
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum)) {
      return "Age must be a number";
    } else if (ageNum < 1 || ageNum > 99) {
      return "Age must be between 1 and 99";
    }
    return "";
  };

  const validateCondition = (condition) => {
    if (!condition) {
      return "Please select a primary condition";
    }
    return "";
  };

  // Validate all form fields
  const validateForm = () => {
    const nameError = validateName(form.childName);
    const ageError = validateAge(form.age);
    const conditionError = validateCondition(selectedValue);
    
    setErrors({
      childName: nameError,
      age: ageError,
      condition: conditionError
    });
    
    // If any validation error exists, show alert and return false
    if (nameError || ageError || conditionError) {
      Alert.alert(
        "Validation Error", 
        "Please fix the errors in the form."
      );
      return false;
    }
    
    return true;
  };

  // Form submission handler
  const handleSubmit = async () => {
    // Run validation
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Find the selected condition from the data array
      const selectedCondition = data.find(item => item.value === selectedValue);
      
      if (selectedCondition) {
        const result = await service.createChildProfile({
          childName: form.childName.trim(),
          age: form.age,
          primaryCondition: selectedCondition.value,
        });
        
        console.log("Appwrite service :: createChildProfile :: result", result);

        if (result) {
          console.log("Child profile created successfully");
          setUser(result);
          
          // Navigate to home screen with history reset
          router.replace({
            pathname: "/home",
            reset: true
          });
        }
      }
    } catch (error) {
      console.log("Appwrite service :: createChildProfile :: error", error);
      Alert.alert(
        "Error", 
        "Failed to create child profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle name input change
  const handleNameChange = (text) => {
    setForm(prev => ({ ...prev, childName: text }));
    if (errors.childName) {
      setErrors(prev => ({ ...prev, childName: "" }));
    }
  };

  // Handle age input change
  const handleAgeChange = (text) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setForm(prev => ({ ...prev, age: numericText }));
    if (errors.age) {
      setErrors(prev => ({ ...prev, age: "" }));
    }
  };

  // Handle dropdown change
  const handleConditionChange = (item) => {
    setSelectedValue(item.value);
    setIsFocus(false);
    if (errors.condition) {
      setErrors(prev => ({ ...prev, condition: "" }));
    }
  };

  return (
    <SafeAreaView className="bg-white">
      <View className="h-full px-4 py-2 bg-white">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View className="w-full justify-center mt-6 min-h-[85vh]">
            {/* Header */}
            <Text className="font-heading text-primary text-[34px] mb-[35px] text-center">
              SPECIAL CARE
            </Text>
            
            {/* Subheader */}
            <View>
              <Text className="font-psemibold text-[24px]">
                Tell us about your child
              </Text>
              <Text className="font-pregular text-gary-Default">
                This helps us personalize your experience
              </Text>
            </View>
            
            {/* Child Name Input */}
            <FormFields
              title="Child Name"
              placeholder="Enter your child name"
              keyboardType="default"
              secureTextEntry={false}
              value={form.childName}
              handleChangeText={handleNameChange}
              otherStyle="mt-7"
            />
            {errors.childName ? (
              <Text className="text-red-500 mt-1">{errors.childName}</Text>
            ) : null}
            
            {/* Age Input */}
            <FormFields
              title="Age"
              placeholder="Enter your child age (1-99)"
              keyboardType="number-pad"
              secureTextEntry={false}
              value={form.age}
              handleChangeText={handleAgeChange}
              otherStyle="mt-7"
            />
            {errors.age ? (
              <Text className="text-red-500 mt-1">{errors.age}</Text>
            ) : null}

            {/* Condition Dropdown */}
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
                onChange={handleConditionChange}
                style={{
                  height: 48,
                  borderColor: errors.condition ? "#FF0000" : (isFocus ? "#0166FC" : "#A4A6A6"),
                  borderWidth: 2,
                  borderRadius: 4,
                  paddingHorizontal: 8,
                  justifyContent: "center",
                }}
                placeholderStyle={{
                  color: "#A4A6A6",
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                }}
                selectedTextStyle={{
                  color: "#000",
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                }}
              />
              {errors.condition ? (
                <Text className="text-red-500 mt-1">{errors.condition}</Text>
              ) : null}
            </View>

            {/* Submit Button */}
            <CustomButton
              handlePress={handleSubmit}
              title={loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                "Continue"
              )}
              textStyles="text-center text-white text-[14px] font-psemibold"
              container={`mt-7 w-full h-12 rounded-[4px] bg-[#0166FC] ${loading ? "opacity-70" : ""}`}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </View>
      <StatusBar backgroundColor="transparent" style="dark" />
    </SafeAreaView>
  );
};

export default childProfile;