import { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.YOUTUBE_API_KEY;

const useYouTubeVideoFetcher = (searchQuery = "Parenting special needs children", maxResults = 10, numToShow = 3) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if we have an API key
    if (API_KEY) {
      fetchYouTubeVideos();
    } else {
      console.error("YouTube API key not found");
      setIsLoading(false);
      setError("API key not configured");
    }
  }, [searchQuery]);

  const fetchYouTubeVideos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch video list
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${searchQuery}&type=video&key=${API_KEY}`
      );
      
      if (!response.data || !response.data.items) {
        throw new Error("Invalid response from YouTube API");
      }
      
      const shuffledVideos = [...response.data.items]
        .sort(() => Math.random() - 0.5)
        .slice(0, numToShow);
      
      // Early return if we got no videos
      if (shuffledVideos.length === 0) {
        setVideos([]);
        setIsLoading(false);
        return;
      }
      
      // Get video IDs for additional details
      const videoIds = shuffledVideos.map(item => item.id?.videoId).filter(Boolean).join(",");
      
      if (videoIds.length > 0) {
        // Get additional video details including duration
        try {
          const detailsResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
          );
          
          if (detailsResponse.data && detailsResponse.data.items) {
            // Map details to the videos
            const videosWithDetails = shuffledVideos.map(video => {
              const details = detailsResponse.data.items.find(
                item => item.id === video.id?.videoId
              );
              
              return {
                ...video,
                statistics: details?.statistics || { viewCount: "0" },
                contentDetails: details?.contentDetails || { duration: "PT5M" }
              };
            });
            
            setVideos(videosWithDetails);
          } else {
            setVideos(shuffledVideos);
          }
        } catch (detailsError) {
          console.error("Error fetching video details:", detailsError);
          setVideos(shuffledVideos);
        }
      } else {
        setVideos(shuffledVideos);
      }
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshVideos = () => {
    fetchYouTubeVideos();
  };

  return { 
    videos, 
    isLoading, 
    error, 
    refreshVideos 
  };
};

export default useYouTubeVideoFetcher;