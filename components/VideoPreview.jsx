import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import * as Linking from 'expo-linking';

const YouTubeVideoPreview = ({ video, onViewAll }) => {
  // Extract video details (with fallbacks)
  const videoId = video?.id?.videoId;
  const title = video?.snippet?.title || "Understanding ADHD Therapy";

  // Format duration (simplified)
  const formatDuration = () => {
    // Safely access contentDetails with fallback
    const duration = video?.contentDetails?.duration || "PT5M";
    return duration
      .replace('PT', '')
      .replace('H', ' hr ')
      .replace('M', ' min ')
      .replace('S', ' sec')
      || '5 min watch';
  };

  // Simple function to open the video or fallback to view all
  const openVideo =  () => {
    if (videoId) {
      
        const youtubeAppUrl = `vnd.youtube://${videoId}`;
        const youtubeWebUrl = `https://www.youtube.com/watch?v=${videoId}`;
        Linking.openURL(youtubeAppUrl).catch(() => Linking.openURL(youtubeWebUrl));
       
      
      
    } else {
      // No videoId, just call onViewAll
      console.log("Video ID not found, calling onViewAll");
      onViewAll && onViewAll();
    }
  };

  return (
    <TouchableOpacity 
      className="bg-gray-200 p-4 rounded-xl flex-row items-center mt-4"
      onPress={openVideo}
    >
      <FontAwesome name="play-circle" size={24} color="black" />
      <View className="ml-3 flex-1">
        <Text className="text-gray-600 text-sm">{formatDuration()}</Text>
        <Text className="text-lg font-bold " numberOfLines={1}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onViewAll}>
        <Text className="text-blue-600 font-bold mb-6">View All</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default YouTubeVideoPreview;