// src/screens/main/home/HomeScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Colors from "@/utils/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { restaurantService, Category, Restaurant } from "@/services/api/restaurantService";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catRes, restRes] = await Promise.all([
        restaurantService.getCategories(),
        restaurantService.getFeaturedRestaurants(),
      ]);
      if (catRes.error) Alert.alert("Error", "Failed to load categories");
      else setCategories(catRes.data || []);

      if (restRes.error) Alert.alert("Error", "Failed to load restaurants");
      else setFeaturedRestaurants(restRes.data || []);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading delicious food...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <Icon name="location-outline" size={20} color={Colors.primary} />
          <Text style={styles.locationText}>Current Location</Text>
        </View>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Welcome */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Hi {user?.user_metadata?.full_name || "Foodie"} 👋</Text>
        <Text style={styles.subtitleText}>What would you like to eat today?</Text>
      </View>

      {/* Search */}
      <TouchableOpacity style={styles.searchBar}>
        <Icon name="search-outline" size={20} color={Colors.secondary} />
        <Text style={styles.searchPlaceholder}>Search for restaurants, food...</Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          horizontal
          data={categories}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate("CategoryRestaurants", { categoryId: item.id })
              }
            >
              <Image source={{ uri: item.image_url }} style={styles.categoryImage} />
              <Text style={styles.categoryName}>{item.category_name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Featured */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Restaurants</Text>
        {featuredRestaurants.map((rest) => (
          <TouchableOpacity
            key={rest.id}
            style={styles.restaurantCard}
            onPress={() =>
              navigation.navigate("RestaurantDetail", { restaurantId: rest.id })
            }
          >
            <Image source={{ uri: rest.image_url }} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{rest.restaurant_name}</Text>
              <View style={styles.metaRow}>
                <Icon name="star" size={14} color="#FFD700" />
                <Text style={styles.rating}>{rest.rating} ({rest.total_reviews})</Text>
                <Text style={styles.deliveryTime}>{rest.delivery_time}</Text>
              </View>
              <Text style={styles.deliveryFee}>
                Delivery: {rest.delivery_fee === 0 ? "Free" : `$${rest.delivery_fee}`} • Min: $
                {rest.minimum_order}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: Colors.secondary },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  locationRow: { flexDirection: "row", alignItems: "center" },
  locationText: { marginLeft: 6, color: Colors.primary, fontWeight: "500" },
  welcomeContainer: { paddingHorizontal: 20, marginBottom: 20 },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: Colors.primary },
  subtitleText: { fontSize: 15, color: Colors.secondary },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchPlaceholder: { marginLeft: 10, color: Colors.secondary },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 16,
    color: Colors.primary,
  },
  categoriesList: { paddingHorizontal: 20 },
  categoryItem: { alignItems: "center", marginRight: 16 },
  categoryImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 6 },
  categoryName: { fontSize: 12, color: Colors.primary },
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  restaurantImage: { width: "100%", height: 150 },
  restaurantInfo: { padding: 12 },
  restaurantName: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  rating: { marginLeft: 4, fontSize: 13, color: Colors.secondary },
  deliveryTime: { marginLeft: 8, fontSize: 13, color: Colors.secondary },
  deliveryFee: { fontSize: 13, color: Colors.secondary },
});
