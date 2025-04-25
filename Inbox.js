import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';

const Inbox = () => {
  const palette = {
    LIGHT_BLUE: "#ADE1FB",
    MEDIUM_BLUE: "#266CA9", 
    DARK_BLUE: "#0F2573",
    DARKER_BLUE: "#041D56",
    DARKEST_BLUE: "#01082D"
  };

  const colors = {
    primary: palette.MEDIUM_BLUE,
    secondary: palette.DARK_BLUE,
    accent: palette.LIGHT_BLUE,
    dark: palette.DARKEST_BLUE,
    light: "#FFFFFF",
    background: "#FFFFFF",
  };

  const currentUser = 'You';
  const [chats, setChats] = useState([
      {
          id: 1,
          name: 'Client - Sarah Smith',
          avatar: 'https://i.pravatar.cc/150?img=5',
          lastMessage: 'Great job on the project!',
          lastMessageTime: 'Yesterday',
          messages: [
              { id: 1, sender: 'Sarah Smith', text: 'Looking forward to more work!', timestamp: 'Yesterday' },
              { id: 2, sender: 'You', text: 'Thank you for the feedback!', timestamp: 'Yesterday' },
          ],
      },
  ]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const selectChat = (chat) => {
      setSelectedChat(chat);
      setNewMessage('');
  };

  const sendMessage = () => {
      if (newMessage.trim() !== '') {
          const updatedChats = chats.map((chat) => {
              if (chat.id === selectedChat.id) {
                  return {
                      ...chat,
                      messages: [
                          ...chat.messages,
                          {
                              id: Date.now(),
                              sender: currentUser,
                              text: newMessage,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          },
                      ],
                      lastMessage: newMessage,
                      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  };
              }
              return chat;
          });
          setChats(updatedChats);
          setNewMessage('');
      }
  };

  return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.sidebar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.header, { color: colors.light }]}>Messages</Text>
              <FlatList
                  data={chats}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                      <TouchableOpacity
                          style={[styles.chatItem, selectedChat?.id === item.id && styles.chatItemSelected]}
                          onPress={() => selectChat(item)}
                      >
                          <Image source={{ uri: item.avatar }} style={styles.avatar} />
                          <View style={styles.chatInfo}>
                              <Text style={[styles.chatName, { color: colors.light }]}>{item.name}</Text>
                              <Text style={[styles.chatPreview, { color: colors.light }]}>{item.lastMessage}</Text>
                          </View>
                      </TouchableOpacity>
                  )}
              />
          </View>

          <View style={[styles.chatContent, { backgroundColor: colors.light }]}>
              {selectedChat ? (
                  <>
                      <View style={styles.chatHeader}>
                          <Image source={{ uri: selectedChat.avatar }} style={styles.headerAvatar} />
                          <Text style={[styles.headerName, { color: colors.dark }]}>{selectedChat.name}</Text>
                      </View>
                      <FlatList
                          data={selectedChat.messages}
                          keyExtractor={(item) => item.id.toString()}
                          style={styles.messagesContainer}
                          renderItem={({ item }) => (
                              <View
                                  style={[
                                      styles.messageBubble,
                                      item.sender === currentUser ? styles.sent : styles.received,
                                      { backgroundColor: item.sender === currentUser ? colors.primary : '#e0e0e0' },
                                  ]}
                              >
                                  <Text style={[styles.messageText, { color: colors.light }]}>{item.text}</Text>
                                  <Text style={styles.messageTime}>{item.timestamp}</Text>
                              </View>
                          )}
                      />
                      <View style={styles.inputContainer}>
                          <TextInput
                              style={[styles.input, { backgroundColor: '#e0e0e0', color: colors.dark }]}
                              placeholder="Type a message..."
                              value={newMessage}
                              onChangeText={setNewMessage}
                              onSubmitEditing={sendMessage}
                          />
                          <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.secondary }]} onPress={sendMessage}>
                              <Text style={styles.sendButtonText}>Send</Text>
                          </TouchableOpacity>
                      </View>
                  </>
              ) : (
                  <View style={styles.emptyChat}>
                      <Text style={[styles.emptyChatText, { color: colors.dark }]}>Select a conversation</Text>
                  </View>
              )}
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'row',
  },
  sidebar: {
      flex: 1,
      padding: 15,
      borderRightWidth: 1,
      borderRightColor: '#e0e0e0',
  },
  header: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
  },
  chatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
  },
  chatItemSelected: {
      backgroundColor: '#f0f0f0',
  },
  avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
  },
  chatInfo: {
      flex: 1,
  },
  chatName: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  chatPreview: {
      fontSize: 14,
  },
  chatContent: {
      flex: 2,
      padding: 15,
  },
  chatHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
      paddingBottom: 12,
  },
  headerAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
  },
  headerName: {
      fontSize: 20,
      fontWeight: 'bold',
  },
  messagesContainer: {
      flex: 1,
      marginBottom: 10,
  },
  messageBubble: {
      padding: 12,
      borderRadius: 15,
      marginBottom: 15,
      maxWidth: '80%',
  },
  sent: {
      alignSelf: 'flex-end',
  },
  received: {
      alignSelf: 'flex-start',
  },
  messageText: {
      fontSize: 16,
  },
  messageTime: {
      fontSize: 12,
      color: '#A3A3A3',
      textAlign: 'right',
      marginTop: 5,
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
  },
  input: {
      flex: 1,
      borderRadius: 25,
      paddingHorizontal: 18,
      fontSize: 16,
  },
  sendButton: {
      borderRadius: 25,
      marginLeft: 15,
      paddingHorizontal: 25,
      paddingVertical: 12,
  },
  sendButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
  },
  emptyChat: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  emptyChatText: {
      fontSize: 18,
  },
});

export default Inbox;
