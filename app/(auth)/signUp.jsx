import { ScrollView, Text, View, Image, Alert, ActivityIndicator } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import FormFields from "../../components/FormFields";
import { useState } from "react";
import { Link, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import authService from '../../Appwrite/auth';
import { useGlobalContext } from "../../context/GlobalProvider";
import GoogleAuthButton from "../../components/GoogleAuthButton";




const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();


  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // State to manage the loading state


  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8; // Example: Minimum 8 characters
  };
  const validateUserName = (username) => {
    return (username ? true : false)
  };



  const handleSubmit = async () => {
    setErrors("")

    setLoading(true);
    const { name, email, password } = form;
    let isValid = true;


    if (!validateUserName(name)) {
      setLoading(false);
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      isValid = false;
    }
    else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }


    if (!validateEmail(email)) {
      setLoading(false);
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }

    if (!validatePassword(password)) {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters long",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
    if (!isValid) return;

    // auth service


    try {
      console.log(form)
      const response = await authService.createAccount(form);
      if (response) {
        setUser(response);
        setIsLogged(true);
        console.log("Account created successfully", response)
        router.replace('/childProfile')

      }
      else {
        console.log("failed")
      }

    }


    catch (error) {
      Alert.alert(
        "Incorrect",
        error.message || "Something went wrong. Please try again.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      console.log(error)
    }
    finally {
      setLoading(false); // Reset loading state after completion
    }


  };
  return (
    <SafeAreaView className="h-full px-4 py-2 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      // Disable horizontal scroll indicator
      >

        <View className="w-full justify-center mt-6 min-h-[85vh]">
          <Text className="font-heading text-primary text-[34px] mb-[35px] text-center">
            SPECIAL CARE
          </Text>
          <View>
            <Text className="font-psemibold text-[24px]">Create Account</Text>
            <Text className="font-pregular text-gary-Default">
              Welcome! select method to Sign Up
            </Text>
          </View>
          <FormFields
            title="Full Name"
            placeholder="Enter your name"
            keyboardType="default"
            secureTextEntry={false}
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyle="mt-7"
          />
          {errors.name ? (
            <Text className="text-red-500 mt-1">{errors.name}</Text>
          ) : null}

          <FormFields
            title="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            secureTextEntry={false}
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyle="mt-7"
          />
          {errors.email ? (
            <Text className="text-red-500 mt-1">{errors.email}</Text>
          ) : null}

          <FormFields
            title="Password"
            placeholder="Enter your password"
            secureTextEntry={true}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyle="mt-7"
          />
          {errors.password ? (
            <Text className="text-red-500 mt-1">{errors.password}</Text>
          ) : null}

          <CustomButton
            handlePress={handleSubmit}
            title={loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              "Sign Up"
            )}
            textStyles="text-center text-white text-[14px] font-psemibold "
            container="mt-7 w-full h-12 rounded-[4px] bg-[#0166FC]"
          />

          <View className="flex-row items-center my-6">
            {/* Left line */}
            <View className="flex-1 h-[1px] bg-gray-300" />
            {/* Center text */}
            <Text className="mx-4 text-[#A4A6A6]">OR</Text>
            {/* Right line */}

            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>


          {/* Use the new GoogleAuthButton component */}
          
          <GoogleAuthButton 
            buttonText="Sign Up with Google"
            isSignUp={false}
          />

          <View className="mt-6 flex-row justify-center">
            <Text className="text-black-Default text-[14px] font-pregular">
              Already Have an account? {""}
            </Text>
            <Link href="/login" className="text-blue-Default ">
              Login Now
            </Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="transparent" style="dark" />
    </SafeAreaView>
  );
};

export default SignUp;
