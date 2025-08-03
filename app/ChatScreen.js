// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   FlatList, 
//   StyleSheet, 
//   KeyboardAvoidingView, 
//   Platform, 
//   Image, 
//   Animated, 
//   Dimensions,
//   SafeAreaView
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Dialogflow_V2 } from 'react-native-dialogflow';
// import dialogflowConfig from '../config/dialogflow-credentials.json';

// Dialogflow_V2.setConfiguration(
//   dialogflowConfig.client_email,
//   dialogflowConfig.private_key,
//   Dialogflow_V2.LANG_ENGLISH_US,
//   dialogflowConfig.project_id
// );

// const { width } = Dimensions.get('window');

// // Message component to handle animations individually
// const MessageItem = ({ item }) => {
//   const messageAnimation = useRef(new Animated.Value(item.isNew ? 0 : 1)).current;
  
//   useEffect(() => {
//     if (item.isNew) {
//       Animated.timing(messageAnimation, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [item.isNew, messageAnimation]);

//   return (
//     <Animated.View
//       style={[
//         { 
//           opacity: messageAnimation,
//           transform: [{ 
//             translateY: messageAnimation.interpolate({
//               inputRange: [0, 1],
//               outputRange: [50, 0]
//             }) 
//           }]
//         }
//       ]}
//     >
//       <View
//         style={[
//           styles.messageBubble,
//           item.sender === 'user' ? styles.userBubble : styles.botBubble,
//         ]}
//       >
//         {item.sender === 'bot' && (
//           <View style={styles.botAvatarContainer}>
//             <Image 
//                source={require('../assets/images/bot-avatar.jpg')} 
//               style={styles.botAvatar}
//               // defaultSource={require('../assets/bot-avatar-placeholder.png')}
//             />
//           </View>
//         )}
//         <View style={styles.messageContent}>
//           <Text style={[
//             styles.messageText,
//             item.sender === 'user' ? styles.userMessageText : styles.botMessageText,
//           ]}>
//             {item.text}
//           </Text>
//           <Text style={styles.timestamp}>{item.timestamp}</Text>
//         </View>
//       </View>
//     </Animated.View>
//   );
// };

// const ChatScreen = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const welcomeAnimation = useRef(new Animated.Value(0)).current;
//   const chatInputAnimation = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef(null);

//   useEffect(() => {
//     // Welcome animation
//     Animated.sequence([
//       Animated.timing(welcomeAnimation, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.delay(2000),
//       Animated.timing(welcomeAnimation, {
//         toValue: 0,
//         duration: 500,
//         useNativeDriver: true,
//       })
//     ]).start(() => {
//       setShowWelcome(false);
//       // Add initial welcome message from bot
//       const welcomeMessage = {
//         id: Date.now().toString() + '_bot',
//         text: "Welcome to Special Care! I'm here to assist you with your healthcare needs. How can I help you today?",
//         sender: 'bot',
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         isNew: true
//       };
//       setMessages([welcomeMessage]);
      
//       // Animate chat input
//       Animated.timing(chatInputAnimation, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();
//     });
//   }, []);

//   const sendMessage = (text) => {
//     if (!text.trim()) return;

//     const userMessage = {
//       id: Date.now().toString(),
//       text,
//       sender: 'user',
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       isNew: true
//     };

//     setMessages((prev) => [userMessage, ...prev]);
//     setInput('');
//     setIsTyping(true);

//     Dialogflow_V2.requestQuery(
//       text,
//       (result) => {
//         console.log('Dialogflow Full Response:', JSON.stringify(result, null, 2));
//         setIsTyping(false);

//         const reply = result.queryResult?.fulfillmentText || JSON.stringify(result);
//         const botMessage = {
//           id: Date.now().toString() + '_bot',
//           text: reply || 'Sorry, I didnt understand that.',
//           sender: 'bot',
//           timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           isNew: true
//         };
//         setMessages((prev) => [botMessage, ...prev]);
//       },
//       (error) => {
//         console.error('Dialogflow Error:', JSON.stringify(error, null, 2));
//         setIsTyping(false);
        
//         const botMessage = {
//           id: Date.now().toString() + '_bot',
//           text: 'I apologize, but I seem to be having some technical difficulties. Please try again in a moment.',
//           sender: 'bot',
//           timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           isNew: true
//         };
//         setMessages((prev) => [botMessage, ...prev]);
//       }
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Special Care</Text>
//           <Text style={styles.headerSubtitle}>Your Health Assistant</Text>
//         </View>

//         {showWelcome ? (
//           <Animated.View style={[
//             styles.welcomeContainer,
//             { opacity: welcomeAnimation }
//           ]}>
//             <Image 
//               source={require('../assets/images/children.png')} 
//               style={styles.welcomeLogo}
//               resizeMode="contain"
//             />
//             <Text style={styles.welcomeText}>Welcome to Special Care</Text>
//             <Text style={styles.welcomeSubtext}>Your personal healthcare assistant</Text>
//           </Animated.View>
//         ) : (
//           <>
//             <FlatList
//               ref={flatListRef}
//               data={messages}
//               renderItem={({ item }) => <MessageItem item={item} />}
//               keyExtractor={(item) => item.id}
//               inverted
//               contentContainerStyle={styles.messageList}
//               showsVerticalScrollIndicator={false}
//             />

//             {isTyping && (
//               <View style={styles.typingIndicator}>
//                 <View style={styles.botAvatarContainer}>
//                   <Image 
//                     source={require('../assets/images/bot-avatar.jpg')} 
//                     style={styles.botAvatar}
//                   />
//                 </View>
//                 <View style={styles.typingBubble}>
//                   <View style={styles.typingDots}>
//                     <View style={[styles.typingDot, styles.typingDot1]} />
//                     <View style={[styles.typingDot, styles.typingDot2]} />
//                     <View style={[styles.typingDot, styles.typingDot3]} />
//                   </View>
//                 </View>
//               </View>
//             )}

//             <Animated.View 
//               style={[
//                 styles.inputContainerWrapper,
//                 {
//                   transform: [{
//                     translateY: chatInputAnimation.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [100, 0]
//                     })
//                   }]
//                 }
//               ]}
//             >
//               <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//                 style={styles.keyboardAvoid}
//               >
//                 <View style={styles.inputContainer}>
//                   <TextInput
//                     placeholder="Type your message..."
//                     value={input}
//                     onChangeText={setInput}
//                     style={styles.input}
//                     placeholderTextColor="#8F8F8F"
//                     multiline
//                     maxHeight={100}
//                   />
//                   <TouchableOpacity 
//                     onPress={() => sendMessage(input)} 
//                     style={styles.sendButton}
//                     disabled={!input.trim()}
//                   >
//                     <Ionicons name="send" size={22} color="#FFFFFF" />
//                   </TouchableOpacity>
//                 </View>
//               </KeyboardAvoidingView>
//             </Animated.View>
//           </>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ChatScreen;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   container: {
//     flex: 1,
//     marginTop: 30,
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     backgroundColor: '#1E88E5',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#E3F2FD',
//     marginTop: 3,
//   },
//   welcomeContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   welcomeLogo: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   welcomeText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1E88E5',
//     marginBottom: 10,
//   },
//   welcomeSubtext: {
//     fontSize: 16,
//     color: '#757575',
//   },
//   messageList: {
//     padding: 10,
//     paddingBottom: 16,
//   },
//   messageBubble: {
//     marginVertical: 5,
//     borderRadius: 18,
//     maxWidth: '80%',
//     flexDirection: 'row',
//     overflow: 'hidden',
//   },
//   userBubble: {
//     backgroundColor: '#1E88E5',
//     alignSelf: 'flex-end',
//     marginLeft: 50,
//     borderTopRightRadius: 4,
//   },
//   botBubble: {
//     backgroundColor: '#F5F7FB',
//     alignSelf: 'flex-start',
//     marginRight: 50,
//     borderTopLeftRadius: 4,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   botAvatarContainer: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//     alignSelf: 'flex-end',
//     marginBottom: 4,
//   },
//   botAvatar: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//   },
//   messageContent: {
//     padding: 12,
//     flex: 1,
//   },
//   messageText: {
//     fontSize: 16,
//     lineHeight: 22,
//   },
//   userMessageText: {
//     color: '#FFFFFF',
//   },
//   botMessageText: {
//     color: '#333333',
//   },
//   timestamp: {
//     fontSize: 11,
//     marginTop: 4,
//     alignSelf: 'flex-end',
//     color: '#FFFFFFAA',
//   },
//   typingIndicator: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     marginHorizontal: 16,
//     marginVertical: 8,
//   },
//   typingBubble: {
//     backgroundColor: '#F5F7FB',
//     borderRadius: 18,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   typingDots: {
//     flexDirection: 'row',
//     width: 40,
//     height: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   typingDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: '#90A4AE',
//     marginHorizontal: 2,
//   },
//   typingDot1: {
//     opacity: 0.6,
//     transform: [{ scale: 0.8 }],
//   },
//   typingDot2: {
//     opacity: 0.8,
//     transform: [{ scale: 1 }],
//   },
//   typingDot3: {
//     opacity: 0.6,
//     transform: [{ scale: 0.8 }],
//   },
//   keyboardAvoid: {
//     width: '100%',
//   },
//   inputContainerWrapper: {
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderColor: '#E0E0E0',
//     paddingVertical: 8,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 8,
//     paddingHorizontal: 16,
//     alignItems: 'flex-end',
//   },
//   input: {
//     flex: 1,
//     borderRadius: 24,
//     borderColor: '#E0E0E0',
//     borderWidth: 1,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     paddingRight: 40,
//     marginRight: 8,
//     fontSize: 16,
//     backgroundColor: '#F5F7FB',
//     maxHeight: 120,
//   },
//   sendButton: {
//     backgroundColor: '#1E88E5',
//     borderRadius: 50,
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#1976D2',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 2,
//   },
// });




import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Image, 
  Animated, 
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

// Message component to handle animations individually
const MessageItem = ({ item }) => {
  const messageAnimation = useRef(new Animated.Value(item.isNew ? 0 : 1)).current;
  
  useEffect(() => {
    if (item.isNew) {
      Animated.timing(messageAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [item.isNew, messageAnimation]);

  return (
    <Animated.View
      style={[
        { 
          opacity: messageAnimation,
          transform: [{ 
            translateY: messageAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            }) 
          }]
        }
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.botBubble,
        ]}
      >
        {item.sender === 'bot' && (
          <View style={styles.botAvatarContainer}>
            <Image 
               source={require('../assets/images/bot-avatar.jpg')} 
              style={styles.botAvatar}
              // defaultSource={require('../assets/bot-avatar-placeholder.png')}
            />
          </View>
        )}
        <View style={styles.messageContent}>
          <Text style={[
            styles.messageText,
            item.sender === 'user' ? styles.userMessageText : styles.botMessageText,
          ]}>
            {item.text}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const welcomeAnimation = useRef(new Animated.Value(0)).current;
  const chatInputAnimation = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    // Welcome animation
    Animated.sequence([
      Animated.timing(welcomeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(welcomeAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowWelcome(false);
      // Add initial welcome message from bot
      const welcomeMessage = {
        id: Date.now().toString() + '_bot',
        text: "Welcome to Special Care! I'm here to assist you with your healthcare needs. How can I help you today?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: true
      };
      setMessages([welcomeMessage]);
      
      // Animate chat input
      Animated.timing(chatInputAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isNew: true
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://dialogflow-api-flax.vercel.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      console.log('Backend Response:', data);
      setIsTyping(false);

      const reply = data.reply || 'Sorry, I didn\'t understand that.';
      const botMessage = {
        id: Date.now().toString() + '_bot',
        text: reply,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: true
      };
      setMessages((prev) => [botMessage, ...prev]);
    } catch (error) {
      console.error('Backend Error:', error);
      setIsTyping(false);
      const botMessage = {
        id: Date.now().toString() + '_bot',
        text: 'I apologize, but I seem to be having some technical difficulties. Please try again in a moment.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: true
      };
      setMessages((prev) => [botMessage, ...prev]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Special Care</Text>
          <Text style={styles.headerSubtitle}>Your Health Assistant</Text>
        </View>

        {showWelcome ? (
          <Animated.View style={[
            styles.welcomeContainer,
            { opacity: welcomeAnimation }
          ]}>
            <Image 
              source={require('../assets/images/children.png')} 
              style={styles.welcomeLogo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Welcome to Special Care</Text>
            <Text style={styles.welcomeSubtext}>Your personal healthcare assistant</Text>
          </Animated.View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={({ item }) => <MessageItem item={item} />}
              keyExtractor={(item) => item.id}
              inverted
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
            />

            {isTyping && (
              <View style={styles.typingIndicator}>
                <View style={styles.botAvatarContainer}>
                  <Image 
                    source={require('../assets/images/bot-avatar.jpg')} 
                    style={styles.botAvatar}
                  />
                </View>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDots}>
                    <View style={[styles.typingDot, styles.typingDot1]} />
                    <View style={[styles.typingDot, styles.typingDot2]} />
                    <View style={[styles.typingDot, styles.typingDot3]} />
                  </View>
                </View>
              </View>
            )}

            <Animated.View 
              style={[
                styles.inputContainerWrapper,
                {
                  transform: [{
                    translateY: chatInputAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0]
                    })
                  }]
                }
              ]}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoid}
              >
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Type your message..."
                    value={input}
                    onChangeText={setInput}
                    style={styles.input}
                    placeholderTextColor="#8F8F8F"
                    multiline
                    maxHeight={100}
                  />
                  <TouchableOpacity 
                    onPress={() => sendMessage(input)} 
                    style={styles.sendButton}
                    disabled={!input.trim()}
                  >
                    <Ionicons name="send" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Animated.View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#1E88E5',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 3,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  welcomeLogo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 10,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#757575',
  },
  messageList: {
    padding: 10,
    paddingBottom: 16,
  },
  messageBubble: {
    marginVertical: 5,
    borderRadius: 18,
    maxWidth: '80%',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  userBubble: {
    backgroundColor: '#1E88E5',
    alignSelf: 'flex-end',
    marginLeft: 50,
    borderTopRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#F5F7FB',
    alignSelf: 'flex-start',
    marginRight: 50,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  botAvatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  messageContent: {
    padding: 12,
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#333333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
    color: '#FFFFFFAA',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  typingBubble: {
    backgroundColor: '#F5F7FB',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  typingDots: {
    flexDirection: 'row',
    width: 40,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#90A4AE',
    marginHorizontal: 2,
  },
  typingDot1: {
    opacity: 0.6,
    transform: [{ scale: 0.8 }],
  },
  typingDot2: {
    opacity: 0.8,
    transform: [{ scale: 1 }],
  },
  typingDot3: {
    opacity: 0.6,
    transform: [{ scale: 0.8 }],
  },
  keyboardAvoid: {
    width: '100%',
  },
  inputContainerWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderRadius: 24,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 40,
    marginRight: 8,
    fontSize: 16,
    backgroundColor: '#F5F7FB',
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
});