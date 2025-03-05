// AIzaSyBBeBYqvW-6nXKKmCULCWryT9lbOB3rtOA
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, ScrollView, } from "react-native";
import * as Location from 'expo-location';
import axios from "axios";
import YouTubeCard from "../../components/YoutubeCard";
import DoctorCard from "../../components/DoctorCard";
import uuid from 'react-native-uuid';
import Constants from 'expo-constants'

const API_KEY = Constants.expoConfig.extra.YOUTUBE_API_KEY;
const place_API= Constants.expoConfig.extra.PLACE_API;
const SEARCH_QUERY = "Parenting special needs children Urdu";

const Resources = () => {
 
  const [videos, setVideos] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [school, setSchool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    fetchYouTubeVideos();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchNearbyClinics(location.coords.latitude, location.coords.longitude);
      fetchNearbySchool(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Location error:', error);
    } 
  };

  const fetchNearbyClinics = async (lat, lon) => {
    try {
      

    const response = await axios.get(
      `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=doctor&keyword=special care children&key=${place_API}`
    );

      
      //console.log('Overpass Response:', response.data.results);
  
      // Process the response
      const clinicsData = response.data.results.map((element) => {
        // console.log('Element:', element, index);
        
        let name = element.name ||  "Child Specialist Clinic";
        let address = element.vicinity
        let rating = element.rating
        let lat = element.geometry?.location?.lat
        let lon = element.geometry?.location?.lng
        let id = uuid.v4(); // Generates a unique ID
        let openHours= element.opening_hours?.open_now;
  
        return { name, address, lat, lon,rating, id, openHours};
      });

    //console.log('Processed Clinics:', clinicsData);

    const filteredClinics= clinicsData.sort(() => Math.random() - 0.5).slice(0, 3);
    //console.log(filteredClinics)
      

  
       setClinics(filteredClinics);
      // console.log('Final Clinics:', clinicsData);
    } catch (error) {
      console.error('Clinic search error:', error);
     
      
    }
    finally {
      setLocationLoading(false);
    }
  };


  const fetchNearbySchool = async (lat, lon) => {
    try {
      

    const response = await axios.get(
      `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=school&keyword=special care children&key=${place_API}`
    );

      
      console.log('school results:', response);
  
      // Process the response
      const schoolData = response.data.results.map((element) => {
        // console.log('Element:', element, index);
        
        let name = element.name ||  "Child Specialist Clinic";
        let address = element.vicinity
        let rating = element.rating
        let lat = element.geometry?.location?.lat
        let lon = element.geometry?.location?.lng
        let id = uuid.v4(); // Generates a unique ID
        let openHours= element.opening_hours?.open_now;
  
        return { name, address, lat, lon,rating, id, openHours};
      });

    console.log('Processed School:', schoolData);

    const filteredSchool= schoolData.sort(() => Math.random() - 0.5).slice(0, 3);
    
        setSchool(filteredSchool);
      // console.log('Final Clinics:', clinicsData);
    } catch (error) {
      console.error('Clinic search error:', error);
     
      
    }
    finally {
      setLocationLoading(false);
    }
  };


  const fetchYouTubeVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${SEARCH_QUERY}&type=video&key=${API_KEY}`
      );

      // Shuffle and select 3 random videos
      const shuffledVideos = response.data.items.sort(() => Math.random() - 0.5).slice(0, 3);
      const videoIds = shuffledVideos.map((item) => item.id.videoId).join(",");

      // Fetch video statistics (views count)
      const detailsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`
      );
      //console.log(detailsResponse)
      const videosWithViews = shuffledVideos.map((item, index) => ({
        ...item,
        statistics: detailsResponse.data.items[index]?.statistics || { viewCount: "0" },
      }));

      setVideos(videosWithViews);
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingVertical: 40 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
        // style={{ borderBlockColor: "blue", borderWidth: 1,  }}
         className="flex-1 px-3 pb-16 bg-white">
          <Text className="text-2xl font-bold mb-3 text-black">Resources</Text>
          <Text className="text-blue-500 mb-3">Recommended Videos</Text>

          {loading ? (
            <View className="flex items-center justify-center h-40">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <FlatList
              data={videos}
              keyExtractor={(item) => item.id.videoId}
              renderItem={({ item }) => <YouTubeCard video={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}

            />
          )}

          <Text className="text-blue-500 my-3">Recommended Doctors</Text>
          
          {locationLoading && clinics ? (
            <View className="flex items-center justify-center h-40">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <FlatList
              data={clinics}
              keyExtractor={(item,) => item.id}
              renderItem={({ item }) => <DoctorCard clinic={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-2"
              ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
              ListEmptyComponent={
                <Text className="text-gray-500">No clinics found nearby</Text>
              }
            />
          )}

          <Text className="text-blue-500 my-3">Recommended Schools</Text>
          
          {locationLoading && clinics ? (
            <View className="flex items-center justify-center h-40">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <FlatList
              data={school}
              keyExtractor={(item,) => item.id}
              renderItem={({ item }) => <DoctorCard clinic={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-2"
              ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
              ListEmptyComponent={
                <Text className="text-gray-500">No school found nearby</Text>
              }
            />
          )}


        </View>
       
      </ScrollView>
    </SafeAreaView>
  );
};

export default Resources;
