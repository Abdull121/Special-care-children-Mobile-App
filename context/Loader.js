// context/LoadingContext.js cretaed for loading screen for google Auth
import React, { createContext, useContext, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Modal, Text, Dimensions, Image } from 'react-native';

// Get the device screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  
  const showLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setLoading(true);
  };
  
  const hideLoading = () => {
    setLoading(false);
  };
  
  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
      <Modal visible={loading} transparent={false} animationType="fade">
        <View style={styles.fullScreenContainer}>
          {/* Your app logo */}
          <Image 
            source={require('../assets/images/children.png')}  // Update path to your logo
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.appTitle}>SPECIAL CARE</Text>
          
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0166FC" />
            <Text style={styles.loadingText}>{loadingMessage}</Text>
          </View>
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Use your app's background color
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0166FC', // Use your primary color
    marginBottom: 40,
    fontFamily: 'Poppins-Bold',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  }
});