import { Client, Databases, ID, Functions, Query, Account, Users } from "react-native-appwrite";
import Constants from 'expo-constants';

// Shared configuration
const appwriteConfig = {
    appwriteUrl: Constants.expoConfig.extra.APPWRITE_URL,
    appwriteProjectId: Constants.expoConfig.extra.APPWRITE_PROJECT_ID,
    appwriteDatabaseId: Constants.expoConfig.extra.APPWRITE_DATABASE_ID,
    appwriteCollectionId: Constants.expoConfig.extra.OTP_COLLECTION_ID,
    appwriteFunctionId: Constants.expoConfig.extra.FUNCTION_ID, // Now it matches


   
};


// Initialize client once
const client = new Client()
    .setEndpoint(appwriteConfig.appwriteUrl)
    .setProject(appwriteConfig.appwriteProjectId);

const databases = new Databases(client);
const functions = new Functions(client);

// const account = new Account(client);
// const users = new Users(client);




// Send OTP

const sendOTP = async (email) => {
    console.log(email)
    console.log(appwriteConfig.appwriteFunctionId)
    try {
        // Generate a 5-digit OTP
        const otp = Math.floor(10000 + Math.random() * 90000).toString();
       

        console.log(otp)

        // Save OTP to Appwrite Database
       const insert =  await databases.createDocument(
            appwriteConfig.appwriteDatabaseId,
            appwriteConfig.appwriteCollectionId,
            ID.unique(),
            { 
                email, 
                otp, 
                expiresAt: new Date(Date.now() + 5 * 60000).toISOString() 
            }
        );

        if(insert){
            // Send OTP via email using Appwrite Functions
            console.log("data inserted..")
            console.log("data", insert)
           
            
        await functions.createExecution(
            "67ac9e42002dcfd0c35e",
            JSON.stringify({ email, otp })
        );

        return { success: true, message: "OTP sent to email!" };

        

        }
        else{
            console.log("error for creating document")

        }

        
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { success: false, message: error.message };
    }
};

//verify OTP

const verifyOTP = async (enteredOTP) => {
    const newOtp = enteredOTP.toString();
    console.log("opt is: ", newOtp)
    try {
        console.log("finding otp...")
      const response = await databases.listDocuments(
        appwriteConfig.appwriteDatabaseId,
        appwriteConfig.appwriteCollectionId,
        [Query.equal("otp", newOtp)]  // Find by OTP value
      );

      console.log("Response from Appwrite OTP: ", response);
      
  
      if (response.documents.length === 0) {
        console.log("OTP not found.")
        return { success: false, message: "OTP not found." };
        
      }
  
      const { email, otp, expiresAt } = response.documents[0];
  
      if (new Date() > new Date(expiresAt)) {
        console.log("OTP expired.")
        return { success: false, message: "OTP expired." };
      }
  
      if (otp !== newOtp) {
        console.log("Invalid OTP.")
        return { success: false, message: "Invalid OTP." };
      }
      console.log("opt verified")
      return { success: true, message: `OTP verified! Email: ${email}` }; // Return the email
    } catch (error) {
        console.log(error)
      return { success: false, message: error.message };
    }
  };




/// verify email

const checkEmail = async (email) => {
  try {
    const response = await functions.createExecution(
      "67ad0d93001a158f8e25",
      JSON.stringify({ email })
    );

    if (response) {
      const result = JSON.parse(response.responseBody);

      if (result.success) {
        if (result.exists) {
          console.log(" Email found:", email)
          return { success: true, message: "Email found" };
        } else {
          console.log(" Email is not found:", email);
          return { success: false, message: "Email found" };
          
        }
        
      } else {
        console.error("Unexpected response:", result);
        return { success: false, message: "Unexpected response format" };
      }
    }

  } catch (error) {
    console.error("Error in checkEmail:", error);
    return { success: false, message: error.message };
  }
};


//reset password
const resetPassword = async (email, newPassword) => {
  console.log("email:", email, "newPassword:", newPassword);
  try {
      const response = await functions.createExecution(
          "67ad271600140f806142", 
          JSON.stringify({ email, newPassword }),
          // false 
      );

      if (response) {
          const result = JSON.parse(response.responseBody);

          if (result.success) {
              console.log(" Password reset successfully:")
              return { success: true, message: result.message };
          } else {
              console.log(" Error:", result.message);
              return { success: false, message: "password should be at least 8 character" };
          }

          // return result;
      }
  } catch (error) {
      console.error(" Error in resetPassword:", error);
      return { success: false, message: error.message };
  }
}


export { sendOTP,verifyOTP, checkEmail, resetPassword};