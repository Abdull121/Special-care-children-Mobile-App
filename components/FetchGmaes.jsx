import { useEffect, useState } from 'react';
import config from "../Appwrite/config";

const useGamesFetcher = (numToShow = 3) => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await config.getGames();
      setGames(response.sort(() => Math.random() - 0.5).slice(0, numToShow));
    } catch (error) {
      console.error("Error fetching games:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshGames = () => {
    fetchGames();
  };

  return { games, isLoading, error, refreshGames };
};

export default useGamesFetcher;