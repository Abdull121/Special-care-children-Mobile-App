import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import * as Location from 'expo-location';
import axios from "axios";
import YouTubeCard from "../../components/YoutubeCard";
import DoctorCard from "../../components/DoctorCard";
import uuid from 'react-native-uuid';
import Constants from 'expo-constants';
import ResourcesCard from "../../components/ResourcesCard";
import config from "../../Appwrite/config";

const API_KEY = Constants.expoConfig.extra.YOUTUBE_API_KEY;
const place_API = Constants.expoConfig.extra.PLACE_API;
const SEARCH_QUERY = "Parenting special needs children Urdu ";

const Resources = () => {
    const [videos, setVideos] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [school, setSchool] = useState([]);
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchYouTubeVideos(),
                requestLocationPermission(),
                fetchGames(),
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const requestLocationPermission = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            await Promise.all([
                fetchNearbyClinics(location.coords.latitude, location.coords.longitude),
                fetchNearbySchool(location.coords.latitude, location.coords.longitude),
            ]);
        } catch (error) {
            console.error('Location error:', error);
        }
    };

    const fetchNearbyClinics = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=doctor&keyword=special care children&key=${place_API}`
            );
            const clinicsData = response.data.results.map((element) => {
                let name = element.name || "Child Specialist Clinic";
                let address = element.vicinity;
                let rating = element.rating;
                let lat = element.geometry?.location?.lat;
                let lon = element.geometry?.location?.lng;
                let id = uuid.v4();
                let openHours = element.opening_hours?.open_now;
                return { name, address, lat, lon, rating, id, openHours };
            });
            setClinics(clinicsData.sort(() => Math.random() - 0.5).slice(0, 3));
        } catch (error) {
            console.error('Clinic search error:', error);
        }
    };

    const fetchNearbySchool = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=school&keyword=special care children&key=${place_API}`
            );
            const schoolData = response.data.results.map((element) => {
                let name = element.name || "Child Specialist Clinic";
                let address = element.vicinity;
                let rating = element.rating;
                let lat = element.geometry?.location?.lat;
                let lon = element.geometry?.location?.lng;
                let id = uuid.v4();
                let openHours = element.opening_hours?.open_now;
                return { name, address, lat, lon, rating, id, openHours };
            });
            setSchool(schoolData.sort(() => Math.random() - 0.5).slice(0, 3));
        } catch (error) {
            console.error('School search error:', error);
        }
    };

    const fetchYouTubeVideos = async () => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${SEARCH_QUERY}&type=video&key=${API_KEY}`
            );
            const shuffledVideos = response.data.items.sort(() => Math.random() - 0.5).slice(0, 3);
            const videoIds = shuffledVideos.map((item) => item.id.videoId).join(",");
            const detailsResponse = await axios.get(
                `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`
            );
            const videosWithViews = shuffledVideos.map((item, index) => ({
                ...item,
                statistics: detailsResponse.data.items[index]?.statistics || { viewCount: "0" },
            }));
            setVideos(videosWithViews);
        } catch (error) {
            console.error("Error fetching YouTube videos:", error);
        }
    };

    const fetchGames = async () => {
        try {
            const response = await config.getGames();
            setGames(response.sort(() => Math.random() - 0.5).slice(0, 3));
        } catch (error) {
            console.log(error);
        }
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
                                <FlatList data={videos} keyExtractor={(item) => item.id.videoId} renderItem={({ item }) => <YouTubeCard video={item} />} horizontal showsHorizontalScrollIndicator={false} />

                                <Text className="text-blue-500 my-3 mt-8">Recommended Doctors</Text>
                                <FlatList data={clinics} keyExtractor={(item) => item.id} renderItem={({ item }) => <DoctorCard clinic={item} />} horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-2" ItemSeparatorComponent={() => <View style={{ width: 20 }} />} ListEmptyComponent={<Text className="text-gray-500">No clinics found nearby</Text>} />

                                <Text className="text-blue-500 my-3 mt-8">Recommended Schools</Text>
                                <FlatList data={school} keyExtractor={(item) => item.id} renderItem={({ item }) => <DoctorCard clinic={item} />} horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-2" ItemSeparatorComponent={() => <View style={{ width: 20 }} />} ListEmptyComponent={<Text className="text-gray-500">No school found nearby</Text>} />

                                <View>
                                    <Text className="text-blue-500 my-3 mt-8">Recommended Games</Text>
                                    <FlatList data={games} keyExtractor={(item) => item.$id} renderItem={({ item }) => <ResourcesCard resourcesSection={false} data={item} />} horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-2" ItemSeparatorComponent={() => <View style={{ width: 20 }} />} ListEmptyComponent={<Text className="text-gray-500">No games available</Text>} />
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