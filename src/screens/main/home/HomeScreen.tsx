import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Colors from "@/utils/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { restaurantService, Category, Restaurant } from "@/services/api/restaurantService";
import { discountService, Discount } from "@/services/api/discountService";
import { RootStackParamList } from "@/navigation/types"; // <-- New import

export default function HomeScreen() {

  type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catRes, restRes, discRes] = await Promise.all([
        restaurantService.getCategories(),
        restaurantService.getFeaturedRestaurants(),
        discountService.getActiveDiscounts(),
      ]);

      if (catRes.error) Alert.alert("Error", "Failed to load categories");
      else setCategories(catRes.data || []);

      if (restRes.error) Alert.alert("Error", "Failed to load restaurants");
      else setFeaturedRestaurants(restRes.data || []);

      if (discRes.error) Alert.alert("Error", "Failed to load discounts");
      else setDiscounts(discRes.data || []);
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
          <Text style={styles.locationText}>Times Square</Text>
        </View>

        <View style={styles.headerIcons}>
          {/* Cart */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              // --------------------------
              // ✅ Ensure userId is defined before navigating
              // --------------------------
              if (user?.id) {
                navigation.navigate("Cart", { userId: user.id });
              } else {
                Alert.alert("Error", "User not logged in");
              }
            }}
          >
            <Icon name="cart-outline" size={26} color={Colors.primary} />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity style={styles.iconBtn}>
            <Icon name="notifications-outline" size={26} color={Colors.primary} />
          </TouchableOpacity>
        </View>
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

      {/* Discounts */}
      {discounts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <FlatList
            horizontal
            data={discounts}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.discountBanner}>
                <Image source={{ uri: item.image_url }} style={styles.discountImage} />
                <View style={styles.discountTextContainer}>
                  <Text style={styles.discountText}>{item.discount_percent}% OFF</Text>
                  <Text style={styles.discountSubText}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>
      )}

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
              onPress={() => navigation.navigate("CategoryRestaurants", { categoryId: item.id })}
            >
              <Image source={{ uri: item.image_url }} style={styles.categoryImage} />
              <Text style={styles.categoryName}>{item.category_name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Featured Restaurants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Restaurants</Text>
        {featuredRestaurants.map((rest) => (
          <TouchableOpacity
            key={rest.id}
            style={styles.restaurantCard}
            onPress={() => navigation.navigate("RestaurantDetail", { restaurantId: rest.id })}
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
    paddingTop: 20,
    paddingBottom: 20,
  },

  headerIcons: {
  flexDirection: "row",
  alignItems: "center",
},
iconBtn: {
  marginLeft: 16,
},

  locationRow: { flexDirection: "row", alignItems: "center" },
  locationText: { marginLeft: 6, color: Colors.secondary, fontWeight: "500" },

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
    marginBottom: 12,
    color: Colors.primary,
  },

  // Discounts
  discountBanner: {
    width: 320,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
  },
  discountImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  discountTextContainer: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  discountText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  discountSubText: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
  },

  categoriesList: { paddingHorizontal: 20 },
  categoryItem: { alignItems: "center", marginRight: 30 },
  categoryImage: { width: 55, height: 55, marginBottom: 6, },
  categoryName: { fontSize: 12, color: Colors.secondary },

  restaurantCard: {
    backgroundColor: Colors.backgroundLight,
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
  restaurantName: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: Colors.text, },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  rating: { marginLeft: 4, fontSize: 13, color: Colors.secondary },
  deliveryTime: { marginLeft: 8, fontSize: 13, color: Colors.secondary },
  deliveryFee: { fontSize: 13, color: Colors.secondary },
});
