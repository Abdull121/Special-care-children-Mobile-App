// import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
// import React, { useState } from "react";
// import FormFields from "../../components/FormFields";
// import CustomButton from "../../components/CustomButton";
// import { router } from "expo-router";
//  import { sendOTP } from "../../Appwrite/forgetPassword";

// import { checkEmail} from "../../Appwrite/forgetPassword";

// import { useEmail } from "../../context/EmailContext"; // Import the hook






// const ResetPassword = () => {
//   const { setGetEmail } = useEmail(); // Get the function from context
//   const [form, setForm] = useState({
//     email: "",
//   });
//   // console.log(form.email);

//   const handleResetPassword = async () => {

  
//     try{

//       const verifyEmail = await checkEmail(form.email);
//       if(verifyEmail){
//         console.log("email is exist...")
//         setGetEmail(form.email); // Set the email to context
        


//         const response = await sendOTP(form.email);
//         console.log(response)
//       if(response.success){
//         console.log("Otp sent successfully")
//         router.push("/verifyCode");
//       }else{
//         Alert.alert("Error", response.message);
//       }
        
//       }
//       else if(!verifyEmail.exists){
//         Alert.alert("Error", "Email is not found");
//         return;
//       }
      
//     }catch{
//       console.log(error)
//       Alert.alert(error.message || "An error occurred");
//     }
//   }

  

 

//   return (
//     <SafeAreaView className="bg-white">
//       <ScrollView contentContainerStyle={{ height: "100%" }}>
//         <View className="w-full px-6 min-h-[75vh] items-start justify-center ">
//           <Text className="font-psemibold text-blue-Default text-[20px]">
//             Forget Password
//           </Text>
//           <Text className="font-pregular text-gary-Default">
//             Please enter your email to reset the password
//           </Text>
//           <FormFields
//             title="Email"
//             placeholder="Enter your email address"
//             keyboardType="email-address"
//             secureTextEntry={false}
//             value={form.email}
//             handleChangeText={(e) => setForm({ ...form, email: e })}
//             otherStyle="mt-7"
//           />
//           <CustomButton
//             handlePress={handleResetPassword}
//             title="Reset Password"
//             textStyles="text-center text-white text-[14px] font-psemibold "
//             container="mt-7 w-full h-12 rounded-[4px] bg-[#0166FC]"
//             isLoading={form.email === "" ? true : false}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default ResetPassword;


import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import FormFields from "../../components/FormFields";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { sendOTP, checkEmail } from "../../Appwrite/forgetPassword";
import { useEmail } from "../../context/EmailContext";

const ResetPassword = () => {
  const { setEmail } = useEmail();
  const [form, setForm] = useState({
    email: "",
    loading: false // Added loading state
  });

  const handleResetPassword = async () => {
    if (!form.email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      setForm(prev => ({ ...prev, loading: true }));
      console.log(form.email)
      
      // 1. Check if email exists
    await checkEmail(form.email);
     
      

      // 2. Store email in context
      const getEmail= setEmail(form.email);
      console.log("Email verified and stored in context");
      console.log(getEmail);

      // 3. Send OTP
      const response = await sendOTP(form.email);
      console.log("OTP Response:", response);

      if (response.success) {
        router.push("/verifyCode");
      } else {
        Alert.alert("Error", response.message || "Failed to send OTP");
      }
    } catch (error) { // Fixed error parameter
      console.log("Error:", error);
      Alert.alert("Error", error.message || "An error occurred");
    } finally {
      setForm(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <SafeAreaView className="bg-white">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full px-6 min-h-[75vh] items-start justify-center">
          <Text className="font-psemibold text-blue-Default text-[20px]">
            Forget Password
          </Text>
          <Text className="font-pregular text-gary-Default">
            Please enter your email to reset the password
          </Text>
          
          <FormFields
            title="Email"
            placeholder="Enter your email address"
            keyboardType="email-address"
            value={form.email}
            handleChangeText={(e) => setForm(prev => ({ ...prev, email: e }))}
            otherStyle="mt-7"
          />

          <CustomButton
            handlePress={handleResetPassword}
            title="Reset Password"
            textStyles="text-center text-white text-[14px] font-psemibold"
            container="mt-7 w-full h-12 rounded-[4px] bg-[#0166FC]"
            isLoading={form.loading} // Use proper loading state
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;
