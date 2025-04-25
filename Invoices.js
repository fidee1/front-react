import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Card, Badge, Button } from 'react-native-paper';

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

const invoices = [
  { id: 'INV001', projectName: 'E-commerce Platform', date: '2025-04-01', amount: 150.00, status: 'Paid' },
  { id: 'INV002', projectName: 'Portfolio Website', date: '2025-03-20', amount: 300.00, status: 'Pending' },
  { id: 'INV003', projectName: 'Task Management App', date: '2025-02-15', amount: 200.00, status: 'Paid' },
  { id: 'INV004', projectName: 'CRM System', date: '2025-01-10', amount: 450.00, status: 'Cancelled' },
  { id: 'INV005', projectName: 'Mobile Application', date: '2024-12-05', amount: 175.50, status: 'Paid' },
];

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const getStatusColor = (status) => {
  const statusColors = {
    'Paid': '#4CAF50', // green
    'Pending': '#FFC107', // yellow
    'Cancelled': '#F44336' // red
  };
  return statusColors[status] || '#9E9E9E'; // gray as default
};

const downloadInvoice = (invoice) => {
  console.log(`Downloading invoice: ${invoice.id}`);
};

const viewDetails = (invoice) => {
  console.log(`Viewing details for: ${invoice.id}`);
};

const InvoiceItem = ({ item }) => (
  <Card style={styles.invoiceCard}>
    <Card.Content>
      <View style={styles.invoiceHeader}>
        <Text style={styles.invoiceId}>{item.id}</Text>
        <Badge style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          {item.status}
        </Badge>
      </View>
      
      <Text style={styles.projectName}>{item.projectName}</Text>
      
      <View style={styles.invoiceDetails}>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        <Text style={styles.amountText}>{item.amount.toFixed(2)} €</Text>
      </View>
      
      <View style={styles.actionButtons}>
        <Button 
          mode="contained" 
          style={[styles.button, styles.downloadButton]}
          labelStyle={styles.buttonLabel}
          onPress={() => downloadInvoice(item)}
        >
          Download
        </Button>
        <Button 
          mode="outlined" 
          style={[styles.button, styles.detailsButton]}
          labelStyle={[styles.buttonLabel, { color: palette.DARK_BLUE }]}
          onPress={() => viewDetails(item)}
        >
          Details
        </Button>
      </View>
    </Card.Content>
  </Card>
);

export default function Invoices() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={palette.DARK_BLUE} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Invoices</Text>
      </View>
      
      <FlatList
        data={invoices}
        renderItem={({ item }) => <InvoiceItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>Showing {invoices.length} invoices</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F2FF',
  },
  header: {
    backgroundColor: palette.DARK_BLUE,
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  invoiceCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceId: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.DARK_BLUE,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  projectName: {
    fontSize: 16,
    color: palette.DARKER_BLUE,
    marginBottom: 8,
    fontWeight: '500',
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.DARK_BLUE,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  downloadButton: {
    backgroundColor: palette.MEDIUM_BLUE,
  },
  detailsButton: {
    borderColor: palette.MEDIUM_BLUE,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
});