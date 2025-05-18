// components/GoogleAuthButton.js
import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import CustomButton from './CustomButton';
 import useGoogleAuth from '../app/hooks/useGoogleAuth';
import useWarmUpBrowser from '../app/hooks/useWarmUpBrowser';
import icons from '../constants/icons';

const GoogleAuthButton = ({ 
  buttonText = "Continue with Google", 
  isSignUp = false,
  containerStyle = "mt-2 w-full h-12 rounded-[4px] bg-white border-2 border-black bg-transparent",
  textStyle = "text-center text-black-Default text-[14px] font-psemibold",
  iconSize = { width: 20, height: 20, marginRight: 10 }
}) => {
  // Warm up browser for OAuth
  useWarmUpBrowser();
  
  // Use our custom hook
  const { handleGoogleAuth, isLoading } = useGoogleAuth(isSignUp);
  
  return (
    <CustomButton
      handlePress={handleGoogleAuth}
      disabled={isLoading}
      title={
        isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <View className="flex-row items-center justify-center">
            <Image
              source={icons.google}
              style={iconSize}
            />
            <Text className={textStyle}>
              {buttonText}
            </Text>
          </View>
        )
      }
      container={containerStyle}
    />
  );
};

export default GoogleAuthButton;