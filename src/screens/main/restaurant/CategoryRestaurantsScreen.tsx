import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Colors from "@/utils/constants/colors";
import { restaurantService, Restaurant } from "@/services/api/restaurantService";
import { RootStackParamList } from "@/navigation/types"; // <-- Add this import


type CategoryRestaurantsNavigationProp = NativeStackNavigationProp<RootStackParamList, "CategoryRestaurants">;

export default function CategoryRestaurantsScreen() {
  const navigation = useNavigation<CategoryRestaurantsNavigationProp>();
  const route = useRoute();
  const { categoryId } = route.params;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, [categoryId]);

  const loadRestaurants = async () => {
    try {
      const res = await restaurantService.getRestaurantsByCategory(categoryId);
      if (res.error) {
        Alert.alert("Error", "Failed to load restaurants");
      } else {
        setRestaurants(res.data || []);
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
        <Text style={styles.loadingText}>Loading restaurants...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔥 Updated: Header */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Restaurants</Text>
      </View>

      {/* 🔥 Updated: Restaurant Cards */}
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.restaurantCard}
            onPress={() =>
              navigation.navigate("RestaurantDetail", { restaurantId: item.id })
            }
          >
            <Image source={{ uri: item.image_url }} style={styles.restaurantImage} />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{item.restaurant_name}</Text>
              <View style={styles.metaRow}>
                <Icon name="star" size={14} color="#FFD700" />
                <Text style={styles.rating}>
                  {item.rating} ({item.total_reviews})
                </Text>
                <Text style={styles.deliveryTime}>{item.delivery_time}</Text>
              </View>
              <Text style={styles.deliveryFee}>
                Delivery: {item.delivery_fee === 0 ? "Free" : `$${item.delivery_fee}`} •
                Min: ${item.minimum_order}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: Colors.secondary },

  // 🔥 Updated Header
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  iconBtn: { marginRight: 8, padding: 4 },
  title: { fontSize: 20, fontWeight: "bold", color: Colors.primary },

  // 🔥 Updated Restaurant Card
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
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.text,
  },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  rating: { marginLeft: 4, fontSize: 13, color: Colors.secondary },
  deliveryTime: { marginLeft: 8, fontSize: 13, color: Colors.secondary },
  deliveryFee: { fontSize: 13, color: Colors.secondary },
});
