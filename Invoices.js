import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  RefreshControl,
  SafeAreaView, 
  Platform,
  StatusBar,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "./api";

const Invoices = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Récupération sécurisée des données d'authentification
  const { role, user, token } = useSelector(state => ({
    role: state.auth.role,
    user: state.auth.user || {},
    token: state.auth.token
  }));

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoices = async () => {
    try {
      if (!token || !user?.id) return;
      
      const endpoint = role === "freelancer" 
        ? `/freelancers/${user.id}/invoices`
        : `/clients/${user.id}/invoices`;

      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInvoices(response.data);
    } catch (error) {
      console.error("Fetch invoices error:", error);
      Alert.alert("Error", "Failed to load invoices");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [token, user?.id, role]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInvoices();
  };

  // Vérification du rôle pour l'affichage conditionnel
  if (!role) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading user information...</Text>
      </SafeAreaView>
    );
  }

  const renderInvoiceItem = ({ item }) => (
    <View style={styles.invoiceCard}>
      <Text style={styles.amount}>{item.amount} TND</Text>
      <Text style={styles.client}>
        {role === "freelancer" 
          ? `Client: ${item.client_name}`
          : `Freelancer: ${item.freelancer_name}`}
      </Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Invoices</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={invoices}
          renderItem={renderInvoiceItem}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#0F2573"]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No invoices found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F2573",
    padding: 15,
  },
  title: {
    color: "white",
    fontSize: 20,
    marginLeft: 15,
    fontWeight: "bold",
  },
  invoiceCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F2573",
  },
  client: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  status: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default Invoices;