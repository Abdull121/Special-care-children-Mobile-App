import { View, Text, SafeAreaView, FlatList, ActivityIndicator } from 'react-native'
import React,{useCallback} from 'react'
import CommunityCard from '../../components/CommunityCard'
import config from '../../Appwrite/config'
import { useFocusEffect } from '@react-navigation/native';


const community = () => {

  const [posts, setPosts] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  useFocusEffect(
    useCallback(() => {
      // fetch latest profile or posts from Appwrite
      fetchPostData();
    }, [])
  );

  const shufflePosts = (array) => {
    return array.map((value) => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)
    
  }


  const fetchPostData = async () => {
     setLoading(true);
    const getPost = await config.getPosts() // Fetch posts from Appwrite
    //console.log(getPost, "getPost")

    const shuffle = shufflePosts(getPost) // Shuffle the posts
    //console.log(shuffle, "shuffle")
    setPosts(shuffle)
    setLoading(false)
  }




  return (
   <SafeAreaView className="flex-1 bg-white px-3 pt-10 mb-16">
     {loading ? (<View className="flex items-center justify-center h-screen">
                  <ActivityIndicator size="large" color="blue" />
              </View>):
              (<View className="flex-1 bg-white mb-5">
     <Text className="text-2xl font-bold my-6 text-black">Community</Text>
     <FlatList
        data={posts} 
        keyExtractor={(item) => item.$id}
        renderItem={(data) => (
          <View className="flex-1 px-3 mb-6 pt-2 bg-white">
            <CommunityCard
              CommunitySection={false}
              data={data.item} // Pass the item to the CommunityCard component
             />
          </View>
        )}
        showsVerticalScrollIndicator={false}
     />
     
      
    </View>)}
   </SafeAreaView>
  )
}

export default community