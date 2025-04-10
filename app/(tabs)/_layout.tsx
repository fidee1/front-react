import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const [selectedTab, setSelectedTab] = React.useState('home');

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>{selectedTab === 'home' ? 'Home Screen' : 'Explore Screen'}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#ddd' }}>
        <TouchableOpacity onPress={() => setSelectedTab('home')}>
          <Text style={{ fontSize: 18, color: selectedTab === 'home' ? 'blue' : 'black' }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('explore')}>
          <Text style={{ fontSize: 18, color: selectedTab === 'explore' ? 'blue' : 'black' }}>Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
