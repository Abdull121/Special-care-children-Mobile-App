import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import tw from "twrnc"; // Import TWRNC

const CustomButton = ({
  title,
  handlePress,
  container,
  textStyles,
  isLoading,
  testID,
}) => {
  // console.log(isLoading);
  return (
    <TouchableOpacity
     testID={testID}
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        tw`  min-h-[42px] flex flex-row justify-center items-center ${container} ${
          isLoading ? "opacity-50" : ""
        }`,
        // Apply opacity when loading

        // Additional styles passed as a prop
      ]}
      disabled={isLoading}
    >
      <Text className={`${textStyles}`}>{title}</Text>

      {/* {isLoading && (
        <ActivityIndicator
          style={tw`ml-2`}
          animating={isLoading}
          color="#0000ff"
          size="small"
        />
      )} */}
    </TouchableOpacity>
  );
};

export default CustomButton;
