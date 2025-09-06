import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock data for demonstration
const CATEGORIES = [
  { id: '1', name: 'Clothing', icon: 'shirt-outline' },
  { id: '2', name: 'Electronics', icon: 'phone-portrait-outline' },
  { id: '3', name: 'Furniture', icon: 'bed-outline' },
  { id: '4', name: 'Books', icon: 'book-outline' },
  { id: '5', name: 'Toys', icon: 'game-controller-outline' },
  { id: '6', name: 'Sports', icon: 'basketball-outline' },
];

const FEATURED_ITEMS = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    price: '$25',
    category: 'Clothing',
    image: 'https://placehold.co/150x150/2E8B57/white?text=Denim+Jacket'
  },
  {
    id: '2',
    title: 'iPhone 12 Pro',
    price: '$450',
    category: 'Electronics',
    image: 'https://placehold.co/150x150/2E8B57/white?text=iPhone'
  },
  {
    id: '3',
    title: 'Wooden Coffee Table',
    price: '$80',
    category: 'Furniture',
    image: 'https://placehold.co/150x150/2E8B57/white?text=Coffee+Table'
  },
  {
    id: '4',
    title: 'Designer Handbag',
    price: '$65',
    category: 'Accessories',
    image: 'https://placehold.co/150x150/2E8B57/white?text=Handbag'
  },
];

export default function EcoFindsApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated login state

  const handleSearch = () => {
    // In a real app, this would filter products
    console.log('Searching for:', searchQuery);
    alert(`Searching for: ${searchQuery}`);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon} size={24} color="#2E8B57" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header with logo and navigation */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={28} color="#2E8B57" />
          <Text style={styles.logoText}>EcoFinds</Text>
        </View>
        
        <View style={styles.navContainer}>
          {isLoggedIn ? (
            <TouchableOpacity style={styles.userButton}>
              <Ionicons name="person-circle" size={28} color="#2E8B57" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.authButton}
                onPress={() => setIsLoggedIn(true)}
              >
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.authButton, styles.signupButton]}
                onPress={() => alert('Navigate to Sign Up')}
              >
                <Text style={[styles.authButtonText, styles.signupButtonText]}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Tagline */}
        <Text style={styles.tagline}>Empowering Sustainable Consumption</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for pre-owned items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Featured Items Section */}
        <Text style={styles.sectionTitle}>Featured Items</Text>
        <FlatList
          data={FEATURED_ITEMS}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />

        {/* How It Works Section */}
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.howItWorks}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>List Items</Text>
            <Text style={styles.stepDescription}>Snap a photo and create your listing</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Connect</Text>
            <Text style={styles.stepDescription}>Buyers message you to purchase</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Sell & Save</Text>
            <Text style={styles.stepDescription}>Complete the sale and earn money</Text>
          </View>
        </View>

        {/* Sustainability Impact */}
        <View style={styles.impactContainer}>
          <Text style={styles.impactTitle}>Your Impact with EcoFinds</Text>
          <View style={styles.impactStats}>
            <View style={styles.stat}>
              <Ionicons name="leaf" size={32} color="#2E8B57" />
              <Text style={styles.statNumber}>5,247</Text>
              <Text style={styles.statLabel}>Items Saved</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="water" size={32} color="#2E8B57" />
              <Text style={styles.statNumber}>1.2M</Text>
              <Text style={styles.statLabel}>Liters of Water</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="flash" size={32} color="#2E8B57" />
              <Text style={styles.statNumber}>287K</Text>
              <Text style={styles.statLabel}>kWh Energy Saved</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2E8B57',
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  signupButton: {
    backgroundColor: '#2E8B57',
  },
  authButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E8B57',
  },
  signupButtonText: {
    color: '#fff',
  },
  userButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  categoriesList: {
    paddingBottom: 8,
    marginBottom: 24,
  },
  categoryItem: {
    width: 100,
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  productsList: {
    paddingBottom: 8,
    marginBottom: 24,
  },
  productCard: {
    width: 150,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productInfo: {
    padding: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  howItWorks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  impactContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2E8B57',
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
    color: '#2E8B57',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});