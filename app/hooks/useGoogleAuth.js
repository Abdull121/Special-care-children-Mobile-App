// hooks/useGoogleAuth.js
import { useCallback, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useSSO } from '@clerk/clerk-expo';
import { useUser, useAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import authService from '../../Appwrite/auth';
import { useLoading } from '../../context/Loader';

export default function useGoogleAuth(redirectAfterSignup = false) {
  const { showLoading, hideLoading } = useLoading();
  const { startSSOFlow } = useSSO();
  const { user, isLoaded, isSignedIn } = useUser();
  const { sessionId } = useAuth();
  const { setUser, setIsLogged } = useGlobalContext();
  
  // Handle Google authentication
  const handleGoogleAuth = useCallback(async () => {
    try {
      // showLoading('Authenticating with Google...');
      // Clear any existing token first
      await SecureStore.deleteItemAsync('token');
      
      // Force browser session cooldown
      await WebBrowser.coolDownAsync();
      
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: Linking.createURL("/", { scheme: 'specialcare' }),
      });
  
      if (!createdSessionId) {
        // console.warn("SSO flow did not return a session ID.");
        Alert.alert("Login Failed", "Unable to create session. Please try again.");
        hideLoading();
        return;
      }
  
      if (!setActive) {
        // console.warn("Clerk did not return a setActive method.");
        Alert.alert("Login Error", "Session handler is not available.");
        hideLoading();
        return;
      }
  
      try {
        showLoading('Authenticating with Google...');
        await setActive({ session: createdSessionId });
        // console.log("Session successfully activated:", createdSessionId);
        
        // Wait a moment before proceeding to ensure session is fully established
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (activationError) {
        // console.error("Error activating session:", activationError);
        Alert.alert("Session Error", "Failed to activate your session.");
        hideLoading();
      }
    } catch (err) {
      // console.error("Google SSO error:", JSON.stringify(err, null, 2));
      const message = err?.errors?.[0]?.longMessage || "An unexpected error occurred.";
      Alert.alert("Authentication Failed", message);
      hideLoading();
      return null;
    }
  }, [startSSOFlow]);
  
  // Handle post-authentication actions
  useEffect(() => {
    const saveTokenAndNavigate = async () => {
      if (user?.id && isLoaded) {
        // console.log("Google login complete. User:",
        //   user.fullName,
        //   user.emailAddresses[0].emailAddress,
        //   user.id,
        // );
  
        try {
          showLoading('Authenticating with Google...');
          // Store token securely
          await SecureStore.setItemAsync('token', user.id);
          
          // Verify token was stored properly
          const token = await SecureStore.getItemAsync('token');
          // console.log('Saved token:', token);
          
          if (!token) {
            // console.error("Failed to save token!");
            Alert.alert("Login Error", "Failed to save authentication token.");
            hideLoading();
            return;
          }
          
          // Wait a moment to ensure token is available system-wide
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const result = await authService.getCurrentUser();
          if (result) {
            setUser(result);
            setIsLogged(true);
            // console.log("Logged in successfully, navigating to home");
            // showLoading('Loading your profile...');
            router.replace({
              pathname: '/home',
              reset: true
            });
          }
          else {
           // console.log("No user found, navigating to child profile setup");
            showLoading('Setting up your profile...');
            // Special handling for signup redirects if needed
            const destination = redirectAfterSignup ? '/childProfile' : '/childProfile';
            router.replace({
              pathname: destination,
              reset: true
            });
          }
        } catch (error) {
          //console.error("Error during token storage or user retrieval:", error);
          Alert.alert("Login Error", "There was a problem completing your login. Please try again.");
          hideLoading();
          return;
        }
        finally {
          hideLoading();
        }
      }
    };
  
    if (isSignedIn) {
      //console.log("User is signed in. Session ID:", sessionId);
      saveTokenAndNavigate();
    } else {
      // console.log("No active session.");
      return ; 
    }
  }, [user, isLoaded, isSignedIn, redirectAfterSignup, sessionId, setUser, setIsLogged]);
  
  return {
    handleGoogleAuth,
    isSignedIn,
    isLoading: !isLoaded
  };
}