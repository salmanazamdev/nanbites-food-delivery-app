import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import Colors from "@/utils/constants/colors";
import { restaurantService, Restaurant } from "@/services/api/restaurantService";

export default function CategoryRestaurantsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { restaurantId } = route.params;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurant();
  }, [restaurantId]);

  const loadRestaurant = async () => {
    try {
      const res = await restaurantService.getRestaurantById(restaurantId);
      if (res.error) {
        Alert.alert("Error", "Failed to load restaurant details");
      } else {
        setRestaurant(res.data);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Fetching restaurant details...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Hero Image with Back + Favorite */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: restaurant.image_url }} style={styles.heroImage} />
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Icon name="arrow-back" size={24} color={Colors.background} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Icon name="heart-outline" size={24} color={Colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Restaurant Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.restaurantName}>{restaurant.restaurant_name}</Text>
        <View style={styles.metaRow}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>
            {restaurant.rating} ({restaurant.total_reviews})
          </Text>
          <Text style={styles.deliveryTime}>{restaurant.delivery_time}</Text>
        </View>
        <Text style={styles.deliveryFee}>
          Delivery: {restaurant.delivery_fee === 0 ? "Free" : `$${restaurant.delivery_fee}`} •
          Min: ${restaurant.minimum_order}
        </Text>
        <Text style={styles.address}>{restaurant.address}</Text>
      </View>

      {/* Menu Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu</Text>
        {restaurant.menu_items && restaurant.menu_items.length > 0 ? (
          restaurant.menu_items.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <Image source={{ uri: item.image_url }} style={styles.menuImage} />
              <View style={styles.menuContent}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDesc}>{item.description}</Text>
                <Text style={styles.menuPrice}>${item.price}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No items available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: Colors.secondary },

  // 🔥 Updated: Hero Image
  heroContainer: { position: "relative" },
  heroImage: { width: "100%", height: 220 },
  topBar: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconBtn: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 30,
  },

  // Info Section
  infoContainer: { padding: 20, backgroundColor: Colors.backgroundLight, borderRadius: 12, margin: 16 },
  restaurantName: { fontSize: 22, fontWeight: "bold", color: Colors.text, marginBottom: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  rating: { marginLeft: 4, fontSize: 14, color: Colors.secondary },
  deliveryTime: { marginLeft: 8, fontSize: 14, color: Colors.secondary },
  deliveryFee: { fontSize: 14, color: Colors.secondary, marginBottom: 6 },
  address: { fontSize: 14, color: Colors.textSecondary },

  // Menu Section
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: Colors.primary, marginBottom: 12 },
  menuItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuImage: { width: 80, height: 80 },
  menuContent: { flex: 1, padding: 10 },
  menuName: { fontSize: 16, fontWeight: "bold", color: Colors.text },
  menuDesc: { fontSize: 13, color: Colors.textSecondary, marginVertical: 4 },
  menuPrice: { fontSize: 14, fontWeight: "bold", color: Colors.primary },

  emptyText: { fontSize: 14, color: Colors.secondary, textAlign: "center", marginTop: 10 },
});
