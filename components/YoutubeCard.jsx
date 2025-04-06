import React from "react";
import { View, Text, Image, TouchableOpacity , Dimensions} from "react-native";
import * as Linking from "expo-linking";

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;
const YouTubeCard = ({ video }) => {
  const openYouTube = (videoId) => {
    const youtubeAppUrl = `vnd.youtube://${videoId}`;
    const youtubeWebUrl = `https://www.youtube.com/watch?v=${videoId}`;

    Linking.openURL(youtubeAppUrl).catch(() => Linking.openURL(youtubeWebUrl));
  };

  return (
    <TouchableOpacity
    activeOpacity={0.9}
      onPress={() => openYouTube(video.id.videoId)}
      className="border border-blue-500 rounded-xl p-3 mx-2 bg-white shadow-lg"
      style={{ width: cardWidth, height: cardWidth * 0.8 }}
    >
      <Image
        source={{ uri: video.snippet.thumbnails.high.url }}
        className="rounded-lg"
        style={{ width: '100%', height: cardWidth * 0.5  }}
        resizeMode="cover"
      />
      <View className="mt-2">
        <Text className="text-lg font-semibold text-black" numberOfLines={2} ellipsizeMode="tail">
          {video.snippet.title}
        </Text>
        <View className="flex-row items-center mt-1 gap-3">
        <Text className="text-gray-500 text-sm my-2" numberOfLines={1}>
          {video.snippet.channelTitle}
        </Text>
        <Text className="text-primary text-xs">{video.statistics?.viewCount} views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default YouTubeCard;