import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Inbox = () => {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setConversations([
        {
          id: 1,
          name: 'Asma Loussaif',
          lastMessage: 'Hey, how are you doing?',
          lastTime: '10:30 AM',
          unread: true,
          avatar: 'AS'
        },
        {
          id: 2,
          name: 'Haythem Mansouri',
          lastMessage: 'About the project deadline...',
          lastTime: 'Yesterday',
          unread: false,
          avatar: 'HM'
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages([
      {
        id: 1,
        text: 'Hey there!',
        time: '10:00 AM',
        sender: 'them'
      },
      {
        id: 2,
        text: 'How are you doing?',
        time: '10:02 AM',
        sender: 'them'
      },
      {
        id: 3,
        text: "I'm good, thanks! How about you?",
        time: '10:05 AM',
        sender: 'me'
      },
      {
        id: 4,
        text: 'Pretty good. Working on that project we discussed.',
        time: '10:30 AM',
        sender: 'them'
      },
    ]);
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me'
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.conversationItem, 
        selectedConversation?.id === item.id && styles.selectedConversation
      ]}
      onPress={() => selectConversation(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      <View style={styles.conversationDetails}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.conversationTime}>{item.lastTime}</Text>
        </View>
        <Text 
          style={[
            styles.lastMessage,
            item.unread && styles.unreadMessage
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View 
      style={[
        styles.messageContainer,
        item.sender === 'me' ? styles.sentMessage : styles.receivedMessage
      ]}
    >
      <View 
        style={[
          styles.messageBubble,
          item.sender === 'me' ? styles.sentBubble : styles.receivedBubble
        ]}
      >
        <Text style={item.sender === 'me' ? styles.sentText : styles.receivedText}>
          {item.text}
        </Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {selectedConversation ? (
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedConversation(null)}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.chatUserInfo}>
              <View style={styles.chatAvatar}>
                <Text style={styles.chatAvatarText}>{selectedConversation.avatar}</Text>
              </View>
              <View>
                <Text style={styles.chatUserName}>{selectedConversation.name}</Text>
                <Text style={styles.chatUserStatus}>Online</Text>
              </View>
            </View>
          </View>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.messagesList}
            inverted
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              onSubmitEditing={sendMessage}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#4682B4" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#4682B4" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Messages</Text>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4682B4" />
            </View>
          ) : (
            <FlatList
              data={conversations}
              renderItem={renderConversationItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.conversationList}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
    inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 8,
  backgroundColor: '#F0F8FF',
  borderTopWidth: 1,
  borderTopColor: '#D1E6FF',
  position: 'absolute', // Permet de déplacer manuellement
  bottom: Platform.OS === 'ios' ? 16 : 8, // Ajustement pour éviter d'être trop bas
  left: 0,
  right: 0,
},

  header: {
    backgroundColor: '#0F2573',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  newChatButton: {
    padding: 4,
  },
  conversationList: {
    paddingBottom: 16,
    backgroundColor: '#F0F8FF',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#5A99D3',
  },
  selectedConversation: {
    backgroundColor: '#D6E8FF',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0F2573',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  conversationDetails: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A4D8F',
  },
  conversationTime: {
    fontSize: 12,
    color: '#4B74A6',
  },
  lastMessage: {
    fontSize: 14,
    color: '#4B74A6',
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#1A4D8F',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
  flex: 1,
  backgroundColor: '#F0F8FF',
  paddingBottom: 0, // Réduire les marges pour ne pas pousser le champ
},
  chatHeader: {
    backgroundColor: '#0F2573',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 12,
  },
  chatUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4B74A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatUserName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  chatUserStatus: {
    color: '#D1DFF4',
    fontSize: 12,
  },
  messagesList: {
    padding: 16,
    paddingTop: 0,
  },
  messageContainer: {
    marginBottom: 8,
    width: '100%',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
  },
  sentMessage: {
    alignItems: 'flex-end',
  },
  receivedMessage: {
    alignItems: 'flex-start',
  },
  sentBubble: {
    backgroundColor: '#5A99D3',
    borderBottomRightRadius: 0,
  },
  receivedBubble: {
    backgroundColor: '#E3F2FF',
    borderBottomLeftRadius: 0,
  },
  sentText: {
    color: 'white',
    fontSize: 16,
  },
  receivedText: {
    color: '#333',
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: '#BFD4EB',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F0F8FF',
    borderTopWidth: 1,
    borderTopColor: '#D1E6FF',
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#D1E6FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    fontSize: 16,
  },
  attachmentButton: {
    padding: 8,
  },
  sendButton: {
    padding: 8,
  },
});



export default Inbox;
