

// {
//   "expo": {
//     "name": "special-care",
//       "slug": "special-care",
//         "version": "1.0.0",
//           "orientation": "portrait",
//             "icon": "./assets/images/icon.png",
//               "scheme": "myapp",
//                 "userInterfaceStyle": "automatic",
//                   "newArchEnabled": true,
//                     "ios": {
//       "supportsTablet": true,
//         "Package": "com.abdullahdev.specialcare",
//     },
//     "android": {
//       "adaptiveIcon": {
//         "foregroundImage": "./assets/images/adaptive-icon.png",
//           "backgroundColor": "#ffffff",
//             "package": "com.abdullahdev.specialcare"
//       }
//     },
//     "web": {
//       "bundler": "metro",
//         "output": "static",
//           "favicon": "./assets/images/favicon.png"
//     },
//     "plugins": [
//       "expo-router",
//       [
//         "expo-splash-screen",
//         {
//           "image": "./assets/images/splash-icon.png",
//           "imageWidth": 200,
//           "resizeMode": "contain",
//           "backgroundColor": "#ffffff"
//         }
//       ],
//       "expo-font"
//     ],
//       "experiments": {
//       "typedRoutes": true
//     },
//     extra: {
//       APPWRITE_URL: process.env.API_URL

//     }
//   }
// }
import 'dotenv/config'; // Import dotenv for environment variables

export default {
  expo: {
    name: "special-care",
    slug: "special-care",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "specialcare",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.abdullahdev.specialcare", // Fixed "Package" key
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.abdullahdev.specialcare", // Moved package key to correct level
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
    
      [
        "expo-splash-screen",
        
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],

      // [
      //   "expo-secure-store",
      //   {
      //     "faceIDPermission": "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
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
      "eas": {
        "projectId": "5a0cff51-ca42-43b8-93da-1f263e1db50e"
      }

    },
  },
};
