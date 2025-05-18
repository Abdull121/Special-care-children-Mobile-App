
import 'dotenv/config'; // Import dotenv for environment variables
import { isConstructorDeclaration } from 'typescript';

export default {
  expo: {
    name: "special-care",
    slug: "special-care",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "specialcare",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.abdullahdev.specialcare", // Fixed "Package" key
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "We need your location to find nearby clinics"
      },
    },
    android: {
      "useNextNotificationsApi": true,
      "permissions": ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.abdullahdev.specialcare", // Moved package key to correct level
      "config": {
        "googleSignIn": {
          "apiKey": "AIzaSyBBeBYqvW-6nXKKmCULCWryT9lbOB3rtOA", // Android API key from Google Cloud Console
          "certificateHash": "BB:4F:83:C3:30:46:9F:FB:BA:58:B3:38:4F:B4:43:C4:47:63:C6:EF" // The SHA-1 hash 
        }
      }
      
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
  plugins: [
  "expo-router",

  [
    "expo-location",
    {
      locationAlwaysAndWhenInUsePermission: "Allow SpecialCare to use your location."
    }
  ],

  [
    "expo-image-picker",
    {
      photosPermission: "The app accesses your photos to let you share them with your friends."
    }
  ],

  [
    "expo-notifications",
    {
      icon: "./assets/images/children.png",
      color: "#0166FC"
    }
  ],

  [
    "expo-splash-screen",
    {
      image: "./assets/images/splash-icon.png",
      imageWidth: 200,
      resizeMode: "contain",
      backgroundColor: "#0166FC"
    }
  ],
  

  // [
  //   "expo-secure-store",
  //   {
  //     faceIDPermission: "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
  //   }
  // ],
  
  "expo-font",
  
  
],

    experiments: {
      typedRoutes: true,
    },
    extra: {
      APPWRITE_URL: process.env.APPWRITE_URL,
      APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
      APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID,
      PLATFORM: process.env.PLATFORM,
      OTP_COLLECTION_ID: process.env.OTP_COLLECTION_ID,
      FUNCTION_ID: "67ac9e42002dcfd0c35e", 
      USER_COLLECTION_ID: process.env.USER_COLLECTION_ID,
      CHILD_COLLECTION_ID: process.env.CHILD_COLLECTION_ID,
      SCHEDULE_COLLECTION_ID: process.env.SCHEDULE_COLLECTION_ID,
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
      PLACE_API: process.env.PLACE_API_KEY,
      CHILD_MODE_COLLECTION_ID: process.env.CHILD_MOOD_COLLECTION_ID,
      "eas": {
        "projectId": "5a0cff51-ca42-43b8-93da-1f263e1db50e"
      }

    },
  },
};
