import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Inbox = () => {
  const colors = {
    primary: '#0084FF',
    secondary: '#5AC8FA',
    background: '#F0F1F2',
    white: '#FFFFFF',
    black: '#1C1C1E',
    gray: '#8E8E93',
    lightGray: '#E5E5EA',
    messageSent: '#0084FF',
    messageReceived: '#E4E6EB',
    online: '#4CD964',
    inputBackground: '#F2F2F2',
  };

  const currentUser = {
    id: 'user1',
    name: 'You',
    avatar: 'https://i.pravatar.cc/150?img=1'
  };

  const [chats, setChats] = useState([
    {
      id: '1',
      name: 'Sarah Smith',
      avatar: 'https://i.pravatar.cc/150?img=5',
      lastMessage: 'Looking forward to more work!',
      lastMessageTime: '10:30 AM',
      unread: 2,
      isOnline: true,
      messages: [
        { id: '1', sender: 'Sarah Smith', text: 'Hi there!', time: '10:20 AM' },
        { id: '2', sender: 'You', text: 'Hello Sarah!', time: '10:25 AM' },
        { id: '3', sender: 'Sarah Smith', text: 'Looking forward to more work!', time: '10:30 AM' },
      ],
    },
    {
      id: '2',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=10',
      lastMessage: 'Can we meet tomorrow?',
      lastMessageTime: 'Yesterday',
      unread: 0,
      isOnline: false,
      messages: [
        { id: '1', sender: 'John Doe', text: 'Hello!', time: 'Yesterday' },
        { id: '2', sender: 'You', text: 'Hi John!', time: 'Yesterday' },
        { id: '3', sender: 'John Doe', text: 'Can we meet tomorrow?', time: 'Yesterday' },
      ],
    },
    {
      id: '3',
      name: 'Emily Johnson',
      avatar: 'https://i.pravatar.cc/150?img=15',
      lastMessage: 'Thanks for your help!',
      lastMessageTime: 'Monday',
      unread: 0,
      isOnline: true,
      messages: [
        { id: '1', sender: 'Emily Johnson', text: 'Hey!', time: 'Monday' },
        { id: '2', sender: 'You', text: 'Hi Emily!', time: 'Monday' },
        { id: '3', sender: 'Emily Johnson', text: 'Thanks for your help!', time: 'Monday' },
      ],
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showChatList, setShowChatList] = useState(true);
  const flatListRef = useRef();

  useEffect(() => {
    if (selectedChat && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [selectedChat?.messages]);

  const selectChat = (chat) => {
    // Mark as read
    const updatedChats = chats.map(c => {
      if (c.id === chat.id) {
        return { ...c, unread: 0 };
      }
      return c;
    });
    setChats(updatedChats);
    setSelectedChat({ ...chat, unread: 0 });
    setShowChatList(false);
    setNewMessage('');
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        const newMsg = {
          id: Date.now().toString(),
          sender: currentUser.name,
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessage: newMessage,
          lastMessageTime: 'Just now',
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setSelectedChat(prev => ({
      ...prev,
      messages: [...prev.messages, {
        id: Date.now().toString(),
        sender: currentUser.name,
        text: newMessage,
        time: 'Just now',
      }],
      lastMessage: newMessage,
      lastMessageTime: 'Just now',
    }));
    setNewMessage('');
  };

  const goBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {showChatList ? (
        <View style={styles.chatListContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chats</Text>
            <TouchableOpacity style={styles.newChatButton}>
              <Text style={styles.newChatButtonText}>✏️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={colors.gray}
            />
          </View>

          <FlatList
            data={chats}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chatItem}
                onPress={() => selectChat(item)}
              >
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  {item.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                
                <View style={styles.chatInfo}>
                  <View style={styles.chatInfoTop}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatTime}>{item.lastMessageTime}</Text>
                  </View>
                  <View style={styles.chatInfoBottom}>
                    <Text 
                      style={[
                        styles.lastMessage,
                        item.unread > 0 && styles.unreadMessage
                      ]}
                      numberOfLines={1}
                    >
                      {item.lastMessage}
                    </Text>
                    {item.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={goBackToList} style={styles.backButton}>
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
            
            <View style={styles.chatHeaderUser}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: selectedChat.avatar }} style={styles.chatAvatar} />
                {selectedChat.isOnline && <View style={styles.onlineIndicator} />}
              </View>
              <Text style={styles.chatHeaderName}>{selectedChat.name}</Text>
            </View>
            
            <TouchableOpacity style={styles.chatHeaderButton}>
              <Text style={styles.chatHeaderButtonText}>⋮</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={selectedChat.messages}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesContainer}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item.sender === currentUser.name ? styles.sentContainer : styles.receivedContainer,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === currentUser.name 
                      ? { backgroundColor: colors.messageSent } 
                      : { backgroundColor: colors.messageReceived },
                  ]}
                >
                  <Text 
                    style={[
                      styles.messageText,
                      item.sender === currentUser.name 
                        ? { color: colors.white } 
                        : { color: colors.black },
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text 
                    style={[
                      styles.messageTime,
                      item.sender === currentUser.name 
                        ? { color: colors.white } 
                        : { color: colors.gray },
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
              </View>
            )}
          />

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Text style={styles.attachmentButtonText}>+</Text>
            </TouchableOpacity>
            
            <TextInput
              style={styles.messageInput}
              placeholder="Message"
              placeholderTextColor={colors.gray}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Text style={[
                styles.sendButtonText,
                { color: newMessage.trim() ? colors.primary : colors.gray }
              ]}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatListContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  newChatButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatButtonText: {
    fontSize: 20,
  },
  searchContainer: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  searchInput: {
    height: 36,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatInfoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  chatTime: {
    fontSize: 13,
    color: '#8E8E93',
  },
  chatInfoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 15,
    color: '#8E8E93',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: '#000000',
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#0084FF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 24,
  },
  chatHeaderUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 12,
  },
  chatHeaderButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderButtonText: {
    fontSize: 20,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: '80%',
  },
  sentContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  attachmentButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  attachmentButtonText: {
    fontSize: 20,
    color: '#000000',
  },
  messageInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Inbox;