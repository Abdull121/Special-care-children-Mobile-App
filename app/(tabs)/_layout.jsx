import { StatusBar } from "expo-status-bar";
import { Tabs, usePathname } from "expo-router";
import { Image, Text, View, TouchableOpacity, Alert, BackHandler } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';

import icons from "../../constants/icons";
import { ActivityIndicator } from "react-native-web";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2 pt-10 min-w-20">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-8 h-8"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const pathname = usePathname();

  // Handle back button press to exit app
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        // Only show exit dialog when on the main tab screens
        if (pathname.includes('/home') || 
            pathname.includes('/community') || 
            pathname.includes('/resources') || 
            pathname.includes('/schedule')) {
              
          Alert.alert('Exit App', 'Are you sure you want to exit?', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            { text: 'Exit', onPress: () => BackHandler.exitApp() },
          ]);
          return true; // Prevents default back navigation
        }
        return false; // Let system handle back on other screens
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove(); // Clean up the event listener
    }, [pathname])
  );

  return (
    <>
      {false ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0166FC" />
        </View>
      ) : (
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#0166FC",
            tabBarInactiveTintColor: "#CDCDE0",
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
              position: 'absolute',
              backgroundColor: "#FFFFFF",
              borderTopColor: "#232533",
              elevation: 1,
              zIndex: 1,
              opacity: 1,
              height: 74,
              borderTopWidth: 1,
            }
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              headerShown: false,
              tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={0.9} />,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.Home}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              ),
            }}
          />
          {/* Other tab screens remain unchanged */}
          <Tabs.Screen
            name="community"
            options={{
              title: "Community",
              headerShown: false,
              tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={0.9} />,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.profile}
                  color={color}
                  name="Community"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="resources"
            options={{
              title: "Resources",
              headerShown: false,
              tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={0.9} />,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.resources}
                  color={color}
                  name="Resources"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="schedule"
            options={{
              title: "Schedule",
              headerShown: false,
              tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={0.9} />,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.task}
                  color={color}
                  name="schedule"
                  focused={focused}
                />
              ),
            }}
          />
        </Tabs>
      )}

      <StatusBar backgroundColor="#FFF" style="dark" />
    </>
  );
};

export default TabLayout;