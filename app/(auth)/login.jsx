import { ScrollView, Text, View, Image, ActivityIndicator, Alert, } from "react-native";
import React, { useState} from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import FormFields from "../../components/FormFields";
import { Link, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import authService from "../../Appwrite/auth";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import { useGlobalContext } from "../../context/GlobalProvider";


const login = () => {
  
  const { setUser, setIsLogged } = useGlobalContext();
  
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // State to manage the loading state


  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8; 
  };

  const handleSubmit = async () => {
    setErrors("")

    setLoading(true);

    const { email, password } = form;
    let isValid = true;

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

    //auth service

    try {
      const session = await authService.login(form);
      if (session) {
        const result = await authService.getCurrentUser();
        setUser(result);
        setIsLogged(true);
        console.log("Logged in successfully");
        router.replace('/home')
      } else {
        console.log("No session");
      }
    } catch (error) {
      Alert.alert(
        "Incorrect",
        error.message || "Something went wrong. Please try again.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      console.log("Login error:", error);
    }
    finally {
      setLoading(false); // Reset loading state after completion
    }
  };

 
  

  return (
    <SafeAreaView className="h-full px-4 bg-white">
      <ScrollView>
        <View className="w-full justify-center mt-6 min-h-[85vh]">
          <Text className="font-heading text-primary text-[34px] mb-[35px] text-center">
            SPECIAL CARE
          </Text>
          <View>
            <Text className="font-psemibold text-[24px]">Started Now</Text>
            <Text className="font-pregular text-gary-Default">
              Welcome! Select method to login
            </Text>
          </View>
          <FormFields
            title="Email"
            placeholder="Enter your email address"
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
          <View className="mt-4 mr-1 flex-row justify-end">
            <Link href="/resetPassword" className="text-blue-Default underline">
              Forgot Password?
            </Link>
          </View>
          <CustomButton
            handlePress={handleSubmit}
            title={loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              "Login"
            )}
            textStyles="text-center text-white text-[14px] font-psemibold"
            container={`mt-7 w-full h-12 rounded-[4px] bg-[#0166FC] ${loading ? "opacity-50" : ""}`}
            disabled={loading} // Disable the button during loading
          />
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-4 text-[#A4A6A6]">OR</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>


          {/* Use the new GoogleAuthButton component */}
          
          <GoogleAuthButton 
            buttonText="Login with Google"
            isSignUp={false}
          />


          <View className="mt-6 flex-row justify-center">
            <Text className="text-black-Default text-[14px] font-pregular">
              Don't have an account?{" "}
            </Text>
            <Link href="/signUp" className="text-blue-Default ">
              Sign Up Now
            </Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="transparent" style="dark" />
    </SafeAreaView>
  );
};

export default login;