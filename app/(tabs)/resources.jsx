import React, { useRef, useState } from "react"; 
import { View, Text, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import YouTubeCard from "../../components/YoutubeCard";
import DoctorCard from "../../components/DoctorCard";
import ResourcesCard from "../../components/ResourcesCard";
import useYouTubeVideoFetcher from "../../components/YoutubeVideos";
import useGamesFetcher from "../../components/FetchGmaes";
import useLocationServicesFetcher from "../../components/LocationServices";
import { useGlobalContext } from "../../context/GlobalProvider";
//keyword:"Parenting special needs children Urdu"




const Resources = () => {
    const { user, } = useGlobalContext();

  //get videos
  const SEARCH_QUERY = user?.primaryCondition 
  ? `Parenting children with ${user.primaryCondition} special needs in Urdu`
  : 'Parenting children with special needs in Urdu';
    
const gameListRef = useRef(null);
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



 const handleGameScroll = (event) => {
  const offsetX = event.nativeEvent.contentOffset.x;
  const index = Math.round(offsetX / 340); // 320 card + 20 spacing
  
};


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
                                    onScroll={handleGameScroll}
                                    scrollEventThrottle={16}
                                    snapToInterval={320}
                                    decelerationRate="fast"
                                    snapToAlignment="start"
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
                                    onScroll={handleGameScroll}
                                    scrollEventThrottle={16}
                                    snapToInterval={340}
                                    decelerationRate="fast"
                                    snapToAlignment="start"
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
                                    onScroll={handleGameScroll}
                                    scrollEventThrottle={16}
                                    snapToInterval={340}
                                    decelerationRate="fast"
                                    snapToAlignment="start"
                                />

                                <View>
                                <Text className="text-blue-500 my-3 mt-8">Recommended Games</Text>

                                <FlatList
                                    ref={gameListRef}
                                    data={games}
                                    keyExtractor={(item) => item.$id}
                                    renderItem={({ item }) => (
                                    <ResourcesCard resourcesSection={false} data={item} />
                                    )}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingHorizontal: 8 }}
                                    ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                                    ListEmptyComponent={<Text className="text-gray-500">No games available</Text>}
                                    onScroll={handleGameScroll}
                                    scrollEventThrottle={16}
                                    snapToInterval={340}
                                    decelerationRate="fast"
                                    snapToAlignment="start"
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