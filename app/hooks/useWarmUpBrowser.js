import React,{useEffect} from 'react'
import * as WebBrowser from 'expo-web-browser'

const useWarmUpBrowser = () => {
  useEffect(() => {
    
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

export default useWarmUpBrowser

