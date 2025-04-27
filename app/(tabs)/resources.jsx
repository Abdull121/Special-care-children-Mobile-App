import React from "react";
import { View, Text, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import YouTubeCard from "../../components/YoutubeCard";
import DoctorCard from "../../components/DoctorCard";
import ResourcesCard from "../../components/ResourcesCard";
import useYouTubeVideoFetcher from "../../components/YoutubeVideos";
import useGamesFetcher from "../../components/FetchGmaes";
import useLocationServicesFetcher from "../../components/LocationServices";

const SEARCH_QUERY = "Parenting special needs children Urdu ";

const Resources = () => {
    const { videos, isLoading: videosLoading } = useYouTubeVideoFetcher(SEARCH_QUERY);
    const { games, isLoading: gamesLoading } = useGamesFetcher();
    const { 
        clinics, 
        schools, 
        isLoading: locationLoading, 
        locationGranted 
    } = useLocationServicesFetcher();

    // Check if any data is still loading
    const isLoading = videosLoading || gamesLoading || locationLoading;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingVertical: 40 }}>
            <FlatList
                data={[{ key: 'uniqueKey' }]} // Dummy data for FlatList
                showsVerticalScrollIndicator={false}
                renderItem={() => (
                    <View className="flex-1 px-3 pb-4 pt-2 bg-white">
                        <Text className="text-2xl font-bold mb-3 text-black">Resources</Text>
                        {isLoading ? (
                            <View className="flex items-center justify-center h-screen">
                                <ActivityIndicator size="large" color="blue" />
                            </View>
                        ) : (
                            <>
                                <Text className="text-blue-500 mb-3 mt-6">Recommended Videos</Text>
                                <FlatList 
                                    data={videos} 
                                    keyExtractor={(item) => item.id.videoId} 
                                    renderItem={({ item }) => <YouTubeCard video={item} />} 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false} 
                                />

                                <Text className="text-blue-500 my-3 mt-8">Recommended Doctors</Text>
                                <FlatList 
                                    data={clinics} 
                                    keyExtractor={(item) => item.id} 
                                    renderItem={({ item }) => <DoctorCard clinic={item} />} 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false} 
                                    contentContainerClassName="px-2" 
                                    ItemSeparatorComponent={() => <View style={{ width: 20 }} />} 
                                    ListEmptyComponent={
                                        <Text className="text-gray-500">
                                            {locationGranted ? "No clinics found nearby" : "Location access required"}
                                        </Text>
                                    } 
                                />

                                <Text className="text-blue-500 my-3 mt-8">Recommended Schools</Text>
                                <FlatList 
                                    data={schools} 
                                    keyExtractor={(item) => item.id} 
                                    renderItem={({ item }) => <DoctorCard clinic={item} />} 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false} 
                                    contentContainerClassName="px-2" 
                                    ItemSeparatorComponent={() => <View style={{ width: 20 }} />} 
                                    ListEmptyComponent={
                                        <Text className="text-gray-500">
                                            {locationGranted ? "No schools found nearby" : "Location access required"}
                                        </Text>
                                    } 
                                />

                                <View>
                                    <Text className="text-blue-500 my-3 mt-8">Recommended Games</Text>
                                    <FlatList 
                                        data={games} 
                                        keyExtractor={(item) => item.$id} 
                                        renderItem={({ item }) => <ResourcesCard resourcesSection={false} data={item} />} 
                                        horizontal 
                                        showsHorizontalScrollIndicator={false} 
                                        contentContainerClassName="px-2" 
                                        ItemSeparatorComponent={() => <View style={{ width: 20 }} />} 
                                        ListEmptyComponent={<Text className="text-gray-500">No games available</Text>} 
                                    />
                                </View>
                            </>
                        )}
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default Resources;