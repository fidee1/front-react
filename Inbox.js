import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Button,
} from 'react-native';
import { Avatar, FAB, Chip } from 'react-native-paper';

const Inbox = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      subject: 'Réunion de projet',
      preview: 'Bonjour, je vous confirme notre réunion demain à 10h...',
      content:
        '<p>Bonjour,</p><p>Je vous confirme notre réunion demain à 10h pour discuter de l\'avancement du projet.</p><p>Cordialement,<br>Jean</p>',
      date: '2025-04-15T09:30:00',
      unread: true,
      starred: false,
      label: 'Travail',
      attachment: { name: 'Agenda.pdf', size: '2.4MB' },
    },
    // Autres messages ici...
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openMessage = (message) => {
    setSelectedMessage(message);
    setModalVisible(true);
  };

  const closeMessage = () => {
    setSelectedMessage(null);
    setModalVisible(false);
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.messageRow,
        item.unread ? styles.unreadMessage : null,
      ]}
      onPress={() => openMessage(item)}
    >
      <Avatar.Text size={40} label={item.sender.charAt(0)} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={[styles.sender, item.unread && styles.unreadSender]}>{item.sender}</Text>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.preview}>{item.preview}</Text>
      </View>
      {item.label && (
        <Chip mode="outlined" style={styles.badge}>
          {item.label}
        </Chip>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.list}
      />

      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => alert('Créer un nouveau message')}
        label="Nouveau"
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeMessage}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.modalSubject}>{selectedMessage?.subject}</Text>
            <Text style={styles.modalSender}>De: {selectedMessage?.sender}</Text>
            <Text style={styles.modalContent}>{selectedMessage?.content}</Text>
          </ScrollView>
          <Button title="Fermer" onPress={closeMessage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  messageRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  unreadMessage: {
    backgroundColor: '#f0f8ff',
  },
  avatar: {
    backgroundColor: '#00796b',
  },
  messageContent: {
    flex: 1,
    marginHorizontal: 16,
  },
  sender: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  unreadSender: {
    color: '#00796b',
  },
  subject: {
    fontSize: 14,
    color: '#333',
  },
  preview: {
    fontSize: 12,
    color: '#666',
  },
  badge: {
    backgroundColor: '#00796b',
    color: '#fff',
    paddingHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#00796b',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSender: {
    fontSize: 14,
    marginBottom: 16,
  },
  modalContent: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Inbox;
