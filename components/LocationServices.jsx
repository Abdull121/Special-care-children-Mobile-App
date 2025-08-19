import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';
import uuid from 'react-native-uuid';
import Constants from 'expo-constants';
import { useGlobalContext } from "../context/GlobalProvider"

// const place_API = Constants.expoConfig?.extra?.PLACE_API;
const place_API = process.env.PLACE_API || Constants.expoConfig?.extra?.PLACE_API;


const useLocationServicesFetcher = (numToShow = 3) => {
  const { user, } = useGlobalContext();
  
    //get Doctor Location Search Query
    const doctorQuery = user?.primaryCondition 
    ? `special care ${user.primaryCondition} children Doctor `
    : 'special care children Doctor';
    //get Schools Location Search Query
    const schoolsQuery = 'special needs school for children in Pakistan';

  const [clinics, setClinics] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationGranted(false);
        setError('Permission to access location was denied');
        setIsLoading(false);
        return;
      }
      
      setLocationGranted(true);
      let location = await Location.getCurrentPositionAsync({});
      
      await Promise.all([
        fetchNearbyClinics(location.coords.latitude, location.coords.longitude),
        fetchNearbySchools(location.coords.latitude, location.coords.longitude)
      ]);
    } catch (error) {
      console.error('Location error:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNearbyClinics = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=doctor&keyword=${doctorQuery}&key=${place_API}`
      );
      
      const clinicsData = response.data.results.map((element) => {
        let name = element.name || "Child Specialist Autism Clinic";
        let address = element.vicinity;
        let rating = element.rating;
        let lat = element.geometry?.location?.lat;
        let lon = element.geometry?.location?.lng;
        let id = uuid.v4();
        let openHours = element.opening_hours?.open_now;
        return { name, address, lat, lon, rating, id, openHours };
      });
      
      setClinics(clinicsData.sort(() => Math.random() - 0.5).slice(0, numToShow));
    } catch (error) {
      console.error('Clinic search error:', error);
    }
  };

        const fetchNearbySchools = async (lat, lon) => {
          try {
              const response = await axios.get(
                  `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=15000&type=school&keyword=${schoolsQuery}&key=${place_API}`
              );
              const schoolData = response.data.results.map((element) => {
                  let name = element.name || "Child Specialist School";
                  let address = element.vicinity;
                  let rating = element.rating;
                  let lat = element.geometry?.location?.lat;
                  let lon = element.geometry?.location?.lng;
                  let id = uuid.v4();
                  let openHours = element.opening_hours?.open_now;
                  return { name, address, lat, lon, rating, id, openHours };
              });
              setSchools(schoolData.sort(() => Math.random() - 0.5).slice(0, 3));
          } catch (error) {
              console.error('School search error:', error);
          }
      };

  const refreshServices = () => {
    if (locationGranted) {
      requestLocationPermission();
    }
  };

  return { 
    clinics, 
    schools, 
    isLoading, 
    error, 
    locationGranted,
    refreshServices 
  };
};

export default useLocationServicesFetcher;