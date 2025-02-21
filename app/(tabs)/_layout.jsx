import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

import  icons  from "../../constants/icons";
// import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { ActivityIndicator } from "react-native-web";

const TabIcon = ({ icon, color, name, focused }) => {
  // console.log(icon.eyehide,)
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
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/login" />;

  return (
    <>

  {loading ? (
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
          // Initial values
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
        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            headerShown: false,
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
      

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#FFF" style="dark" />
    </>
  );
};

export default TabLayout;