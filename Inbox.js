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
  Image,
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

  // Mock data - replace with your API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConversations([
        {
          id: 1,
          name: 'John Doe',
          lastMessage: 'Hey, how are you doing?',
          lastTime: '10:30 AM',
          unread: true,
          avatar: 'JD'
        },
        {
          id: 2,
          name: 'Jane Smith',
          lastMessage: 'About the project deadline...',
          lastTime: 'Yesterday',
          unread: false,
          avatar: 'JS'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          lastMessage: 'The documents are ready',
          lastTime: 'Monday',
          unread: false,
          avatar: 'MJ'
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Simulate loading messages
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
      <StatusBar barStyle="light-content" />
      
      {selectedConversation ? (
        // Chat View
        <View style={styles.chatContainer}>
          {/* Chat Header */}
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
            <View style={{ width: 24 }} /> {/* For balance */}
          </View>

          {/* Messages */}
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.messagesList}
            inverted
          />

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="attach" size={24} color="#5e548e" />
            </TouchableOpacity>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              onSubmitEditing={sendMessage}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#5e548e" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Conversations List
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Messages</Text>
            <TouchableOpacity style={styles.newChatButton}>
              <Ionicons name="add" size={24} color="#5e548e" />
            </TouchableOpacity>
          </View>

          {/* Conversations List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5e548e" />
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
    backgroundColor: '#0F2573',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0F2573',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  newChatButton: {
    padding: 4,
  },
  conversationList: {
    paddingBottom: 16,
  backgroundColor: '#fff',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  selectedConversation: {
    backgroundColor: '#f5f7fb',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5e548e',
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
  },
  conversationTime: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  chatHeader: {
    backgroundColor: '#0F2573',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    width: '100%',
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
    backgroundColor: '#5e548e',
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
    color: '#ccc',
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
    backgroundColor: '#5e548e',
    borderBottomRightRadius: 0,
  },
  receivedBubble: {
    backgroundColor: 'white',
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
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e4e8',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f0f2f5',
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