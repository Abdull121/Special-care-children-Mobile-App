import { View, ActivityIndicator, Dimensions, Platform } from "react-native";

const Loader = ({ isLoading}) => {
  
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      className="absolute flex justify-center items-center w-full h-full bg-primary/60 z-10"
      style={{
        height: screenHeight,
      }}
    >
      <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size="small"
      />
    </View>
  );
};

export default Loader;