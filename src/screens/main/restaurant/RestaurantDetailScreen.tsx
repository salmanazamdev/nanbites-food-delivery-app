import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRoute, useNavigation } from "@react-navigation/native";
import Colors from "@/utils/constants/colors";
import { restaurantService, Restaurant } from "@/services/api/restaurantService";

export default function RestaurantDetailScreen() {
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
        Alert.alert("Error", "Failed to load restaurant");
      } else {
        setRestaurant(res.data || null);
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
        <Text style={styles.loadingText}>Loading restaurant...</Text>
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🔥 Updated: Restaurant Header with Image + Back/Heart */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: restaurant.image_url }} style={styles.image} />
        <TouchableOpacity style={styles.topLeftIcon} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topRightIcon}>
          <Icon name="heart-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 🔥 Updated: Restaurant Info */}
      <View style={styles.infoSection}>
        <Text style={styles.title}>{restaurant.restaurant_name}</Text>

        <View style={styles.row}>
          <Icon name="star" size={18} color="#FFD700" />
          <Text style={styles.ratingText}>
            {restaurant.rating}{" "}
            <Text style={styles.ratingCount}>({restaurant.total_reviews} reviews)</Text>
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="location-outline" size={18} color={Colors.accent} />
          <Text style={styles.locationText}>{restaurant.address}</Text>
        </View>

        <View style={styles.row}>
          <Icon name="bicycle-outline" size={18} color={Colors.accent} />
          <Text style={styles.deliveryFee}>
            Delivery: {restaurant.delivery_fee === 0 ? "Free" : `$${restaurant.delivery_fee}`} •
            Min: ${restaurant.minimum_order}
          </Text>
        </View>

        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
          <MaterialCommunityIcons name="sale" size={22} color={Colors.accent} />
          <Text style={styles.offerText}>Special offers available</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 Updated: Menu Section */}
      <Text style={styles.menuTitle}>Menu</Text>
      <FlatList
        data={restaurant.menu_items}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("MenuItemDetail", { itemId: item.id })
            }
          >
            <Image source={{ uri: item.image_url || restaurant.image_url }} style={styles.menuImage} />
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuPrice}>${item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: Colors.secondary },

  // 🔥 Header Image + Buttons
  imageWrapper: { position: "relative" },
  image: {
    width: "100%",
    height: 220,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topLeftIcon: {
    position: "absolute",
    top: 30,
    left: 18,
    backgroundColor: "#0007",
    borderRadius: 20,
    padding: 6,
  },
  topRightIcon: {
    position: "absolute",
    top: 30,
    right: 18,
    backgroundColor: "#0007",
    borderRadius: 20,
    padding: 6,
  },

  // 🔥 Info Section
  infoSection: { padding: 18, paddingBottom: 0 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: Colors.text },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  ratingText: { fontSize: 16, color: "#FFD700", marginLeft: 6, fontWeight: "bold" },
  ratingCount: { color: Colors.secondary, fontWeight: "normal", fontSize: 14 },
  locationText: { fontSize: 15, color: Colors.text, marginLeft: 6 },
  deliveryFee: { fontSize: 15, color: Colors.secondary, marginLeft: 6 },
  offerText: {
    fontSize: 16,
    color: Colors.accent,
    marginLeft: 6,
    fontWeight: "600",
  },

  // 🔥 Menu Section
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginLeft: 18,
    marginTop: 18,
    marginBottom: 10,
  },
  menuCard: {
    width: 140,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 14,
    marginRight: 14,
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  menuImage: { width: 90, height: 90, borderRadius: 12, marginBottom: 8, backgroundColor: "#eee" },
  menuName: { fontSize: 14, fontWeight: "bold", color: Colors.text, textAlign: "center" },
  menuPrice: { fontSize: 13, color: Colors.accent, fontWeight: "bold", marginTop: 2 },
});
